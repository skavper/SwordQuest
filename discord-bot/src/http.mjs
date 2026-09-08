import { createServer } from 'node:http';
import { authenticated, HttpError, isEventId, RateLimiter, validateEvent } from './core.mjs';

const MAX_BODY = 16384;
function readJson(req) {
  if ((req.headers['content-type'] || '').split(';')[0].trim().toLowerCase() !== 'application/json') {
    throw new HttpError(415, 'Use Content-Type: application/json');
  }
  if (req.headers['content-encoding'] && req.headers['content-encoding'] !== 'identity') throw new HttpError(415, 'Compressed bodies are not supported');
  if (Number(req.headers['content-length']) > MAX_BODY) throw new HttpError(413, 'Body exceeds 16 KiB');
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0;
    const finish = (error, value) => {
      clearTimeout(timer);
      req.off('data', data); req.off('end', end); req.off('error', broken); req.off('aborted', broken);
      if (error) { req.resume(); reject(error); } else resolve(value);
    };
    const data = (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) finish(new HttpError(413, 'Body exceeds 16 KiB'));
      else chunks.push(chunk);
    };
    const end = () => {
      try { finish(null, JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { finish(new HttpError(400, 'Invalid JSON')); }
    };
    const broken = () => finish(new HttpError(400, 'Request interrupted'));
    const timer = setTimeout(() => finish(new HttpError(408, 'Request body timed out')), 10000);
    req.on('data', data); req.on('end', end); req.on('error', broken); req.on('aborted', broken);
  });
}
function reply(res, status, body, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', Connection: 'close', ...headers,
  });
  res.end(JSON.stringify(body));
}

export function makeServer(config, store, log = console.error) {
  const limiter = new RateLimiter(config.requestsPerMinute);
  const server = createServer({ maxHeaderSize: 8192 }, async (req, res) => {
    try {
      if (req.url === '/healthz' && req.method === 'GET') return reply(res, 200, { ok: true });
      if (!authenticated(req.headers['x-api-key'], config.apiKey)) throw new HttpError(401, 'Unauthorized');
      if (!limiter.take()) return reply(res, 429, { error: 'Rate limit reached' }, { 'Retry-After': String(Math.ceil(60 / config.requestsPerMinute)) });
      if (req.url === '/status' && req.method === 'GET') return reply(res, 200, store.stats());
      const prefix = '/hooks/roblox/';
      if (req.method === 'GET' && req.url.startsWith(prefix)) {
        const id = req.url.slice(prefix.length);
        if (!isEventId(id)) throw new HttpError(400, 'Invalid eventId');
        const row = store.get(id.toLowerCase());
        if (!row) throw new HttpError(404, 'Event not found');
        return reply(res, 200, { eventId: row.id, status: row.status, attempts: row.attempts, messageId: row.message_id, error: row.error });
      }
      if (req.url !== '/hooks/roblox') throw new HttpError(404, 'Not found');
      if (req.method !== 'POST') return reply(res, 405, { error: 'Use POST' }, { Allow: 'POST' });
      const event = validateEvent(await readJson(req), config.universeId);
      const result = store.accept(event, config.channels[event.type], config.rarities.has(event.reward.rarity.toLowerCase()));
      return reply(res, result.status === 'queued' && !result.duplicate ? 202 : 200, result);
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500;
      if (status === 500) log(JSON.stringify({ event: 'request_failed', error: 'internal_error' }));
      if (!res.headersSent && !res.destroyed) reply(res, status, { error: status === 500 ? 'Internal server error' : error.message }, status === 503 ? { 'Retry-After': '10' } : {});
    } finally { req.resume(); }
  });
  server.requestTimeout = 15000; server.headersTimeout = 10000;
  server.keepAliveTimeout = 5000; server.maxConnections = 128;
  return server;
}
