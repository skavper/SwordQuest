import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { authenticated, buildMessage, loadConfig, RateLimiter, validateEvent } from '../src/core.mjs';
import { Store } from '../src/store.mjs';
import { DiscordError, DiscordTransport, Worker } from '../src/discord.mjs';
import { makeServer } from '../src/http.mjs';

const quiet = () => {};
const env = {
  DISCORD_BOT_TOKEN: 'fake-test-token-not-a-secret', DISCORD_CHANNEL_ID: '123456789012345678',
  ROBLOX_API_KEY: 'test-only-not-a-secret-0123456789abcdef', ROBLOX_UNIVERSE_ID: '123456',
};
const config = () => loadConfig(env);
const sample = () => ({
  eventId: randomUUID(), type: 'rare_drop', universeId: 123456, placeId: 987654,
  timestamp: Math.floor(Date.now() / 1000),
  player: { userId: 12345, username: 'ExamplePlayer', displayName: 'Example Player' },
  reward: { name: 'Celestial Blade', rarity: 'Mythic', chanceDenominator: 100000 },
  source: 'Grasslands Slime',
});
const event = () => validateEvent(sample(), 123456);
function storeFor(t, maxQueue = 10) {
  const store = new Store(':memory:', maxQueue);
  t.after(() => store.close());
  return store;
}
function enqueue(store, e = event(), now = Date.now()) {
  store.accept(e, env.DISCORD_CHANNEL_ID, true, now);
  return e;
}

test('configuration rejects absent secrets and invalid IDs', () => {
  assert.throws(() => loadConfig({}), /ROBLOX_API_KEY/);
  assert.throws(() => loadConfig({ ...env, ROBLOX_API_KEY: 'short' }), /ROBLOX_API_KEY/);
  assert.throws(() => loadConfig({ ...env, DISCORD_CHANNEL_ID: 'not-an-id' }), /channel/);
  assert.throws(() => loadConfig({ ...env, ROBLOX_UNIVERSE_ID: '0' }), /ROBLOX_UNIVERSE_ID/);
  assert.throws(() => loadConfig({ ...env, PORT: '-2' }), /PORT/);
  assert.throws(() => loadConfig({ ...env, NOTIFY_RARITIES: 'Secret,' }), /NOTIFY_RARITIES/);
});
test('channel routing and rarity list are configurable', () => {
  const c = loadConfig({ ...env, DISCORD_HATCH_CHANNEL_ID: '987654321012345678', NOTIFY_RARITIES: ' Secret, Divine ' });
  assert.equal(c.channels.rare_hatch, '987654321012345678');
  assert.deepEqual([...c.rarities], ['secret', 'divine']);
});
test('auth rejects missing, incorrect, duplicate or oversized keys', () => {
  assert.equal(authenticated(undefined, env.ROBLOX_API_KEY), false);
  assert.equal(authenticated('wrong', env.ROBLOX_API_KEY), false);
  assert.equal(authenticated([env.ROBLOX_API_KEY], env.ROBLOX_API_KEY), false);
  assert.equal(authenticated('x'.repeat(300), env.ROBLOX_API_KEY), false);
  assert.equal(authenticated(env.ROBLOX_API_KEY, env.ROBLOX_API_KEY), true);
});
test('valid payload is normalized; caller cannot choose a Discord channel', () => {
  const raw = sample(); raw.channelId = 'attacker-channel'; raw.reward.quantity = 2;
  const e = validateEvent(raw, 123456);
  assert.equal(e.channelId, undefined); assert.equal(e.reward.quantity, 2);
  assert.equal(validateEvent({ ...raw, eventId: raw.eventId.toUpperCase() }, 123456).eventId, raw.eventId);
});
for (const [name, mutate] of [
  ['wrong universe', (e) => { e.universeId = 1; }],
  ['bad event type', (e) => { e.type = 'broadcast_anything'; }],
  ['bad UUID', (e) => { e.eventId = 'not-a-guid'; }],
  ['negative player ID', (e) => { e.player.userId = -1; }],
  ['unsafe integer', (e) => { e.placeId = Number.MAX_SAFE_INTEGER + 1; }],
  ['oversized item', (e) => { e.reward.name = 'a'.repeat(101); }],
  ['invalid quantity', (e) => { e.reward.quantity = 0; }],
  ['invalid odds', (e) => { e.reward.chanceDenominator = 0; }],
  ['old timestamp', (e) => { e.timestamp -= 90000; }],
  ['future timestamp', (e) => { e.timestamp += 600; }],
  ['control characters', (e) => { e.source = 'Slime\n@everyone'; }],
  ['null reward', (e) => { e.reward = null; }],
]) test(`validation rejects ${name}`, () => { const e = sample(); mutate(e); assert.throws(() => validateEvent(e, 123456)); });
test('null and arrays are not events', () => {
  for (const bad of [null, [], 'event']) assert.throws(() => validateEvent(bad, 123456));
});
test('Discord embeds escape content, disable pings and use stable nonces', () => {
  const e = event(); e.player.displayName = '@everyone **Oops**'; e.reward.name = '[Fake](https://bad.example)';
  const message = buildMessage(e);
  assert.deepEqual(message.allowed_mentions.parse, []);
  assert.ok(!message.embeds[0].description.includes('@everyone'));
  assert.ok(message.embeds[0].description.includes('\\*\\*Oops\\*\\*'));
  assert.equal(message.nonce.length, 25); assert.equal(message.enforce_nonce, true);
  assert.equal(message.nonce, buildMessage(e).nonce);
  assert.equal(message.embeds[0].fields.find((f) => f.name === 'Drop chance').value, '1 in 100,000');
});
test('token bucket refills and never accepts unlimited requests', () => {
  const limiter = new RateLimiter(2, 0);
  assert.equal(limiter.take(0), true); assert.equal(limiter.take(0), true); assert.equal(limiter.take(0), false);
  assert.equal(limiter.take(30000), true); assert.equal(limiter.take(30000), false);
});
test('outbox deduplicates and detects reused IDs with different content', (t) => {
  const s = storeFor(t); const e = enqueue(s);
  assert.equal(s.accept(e, env.DISCORD_CHANNEL_ID, true).duplicate, true);
  assert.equal(s.stats().queued, 1);
  assert.throws(() => s.accept({ ...e, source: 'Different Slime' }, env.DISCORD_CHANNEL_ID, true), { status: 409 });
});
test('queue capacity is bounded, but retries of existing IDs are accepted', (t) => {
  const s = storeFor(t, 1); const e = enqueue(s);
  assert.throws(() => enqueue(s), { status: 503 });
  assert.equal(s.accept(e, env.DISCORD_CHANNEL_ID, true).duplicate, true);
});
test('ignored rarities are never delivered', (t) => {
  const s = storeFor(t); const e = event();
  assert.equal(s.accept(e, env.DISCORD_CHANNEL_ID, false).status, 'ignored');
  assert.equal(s.due(), undefined);
});
test('queue and rate-limit pause survive reopening the database', () => {
  const dir = mkdtempSync(join(tmpdir(), 'swordquest-test-'));
  let s;
  try {
    s = new Store(join(dir, 'outbox.sqlite')); const e = enqueue(s); s.pause(123456789);
    s.close(); s = new Store(join(dir, 'outbox.sqlite'));
    assert.equal(s.get(e.eventId).status, 'queued'); assert.equal(s.pauseUntil(), 123456789);
  } finally { s?.close(); rmSync(dir, { recursive: true, force: true }); }
});
test('pruning removes old terminal records, never pending notifications', (t) => {
  const s = storeFor(t); const a = enqueue(s, event(), 1); const b = enqueue(s, event(), 1);
  s.sent(a.eventId, 'message', 1); s.prune(8 * 86400000);
  assert.equal(s.get(a.eventId), undefined); assert.equal(s.get(b.eventId).status, 'queued');
});
test('worker sends once and stores Discord message ID', async (t) => {
  const s = storeFor(t); const e = enqueue(s); let calls = 0;
  const w = new Worker(s, { send: async (channel, payload) => {
    calls++; assert.equal(channel, env.DISCORD_CHANNEL_ID); assert.equal(payload.enforce_nonce, true);
    return { messageId: 'discord-message' };
  } }, { log: quiet });
  await w.tick(); await w.tick();
  assert.equal(calls, 1); assert.equal(s.get(e.eventId).message_id, 'discord-message');
});
test('worker cannot overlap sends in one process', async (t) => {
  const s = storeFor(t); enqueue(s); let resolve; let calls = 0;
  const w = new Worker(s, { send: () => { calls++; return new Promise((r) => { resolve = r; }); } }, { log: quiet });
  const first = w.tick(); await w.tick(); resolve({ messageId: 'one' }); await first;
  assert.equal(calls, 1);
});
test('Discord 429 pauses all delivery without using up retry attempts', async (t) => {
  const s = storeFor(t); let now = Date.now(); const a = enqueue(s, event(), now); enqueue(s, event(), now); let calls = 0;
  const w = new Worker(s, { send: async () => { calls++; throw new DiscordError(429, 5000); } }, { log: quiet, now: () => now });
  await w.tick(); now += 1000; await w.tick();
  assert.equal(calls, 1); assert.equal(s.get(a.eventId).attempts, 0); assert.ok(s.pauseUntil() > now);
});
test('transient errors back off, then succeed', async (t) => {
  const s = storeFor(t); let now = Date.now(); const e = enqueue(s, event(), now); let calls = 0;
  const w = new Worker(s, { send: async () => { if (++calls === 1) throw new DiscordError(503); return { messageId: 'retried' }; } }, { log: quiet, now: () => now });
  await w.tick(); assert.equal(s.get(e.eventId).status, 'queued'); assert.equal(s.get(e.eventId).attempts, 1);
  await w.tick(); assert.equal(calls, 1);
  now += 5000; await w.tick(); assert.equal(s.get(e.eventId).status, 'sent');
});
test('permission failures are marked failed and pause invalid requests', async (t) => {
  const s = storeFor(t); const e = enqueue(s);
  const w = new Worker(s, { send: async () => { throw new DiscordError(403); } }, { log: quiet });
  await w.tick(); assert.equal(s.get(e.eventId).status, 'failed'); assert.ok(s.pauseUntil() > Date.now());
});
test('twelve transient failures move an event to failed', async (t) => {
  const s = storeFor(t); let now = Date.now(); const e = enqueue(s, event(), now);
  const w = new Worker(s, { send: async () => { throw new Error('offline'); } }, { log: quiet, now: () => now });
  for (let i = 0; i < 12; i++) { await w.tick(); now += 4000000; }
  assert.equal(s.get(e.eventId).status, 'failed'); assert.equal(s.get(e.eventId).attempts, 12);
});
test('transport uses Bot authentication and honourable rate-limit delay', async () => {
  const transport = new DiscordTransport(env.DISCORD_BOT_TOKEN, async (url, options) => {
    assert.ok(url.endsWith('/channels/123456789012345678/messages'));
    assert.equal(options.headers.Authorization, `Bot ${env.DISCORD_BOT_TOKEN}`);
    assert.equal(options.redirect, 'error');
    return new Response(JSON.stringify({ retry_after: 2.5 }), { status: 429 });
  });
  await assert.rejects(() => transport.send(env.DISCORD_CHANNEL_ID, {}), { status: 429, retryAfterMs: 2500 });
});
test('transport respects exhausted rate-limit buckets on success', async () => {
  const transport = new DiscordTransport('fake', async () => new Response(JSON.stringify({ id: 'message' }), {
    status: 200, headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset-after': '1.5' },
  }));
  assert.deepEqual(await transport.send(env.DISCORD_CHANNEL_ID, {}), { messageId: 'message', cooldown: 1750 });
});

async function fixture(t, overrides = {}) {
  const s = storeFor(t); const c = { ...config(), ...overrides }; const server = makeServer(c, s, quiet);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); }));
  const url = `http://127.0.0.1:${server.address().port}`;
  const post = (body, key = env.ROBLOX_API_KEY, extraHeaders = {}) => fetch(`${url}/hooks/roblox`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...(key ? { 'x-api-key': key } : {}), ...extraHeaders },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
  return { s, c, server, url, post };
}
test('HTTP returns health, rejects unauthorized calls and accepts valid events', async (t) => {
  const f = await fixture(t); const e = sample();
  assert.equal((await fetch(`${f.url}/healthz`)).status, 200);
  assert.equal((await f.post(e, '')).status, 401);
  assert.equal((await f.post(e, 'bad')).status, 401);
  const accepted = await f.post(e); assert.equal(accepted.status, 202); assert.equal((await accepted.json()).status, 'queued');
  const duplicate = await f.post(e); assert.equal(duplicate.status, 200); assert.equal((await duplicate.json()).duplicate, true);
  assert.equal(f.s.stats().queued, 1);
});
test('HTTP reports validation, size and media errors correctly', async (t) => {
  const f = await fixture(t);
  assert.equal((await f.post('{')).status, 400);
  assert.equal((await f.post('null')).status, 400);
  assert.equal((await f.post(sample(), env.ROBLOX_API_KEY, { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await f.post('x'.repeat(20000))).status, 413);
  assert.equal((await f.post({ ...sample(), universeId: 9 })).status, 403);
});
test('HTTP filters rarities and returns delivery status without exposing payloads', async (t) => {
  const f = await fixture(t); const e = sample(); e.reward.rarity = 'Common';
  const ignored = await f.post(e); assert.equal((await ignored.json()).status, 'ignored');
  const headers = { 'x-api-key': env.ROBLOX_API_KEY };
  const status = await fetch(`${f.url}/hooks/roblox/${e.eventId}`, { headers });
  const body = await status.json(); assert.equal(body.status, 'ignored'); assert.equal(body.player, undefined);
  assert.equal((await fetch(`${f.url}/status`)).status, 401);
  const stats = await fetch(`${f.url}/status`, { headers }); assert.equal((await stats.json()).ignored, 1);
});
test('HTTP throttles authenticated bursts and returns Retry-After', async (t) => {
  const f = await fixture(t, { requestsPerMinute: 1 });
  assert.equal((await f.post(sample())).status, 202);
  const throttled = await f.post(sample()); assert.equal(throttled.status, 429); assert.equal(throttled.headers.get('retry-after'), '60');
});
test('end-to-end with fake Discord: accepted event becomes a sent notification', async (t) => {
  const f = await fixture(t); const e = sample(); let sent;
  await f.post(e);
  const transport = new DiscordTransport('fake', async (_url, options) => {
    sent = JSON.parse(options.body); return new Response(JSON.stringify({ id: '123456789098765432' }), { status: 200 });
  });
  await new Worker(f.s, transport, { log: quiet }).tick();
  const response = await fetch(`${f.url}/hooks/roblox/${e.eventId}`, { headers: { 'x-api-key': env.ROBLOX_API_KEY } });
  assert.equal((await response.json()).status, 'sent');
  assert.ok(sent.embeds[0].description.includes('Celestial Blade'));
});


test('repeated award hook with same ID and a later timestamp stays a duplicate', (t) => {
  const s = storeFor(t); const e = enqueue(s);
  assert.equal(s.accept({ ...e, timestamp: e.timestamp + 2 }, env.DISCORD_CHANNEL_ID, true).duplicate, true);
  assert.equal(JSON.parse(s.get(e.eventId).payload).timestamp, e.timestamp);
});
test('transport uses a safe fallback when a 429 omits retry headers', async () => {
  const transport = new DiscordTransport('fake', async () => new Response('{}', { status: 429 }));
  await assert.rejects(() => transport.send(env.DISCORD_CHANNEL_ID, {}), { retryAfterMs: 5000 });
});
