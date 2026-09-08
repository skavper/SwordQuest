import { randomUUID } from 'node:crypto';
import { setTimeout as sleep } from 'node:timers/promises';

async function main() {
  const base = new URL(process.env.BOT_BASE_URL || 'http://127.0.0.1:3000');
  if (base.protocol !== 'https:' && !(base.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname))) throw new Error('Use HTTPS except for localhost testing');
  const key = process.env.ROBLOX_API_KEY;
  if (!key || key.length < 32) throw new Error('Configure ROBLOX_API_KEY');
  const universeId = Number(process.env.ROBLOX_UNIVERSE_ID);
  const placeId = Number(process.env.TEST_PLACE_ID);
  if (![universeId, placeId].every((n) => Number.isSafeInteger(n) && n > 0)) throw new Error('Configure ROBLOX_UNIVERSE_ID and TEST_PLACE_ID');
  const eventId = randomUUID();
  const headers = { 'Content-Type': 'application/json', 'x-api-key': key };
  const response = await fetch(new URL('/hooks/roblox', base), {
    method: 'POST', headers, signal: AbortSignal.timeout(15000), redirect: 'error',
    body: JSON.stringify({
      eventId, type: 'rare_drop', universeId, placeId, timestamp: Math.floor(Date.now() / 1000),
      player: { userId: 1, username: 'TestPlayer', displayName: 'TEST NOTIFICATION' },
      reward: { name: '[TEST] Celestial Blade', rarity: process.env.NOTIFY_RARITIES?.split(',')[0]?.trim() || 'Mythic', chanceDenominator: 100000 },
      source: 'Manual integration test - not a real player reward',
    }),
  });
  if (!response.ok) throw new Error(`Bot returned HTTP ${response.status}. Check key, IDs and /status.`);
  console.log(`Accepted test event ${eventId}. Checking delivery...`);
  for (let i = 0; i < 20; i++) {
    await sleep(1500);
    const status = await fetch(new URL(`/hooks/roblox/${eventId}`, base), { headers, signal: AbortSignal.timeout(10000), redirect: 'error' });
    if (!status.ok) throw new Error(`Status endpoint returned HTTP ${status.status}`);
    const result = await status.json();
    if (result.status === 'sent') { console.log(`Delivered to Discord. Message ID: ${result.messageId}`); return; }
    if (result.status === 'failed' || result.status === 'ignored') throw new Error(`Delivery ${result.status}: ${result.error || 'check rarity configuration'}`);
  }
  console.log(`Still queued. Inspect authenticated GET /hooks/roblox/${eventId} and /status.`);
  process.exitCode = 1;
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
