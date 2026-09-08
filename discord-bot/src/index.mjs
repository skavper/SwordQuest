import { setTimeout as sleep } from 'node:timers/promises';
import { loadConfig } from './core.mjs';
import { Store } from './store.mjs';
import { DiscordTransport, Worker } from './discord.mjs';
import { makeServer } from './http.mjs';

async function main() {
  let config;
  try { config = loadConfig(); }
  catch (error) { console.error(error.message); process.exitCode = 1; return; }
  const store = new Store(config.databasePath, config.maxQueue);
  const server = makeServer(config, store);
  const worker = new Worker(store, new DiscordTransport(config.token));
  let stopping = false;
  const stop = () => { stopping = true; server.close(); };
  process.once('SIGINT', stop); process.once('SIGTERM', stop);
  try {
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(config.port, config.host, resolve);
    });
    console.log(JSON.stringify({ event: 'started', port: config.port, mode: 'discord-rest-bot' }));
    let nextPrune = 0;
    while (!stopping) {
      if (Date.now() >= nextPrune) { store.prune(); nextPrune = Date.now() + 3600000; }
      await worker.tick();
      if (!stopping) await sleep(1000);
    }
  } finally {
    server.close();
    server.closeAllConnections();
    store.close();
  }
}
main().catch(() => {
  // Never dump configuration, request headers or the Discord token to logs.
  console.error('Bot stopped: check required environment variables, writable database storage and port availability.');
  process.exitCode = 1;
});
