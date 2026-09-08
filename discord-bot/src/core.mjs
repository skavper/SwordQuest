import { createHash, timingSafeEqual } from 'node:crypto';

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const fail = (message) => { throw new HttpError(400, message); };
const object = (v, name) => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) fail(`${name} must be an object`);
  return v;
};
const text = (v, name, max) => {
  if (typeof v !== 'string' || !v.trim() || v.length > max || /[\u0000-\u001f\u007f]/u.test(v)) {
    fail(`${name} must be non-empty text, at most ${max} characters, without control characters`);
  }
  return v.trim();
};
const integer = (v, name, max = Number.MAX_SAFE_INTEGER) => {
  if (!Number.isSafeInteger(v) || v < 1 || v > max) fail(`${name} must be a positive safe integer`);
  return v;
};
export const isEventId = (v) => typeof v === 'string' && /^[a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(v);
export const digest = (v) => createHash('sha256').update(v).digest('hex');
export function authenticated(value, secret) {
  if (typeof value !== 'string' || value.length > 256) return false;
  return timingSafeEqual(Buffer.from(digest(value)), Buffer.from(digest(secret)));
}

/** Only normalized, server-approved fields leave the validation boundary. */
export function validateEvent(input, universeId, now = Date.now()) {
  const e = object(input, 'event');
  if (!isEventId(e.eventId)) fail('eventId must be a UUID');
  if (!['rare_drop', 'rare_hatch'].includes(e.type)) fail('type must be rare_drop or rare_hatch');
  if (integer(e.universeId, 'universeId') !== universeId) throw new HttpError(403, 'Universe not allowed');
  const p = object(e.player, 'player');
  const r = object(e.reward, 'reward');
  const username = text(p.username, 'player.username', 20);
  if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) fail('Invalid Roblox username');
  const rarity = text(r.rarity, 'reward.rarity', 24);
  if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(rarity)) fail('Invalid rarity');
  const timestamp = integer(e.timestamp, 'timestamp'); // Unix seconds, not milliseconds.
  if (timestamp < now / 1000 - 86400 || timestamp > now / 1000 + 300) fail('Event is too old or in the future');
  return {
    eventId: e.eventId.toLowerCase(), type: e.type, universeId,
    placeId: integer(e.placeId, 'placeId'), timestamp,
    player: {
      userId: integer(p.userId, 'player.userId'), username,
      displayName: p.displayName === undefined ? username : text(p.displayName, 'player.displayName', 50),
    },
    reward: {
      name: text(r.name, 'reward.name', 100), rarity,
      quantity: r.quantity === undefined ? 1 : integer(r.quantity, 'reward.quantity', 99),
      ...(r.chanceDenominator === undefined ? {} : {
        chanceDenominator: integer(r.chanceDenominator, 'reward.chanceDenominator'),
      }),
    },
    source: text(e.source, 'source', 100),
  };
}

export function loadConfig(env = process.env) {
  const required = (key) => {
    const value = env[key]?.trim();
    if (!value || /CHANGE_ME|YOUR_|REPLACE_ME/.test(value)) throw new Error(`Configure ${key}`);
    return value;
  };
  const num = (key, fallback, max = Number.MAX_SAFE_INTEGER) => {
    const raw = env[key]?.trim() || String(fallback ?? '');
    if (!/^\d+$/.test(raw)) throw new Error(`${key} must be a positive integer`);
    const value = Number(raw);
    if (!Number.isSafeInteger(value) || value < 1 || value > max) throw new Error(`Invalid ${key}`);
    return value;
  };
  const channel = (value) => {
    if (!/^\d{17,20}$/.test(value)) throw new Error('Discord channel IDs must have 17-20 digits');
    return value;
  };
  const apiKey = required('ROBLOX_API_KEY');
  if (!/^[A-Za-z0-9_-]{32,256}$/.test(apiKey)) throw new Error('ROBLOX_API_KEY must have 32-256 URL-safe characters');
  const token = required('DISCORD_BOT_TOKEN');
  if (/\s/.test(token) || token.startsWith('Bot ')) throw new Error('Use the raw Discord bot token, without a prefix');
  const rarities = (env.NOTIFY_RARITIES || 'Legendary,Mythic,Mythical,Secret').split(',').map((s) => s.trim().toLowerCase());
  if (rarities.some((s) => !/^[a-z][a-z0-9_-]{0,23}$/.test(s))) throw new Error('Invalid NOTIFY_RARITIES');
  const defaultChannel = channel(required('DISCORD_CHANNEL_ID'));
  return {
    token, apiKey, universeId: num('ROBLOX_UNIVERSE_ID'),
    channels: { rare_drop: defaultChannel, rare_hatch: channel(env.DISCORD_HATCH_CHANNEL_ID?.trim() || defaultChannel) },
    rarities: new Set(rarities), port: num('PORT', 3000, 65535),
    host: env.HOST?.trim() || '0.0.0.0', databasePath: env.DATABASE_PATH?.trim() || './data/notifications.sqlite',
    maxQueue: num('MAX_QUEUE_SIZE', 10000, 100000), requestsPerMinute: num('REQUESTS_PER_MINUTE', 120, 10000),
  };
}

/** Escape player/item text and never permit mentions supplied by a caller. */
export function escapeText(value) {
  return value.replace(/[@<>]/g, (c) => ({ '@': '@\u200b', '<': '‹', '>': '›' })[c])
    .replace(/[\\`*_{}\[\]()#+\-.!|~]/g, '\\$&');
}
export function buildMessage(e) {
  const safe = escapeText;
  const fields = [
    { name: 'Item', value: safe(e.reward.name), inline: true },
    { name: 'Rarity', value: safe(e.reward.rarity), inline: true },
    { name: 'Source', value: safe(e.source), inline: true },
  ];
  if (e.reward.chanceDenominator !== undefined) fields.push({ name: 'Drop chance', value: `1 in ${e.reward.chanceDenominator.toLocaleString('en-GB')}`, inline: true });
  if (e.reward.quantity > 1) fields.push({ name: 'Quantity', value: String(e.reward.quantity), inline: true });
  const colours = { legendary: 0xf5bb35, mythic: 0xb66bff, mythical: 0xb66bff, secret: 0xf06097 };
  return {
    allowed_mentions: { parse: [], users: [], roles: [], replied_user: false },
    nonce: digest(`${e.universeId}:${e.eventId}`).slice(0, 25), enforce_nonce: true,
    embeds: [{
      title: e.type === 'rare_hatch' ? '🥚 RARE HATCH!' : '⚔️ RARE DROP!',
      description: `**${safe(e.player.displayName)}** (${safe(e.player.username)}) just ${e.type === 'rare_hatch' ? 'hatched' : 'obtained'} **${safe(e.reward.name)}**!\n[View player](https://www.roblox.com/users/${e.player.userId}/profile) · [Play SwordQuest](https://www.roblox.com/games/${e.placeId})`,
      color: colours[e.reward.rarity.toLowerCase()] ?? 0x55bb88, fields,
      footer: { text: `SwordQuest • ${e.eventId}` }, timestamp: new Date(e.timestamp * 1000).toISOString(),
    }],
  };
}

/** One bounded bucket for authenticated traffic; no reliance on spoofable proxy IP headers. */
export class RateLimiter {
  constructor(limit, now = Date.now()) { this.limit = limit; this.tokens = limit; this.updated = now; }
  take(now = Date.now()) {
    this.tokens = Math.min(this.limit, this.tokens + Math.max(0, now - this.updated) * this.limit / 60000);
    this.updated = now;
    if (this.tokens < 1) return false;
    this.tokens -= 1;
    return true;
  }
}
