import { buildMessage } from './core.mjs';

export class DiscordError extends Error {
  constructor(status, retryAfterMs = 0) {
    super(`Discord HTTP ${status}`); this.status = status; this.retryAfterMs = retryAfterMs;
  }
}
const seconds = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.ceil(n * 1000) : fallback;
};

/** REST-only bot: no Gateway connection, message-reading intent or slash commands required. */
export class DiscordTransport {
  constructor(token, fetchImpl = fetch) { this.token = token; this.fetchImpl = fetchImpl; }
  async send(channelId, payload) {
    const response = await this.fetchImpl(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10000),
      headers: {
        Authorization: `Bot ${this.token}`, 'Content-Type': 'application/json',
        'User-Agent': 'DiscordBot (https://github.com/skavper/SwordQuest, 1.0.0)',
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const retryAfter = seconds(data.retry_after ?? response.headers.get('retry-after'), 5000);
      throw new DiscordError(response.status, response.status === 429 ? Math.max(1000, retryAfter) : 0);
    }
    if (typeof data.id !== 'string') throw new DiscordError(502);
    const cooldown = response.headers.get('x-ratelimit-remaining') === '0'
      ? seconds(response.headers.get('x-ratelimit-reset-after'), 1000) + 250 : 0;
    return { messageId: data.id, cooldown };
  }
}

export class Worker {
  constructor(store, transport, { now = Date.now, log = console.log } = {}) {
    this.store = store; this.transport = transport; this.now = now; this.log = log; this.busy = false;
  }
  async tick() {
    if (this.busy || this.store.pauseUntil() > this.now()) return;
    const row = this.store.due(this.now());
    if (!row) return;
    this.busy = true;
    try {
      let result;
      try {
        result = await this.transport.send(row.channel, buildMessage(JSON.parse(row.payload)));
      } catch (error) {
        const now = this.now();
        const status = error instanceof DiscordError ? error.status : 0;
        const reason = status ? `discord_http_${status}` : 'network_or_delivery_error';
        if (status === 429) {
          const until = now + error.retryAfterMs + 250;
          this.store.pause(until); // Persist the pause across host restarts; pause ALL outgoing requests.
          this.store.retry(row.id, until, reason, false, now);
        } else if ((status >= 400 && status < 500 && status !== 408) || row.attempts >= 11) {
          this.store.failed(row.id, reason, now);
          // Bad credentials/permissions should not create a stream of invalid Discord requests.
          if ([401, 403, 404].includes(status)) this.store.pause(now + 600000);
        } else {
          const backoff = Math.min(3600000, 2000 * 2 ** row.attempts) + Math.floor(Math.random() * 1000);
          this.store.retry(row.id, now + backoff, reason, true, now);
        }
        this.log(JSON.stringify({ event: 'delivery_problem', eventId: row.id, reason }));
        return;
      }
      // DB failures must escape to the supervisor, not be mistaken for network failures.
      this.store.sent(row.id, result.messageId, this.now());
      if (result.cooldown) this.store.pause(this.now() + result.cooldown);
      this.log(JSON.stringify({ event: 'delivered', eventId: row.id, messageId: result.messageId }));
    } finally { this.busy = false; }
  }
}
