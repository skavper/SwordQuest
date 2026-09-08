import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticated, loadConfig } from '../src/core.mjs';

// Deliberately synthetic fixtures: never use real credentials in tests.
const environment = (key) => ({
  DISCORD_BOT_TOKEN: 'unit-test-only-not-a-discord-token',
  DISCORD_CHANNEL_ID: '123456789012345678',
  ROBLOX_UNIVERSE_ID: '12345',
  ROBLOX_API_KEY: key,
});

test('hosting accepts Render-style generated base64 keys without changing their bytes', () => {
  const key = Buffer.alloc(32, 251).toString('base64');
  assert.match(key, /\+/);
  assert.match(key, /\//);
  assert.match(key, /=$/);
  const config = loadConfig(environment(key));
  assert.equal(config.apiKey, key);
  assert.equal(authenticated(key, config.apiKey), true);
  assert.equal(authenticated(key.replace(/=$/, ''), config.apiKey), false);
});

test('hosting preserves existing base64url and hex shared keys', () => {
  for (const encoding of ['base64url', 'hex']) {
    const key = Buffer.alloc(32, 251).toString(encoding);
    const config = loadConfig(environment(key));
    assert.equal(config.apiKey, key);
    assert.equal(authenticated(key, config.apiKey), true);
  }
});

for (const [name, key] of [
  ['short', 'a'.repeat(31)],
  ['oversized', 'a'.repeat(257)],
  ['embedded CRLF', `${'a'.repeat(32)}\r\nInjected: value`],
  ['embedded space', `${'a'.repeat(32)} value`],
  ['embedded tab', `${'a'.repeat(32)}\tvalue`],
  ['unicode', `${'a'.repeat(32)}🔑`],
  ['quote', `${'a'.repeat(32)}"value`],
]) {
  test(`hosting rejects ${name} shared keys without echoing their value`, () => {
    assert.throws(() => loadConfig(environment(key)), (error) => {
      assert.match(error.message, /ROBLOX_API_KEY/);
      assert.equal(error.message.includes(key), false);
      return true;
    });
  });
}

test('hosting honors Render port, network binding and persistent database path', () => {
  const config = loadConfig({
    ...environment('a'.repeat(64)),
    PORT: '10000', HOST: '0.0.0.0',
    DATABASE_PATH: '/var/data/notifications.sqlite',
  });
  assert.equal(config.port, 10000);
  assert.equal(config.host, '0.0.0.0');
  assert.equal(config.databasePath, '/var/data/notifications.sqlite');
});
