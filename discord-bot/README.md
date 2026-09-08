# SwordQuest Discord notification bot

A working, dependency-free **notification-only Discord bot** for Roblox rare sword drops and pet hatches.

```text
Trusted Roblox reward service
  -> HTTPS POST /hooks/roblox + secret API key
  -> validation + rarity filter + persistent SQLite outbox
  -> Discord bot API
  -> your chosen Discord channel
```

This uses a real Discord **bot token**, not a user token or a webhook URL. It sends messages through Discord's HTTP API. It deliberately has **no Gateway connection, slash commands, chat reader or green online presence**. The bot can appear offline while successfully posting notifications. Add a Gateway client later only when those features are needed. [1]

The code is a starter, **not a deployed service**. GitHub stores the source. You still need an always-running host with a public HTTPS address and persistent storage; GitHub Pages cannot run this Node server. [2]

## What is included

Rare-drop and rare-hatch embeds show the player, item, rarity, source, optional odds, timestamp and game/profile links. Legendary, Mythic, Mythical and Secret are enabled by default. Pet hatches can use a separate channel. Secrets stay out of source control. Incoming payloads are validated, mentions are disabled, retries reuse event IDs, and accepted events are saved to a disk-backed queue before HTTP 202 is returned.

There are no npm dependencies to install. Use the latest patched **Node.js 24 LTS**. The bot uses built-in HTTP, fetch and SQLite; Node may show a SQLite experimental warning on some versions. [3]

## 1. Create and invite the Discord bot

Open the [Discord Developer Portal](https://discord.com/developers/applications), create an application named **SwordQuest Notifications**, and obtain its bot token from the application's Bot page. Save it privately; do not paste it into GitHub, Roblox scripts, screenshots or chat. [4]

Install the application into your Discord server as a **bot**. Give it **View Channels**, **Send Messages** and **Embed Links** in the target text channel. No Administrator, Manage Webhooks or privileged intents are needed. Check channel permission overrides as well as the bot role. Use a normal server text channel for the first test, not a forum parent or archived thread. [1][5]

Enable Discord's Developer Mode, right-click the destination channel and copy its channel ID. Use that in `DISCORD_CHANNEL_ID`. Leave `DISCORD_HATCH_CHANNEL_ID` empty to use the same channel for hatches.

## 2. Configure the service

From the repository's `discord-bot` directory:

```sh
# macOS/Linux; on Windows use: copy .env.example .env
cp .env.example .env
npm run secret
```

Copy the generated random key into your **private** `.env` as `ROBLOX_API_KEY`. Complete these four required values:

| Variable | Value |
| --- | --- |
| `DISCORD_BOT_TOKEN` | Raw bot token, without the word Bot in front. |
| `DISCORD_CHANNEL_ID` | Destination channel's numeric ID. |
| `ROBLOX_API_KEY` | Random key generated above; the same key will go in Roblox Secrets. |
| `ROBLOX_UNIVERSE_ID` | Your experience/universe ID: `game.GameId`, not `game.PlaceId`. |

Optional settings are documented in `.env.example`. `NOTIFY_RARITIES` is a case-insensitive comma-separated allowlist. Add custom tiers there and in the Roblox module's `Config.Rarities`. Unknown extra request fields, including caller-supplied channel IDs, are not used.

```sh
npm test
npm start
```

There is no `npm install` step because the project has no external dependencies. Keep the terminal running for local testing. For production, use a process supervisor or the Docker restart policy.

## 3. Host it with HTTPS and a persistent volume

Deploy **`discord-bot/` as the service root**, with Node 24 and start command `npm start`. Configure private environment variables on the host, route its public HTTPS domain to the configured `PORT`, and mount persistent storage at the directory containing `DATABASE_PATH`. Example: mount a volume at `/app/data` and set `DATABASE_PATH=/app/data/notifications.sqlite`.

Run **exactly one replica**. This starter uses a local SQLite outbox, not a distributed queue. Do not deploy to an ephemeral/serverless function or scale multiple workers against independent copies of the database. GitHub Actions secrets are not automatically runtime secrets for your host.

Docker is also included:

```sh
# Run from discord-bot/ after creating .env.
docker compose up --build -d
docker compose logs -f bot
```

Compose creates a persistent `bot-data` volume and binds the service to **127.0.0.1:3000**. It does NOT create a public domain or TLS certificate. Put an HTTPS reverse proxy on that host in front of it. For a managed Docker host, expose the container's port 3000 using that provider's HTTPS routing and mount `/app/data` persistently. Never put `.env` inside a container image.

Your Roblox endpoint will look like:

```text
https://YOUR_BOT_HOST/hooks/roblox
```

Add perimeter rate limiting at your host/reverse proxy. The app limits authenticated traffic across the whole service, caps request bodies at 16 KiB, and caps open connections, but it is not a DDoS protection service.

## 4. Connect Roblox

In Roblox Studio, enable **Allow HTTP Requests** in Experience Settings -> Security. In the Creator Dashboard, open your experience -> **Secrets -> Create Secret**. Name it **`SWORDQUEST_BOT_API_KEY`**, set its value to the same `ROBLOX_API_KEY`, and restrict its domain to your exact bot hostname (not `*`). The module obtains this through `HttpService:GetSecret()` and sends it in a header. [6]

For ordinary local Studio playtests, configure the same value in **Experience Settings -> Security -> Local Secrets**; live experience secrets are not automatically available to local playtests. Use a published experience and a real positive player user ID for the integration test. [6]

Create a **ModuleScript named `DiscordNotifier` inside `ServerScriptService`** and paste `roblox/DiscordNotifier.luau` into it. Change `Config.Endpoint` to your public HTTPS endpoint. Never copy the Discord bot token into Roblox.

Call the module from the trusted server reward code **only after an item is genuinely awarded and saved**:

```lua
local Notifier = require(game.ServerScriptService.DiscordNotifier)

-- In your existing server-side reward function, after successful award/save:
local queued, reason = Notifier.RareDrop(player, {
    name = awardedSword.Name,
    rarity = awardedSword.Rarity,
    chanceDenominator = actualRollOdds, -- Optional; omit when exact odds are unknown.
}, mobName, savedAwardUuid)
```

`player`, `awardedSword`, `actualRollOdds`, `mobName` and `savedAwardUuid` above belong to your game's existing reward system, not to this starter. `savedAwardUuid` is an optional UUID belonging to that individual reward transaction. Reuse it when retrying the same transaction; never reuse it for two different awards. Without it, the module creates a UUID once per call and reuses that UUID for its HTTP retries. Calling the hook twice without supplying a stable UUID creates two separate events.

Use `Notifier.RareHatch(player, reward, eggName, savedAwardUuid)` for pets. For multi-hatch, notify once for each eligible awarded pet, using a distinct reward ID for each. See `roblox/IntegrationExample.luau` for concrete sample values.

Do not trust client-supplied item names, rarities, odds or reward IDs. This bot authenticates your game server; it cannot independently prove that an inventory award really happened. Never connect a public RemoteEvent directly to the notifier. A Discord delivery failure must not undo the player's reward or block gameplay.

## 5. Send a clearly labelled test notification

With the bot running, set `TEST_PLACE_ID` to your real place ID. Leave `BOT_BASE_URL` as localhost for testing on the host, or change it to your service's HTTPS origin when testing remotely. Run:

```sh
npm run test:notification
```

This sends a **TEST NOTIFICATION** with a sample Celestial Blade and checks its delivery status. It intentionally creates a visible message in the configured Discord channel. It does not represent a real player's drop or grant any game items. No live message is sent by `npm test`.

## HTTP contract

`POST /hooks/roblox` needs `Content-Type: application/json` and the private `x-api-key` header. Example body (generate a current Unix-seconds timestamp):

```json
{
  "eventId": "7b5a5510-4e74-42d6-a25d-9e8a2335cd8b",
  "type": "rare_drop",
  "universeId": 123456,
  "placeId": 987654,
  "timestamp": 1788876000,
  "player": { "userId": 12345, "username": "ExamplePlayer", "displayName": "Example Player" },
  "reward": { "name": "Celestial Blade", "rarity": "Mythic", "chanceDenominator": 100000 },
  "source": "Grasslands Slime"
}
```

The numbers and names above are examples. Requests older than 24 hours or more than five minutes in the future are rejected. Optional `reward.quantity` defaults to 1 and is capped at 99. Omit `chanceDenominator` unless known; it must be a positive safe integer.

HTTP **202** means the event was saved as `queued`, not already sent. HTTP **200** can mean an existing event or `ignored` rarity; inspect `status`. `401` is a bad/missing key, `403` a disallowed universe, `409` a reused ID with conflicting content, `413` an oversized body and `429` throttling. `503` means the bounded queue is full: retry later with the same event ID. Retry transient/network errors and obey `Retry-After`; do not retry a permanent validation failure unchanged.

| Endpoint | Purpose |
| --- | --- |
| `GET /healthz` | Public process liveness only; does not prove Discord delivery works. |
| `GET /status` | Authenticated queue counts and any delivery pause. |
| `GET /hooks/roblox/EVENT_UUID` | Authenticated event state, attempts and Discord message ID. |

The first accepted payload supplies the displayed timestamp. Repeated calls with the same ID and otherwise identical normalized content are deduplicated even when their timestamp differs. Terminal event records are retained for seven days; pending events are never pruned automatically.

## Reliability and maintenance

The bot stores accepted events on disk and serializes Discord sends. It honours Discord's rate-limit headers and 429 retry delay, uses exponential backoff for transient failures, and marks an event `failed` after twelve transient failures or a permanent error. Permission/token/channel errors pause outgoing delivery for ten minutes to avoid repeatedly making invalid requests. Logs contain event IDs and safe error codes, not tokens or full player payloads. [5][7]

Fix the cause before retrying a failed event. On the host, with the correct `DATABASE_PATH`:

```sh
node --env-file-if-exists=.env scripts/retry-event.mjs EVENT_UUID
```

The same message nonce and event ID are retained. Existing Discord rate-limit pauses are not bypassed. Queued events retain their original destination channel; to fix a wrong destination for an already failed event, stop the bot and update its stored `channel` in SQLite, or discard it deliberately and issue a new event after fixing configuration.

**This is not an exactly-once guarantee.** SQLite deduplication survives restarts only when its volume survives. Discord nonce enforcement protects recent repeated sends, but its deduplication window is only a few minutes: a crash after Discord accepts a message but before the database marks it sent can still cause a duplicate after a long outage. [5]

The Roblox-side queue is in memory, bounded to 200 waiting events, with six send attempts and a best-effort shutdown drain. A Roblox server crash or prolonged outage **before the bot acknowledges receipt** can lose notifications. For critical audit records, persist pending events alongside your game's reward transactions and reconcile them later; do not use Discord notifications as your authoritative inventory ledger.

Player names/IDs and rewards are sent to the selected Discord channel and temporarily stored in the bot database. Restrict access appropriately, disclose this feature to players as needed, avoid collecting unrelated personal information, and monitor free disk space. Back up the database using SQLite-aware tooling or while the bot is stopped; do not copy only the live `.sqlite` file and forget WAL files.

Rotate a leaked Discord token in the Developer Portal. For a leaked Roblox key, replace both the host environment value and Roblox Secret, then restart the host. Review your game-side reward code for client trust issues.

## Development and test scope

`npm test` runs automated unit and HTTP integration tests with a **fake Discord transport**. They cover validation, authentication, allowed mentions, deduplication, disk persistence, queue capacity, retries, rate-limit handling, filtering and delivery status. The GitHub workflow targets Node 24. Local checks during creation ran on Node 22.16's compatible built-in APIs; Node 24 is the deployment target.

The Roblox module has not been executed in Roblox Studio here. Live bot credentials, Discord permissions, your actual reward service integration, HTTPS hosting and a real in-game rare-drop test still need verification. No game source beyond a repository README was available, so the sample hook is not wired into an existing inventory service.

To add other notification types, extend `validateEvent()` in `src/core.mjs`, its channel mapping in `loadConfig()`, and `buildMessage()`. Then add a server-side Roblox wrapper and tests. Do not create a generic unauthenticated broadcast endpoint.

## Official references

1. [Discord bot users and authentication](https://docs.discord.com/developers/topics/oauth2#bot-users)
2. [GitHub Pages is static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
3. [Node release support](https://nodejs.org/en/about/previous-releases) and [built-in SQLite](https://nodejs.org/api/sqlite.html)
4. [Discord application and bot setup](https://docs.discord.com/developers/quick-start/getting-started)
5. [Discord Create Message, allowed mentions and nonce enforcement](https://docs.discord.com/developers/resources/message#create-message)
6. [Roblox Secrets, HTTP access and Local Secrets](https://create.roblox.com/docs/cloud-services/secrets)
7. [Discord rate limits](https://docs.discord.com/developers/topics/rate-limits)
