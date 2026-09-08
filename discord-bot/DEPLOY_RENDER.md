# Put GoodGames / SwordQuest notifications online

GitHub keeps your code; Render runs the notification server. This deployment uses the bot's existing Node service and persistent SQLite queue. It does not use GitHub Actions as a permanent server.

**Cost approval required:** this template specifies one paid `0.5c-512mb` web service and a 1 GB persistent disk. Review Render's current price before approving. No hosting account, paid resource or live deployment is created just by adding these files to GitHub. Render's free web service cannot attach the disk this bot needs. [1][2]

## 1. Keep the credentials private

If a bot token has appeared in a screenshot, chat, log or repository, use **Discord Developer Portal -> your app -> Bot -> Reset Token**. Do not reuse that token. Put the replacement only in Render's secret/environment settings. Never paste a bot token into a GitHub file, issue, pull request or Roblox script. [3]

The application already exists as GoodGames; there is no need to make another one. Invite its bot into your server with **View Channels**, **Send Messages** and **Embed Links** in the notification channel. No Administrator permission or privileged intents are needed for this notification-only implementation. [3][4]

## 2. Deploy this branch

[Deploy this branch to Render](https://render.com/deploy?repo=https%3A%2F%2Fgithub.com%2Fskavper%2FSwordQuest%2Ftree%2Ffeat%2Fdiscord-notifications)

Sign in to Render, authorize repository access as needed, and review the Blueprint. It reads the repository-root `render.yaml` from `feat/discord-notifications`, so the draft PR does not have to be merged to test deployment. The button opens a deployment setup screen; it is not a running bot. [5]

If the button does not select the branch, use **New -> Blueprint**, select `skavper/SwordQuest`, set branch `feat/discord-notifications` and Blueprint path `render.yaml`.

The destination channel is preconfigured as **`1546997127211778118`**, the supplied SwordQuest drops channel. Enter the two private setup values and review the channel below:

| Render variable | Value |
| --- | --- |
| `DISCORD_BOT_TOKEN` | Enter your private token, without a `Bot ` prefix. Rotate any exposed token as described above. |
| `DISCORD_CHANNEL_ID` | Already set to `1546997127211778118` in `render.yaml`; no need to supply it again. |
| `ROBLOX_UNIVERSE_ID` | Enter your experience's universe ID (`game.GameId`), not its place ID (`game.PlaceId`). |

This configures the deployment template, not a running service. Eligible rare drops will use this channel after deployment and game integration. Pet-hatch notifications also use it unless `DISCORD_HATCH_CHANNEL_ID` is set separately. The channel ID is not a credential; bot tokens and shared keys must remain private.

The template generates `ROBLOX_API_KEY` privately in Render. You do not need to generate it yourself. It also configures Node 24, the correct service folder and start command, a `/healthz` check, one instance, and persistent database storage at `/var/data/notifications.sqlite`. The build runs the automated tests before starting. [1]

After approving the displayed costs and deploying, wait for a successful deployment. Use the **actual public HTTPS URL** shown by Render, not a guessed hostname. Open `/healthz` on that URL: a healthy response proves the Node service is running, **not** that Discord permissions or game integration are correct.

Automatic application deploys are disabled while this is a draft branch. To update the running code deliberately, use Render's manual deploy after checking the new commit. After review and merge, update the Blueprint source branch and service `branch` to `main`; enable automatic deployments only when intended. Do not delete the feature branch while a deployed service still points to it.

## 3. Connect your Roblox server

In Render, open the service's Environment settings and privately copy the generated `ROBLOX_API_KEY`. Do not post its value anywhere.

In your Roblox experience's Creator Dashboard, create a secret named **`SWORDQUEST_BOT_API_KEY`** with that exact value. Restrict it to your actual Render hostname. Enable **Allow HTTP Requests**. Local Studio testing additionally needs the matching Local Secret. [6]

Add `roblox/DiscordNotifier.luau` as a ModuleScript named `DiscordNotifier` in **ServerScriptService**. Set its `Config.Endpoint` to:

```text
https://YOUR_ACTUAL_RENDER_HOST/hooks/roblox
```

Then call `RareDrop()` or `RareHatch()` from trusted server reward code **after** the item/pet is successfully awarded and saved. See [the integration instructions](README.md#4-connect-roblox) and `roblox/IntegrationExample.luau`. No game reward source was present in the repository, so these hooks still need to be connected inside Studio. The Discord token never belongs in Roblox.

## 4. Verify a real Discord delivery

Set `TEST_PLACE_ID` in Render's Environment settings to your real Roblox place ID. Then, in Render's service Shell, run:

```sh
npm run test:notification
```

This deliberately posts one clearly labelled test notification to your configured channel and checks its delivery status. It does not grant an item. Do not run it repeatedly while troubleshooting; first inspect the command output and the service logs.

Next trigger one real eligible reward in the game. Confirm that it appears in the intended channel. By default only Legendary, Mythic, Mythical and Secret rewards qualify.

The bot may appear **offline in Discord while successfully posting**: this implementation uses Discord's HTTP API, not a Gateway presence connection. [4]

## Troubleshooting

- `Configure DISCORD_BOT_TOKEN`, `Configure DISCORD_CHANNEL_ID`, or an invalid universe ID at startup: complete the service's Environment values and redeploy.
- `401` from Discord: reset/replace the bot token privately, then restart. `403`: verify bot membership and channel permissions. `404`: check that the channel ID is correct and accessible.
- Roblox HTTP `401`: Render's `ROBLOX_API_KEY` and the Roblox Secret must match exactly, including any trailing `=`. Do not confuse this key with your Discord token.
- Roblox HTTP `403`: use the experience/universe ID, not the place ID.
- No notification for a lower rarity: update `NOTIFY_RARITIES` and the module's rarity allowlist deliberately.
- A failed test may leave an event marked `failed` and delivery paused for ten minutes. Fix the cause, then follow [failed-event retry instructions](README.md#reliability-and-maintenance); changing settings does not automatically resend failed records.

Keep the persistent disk and one instance. Do not enable a second bot deployment against the same game while testing unless duplicate notifications are intentional. Follow the main README for queue limits, retention, backups and delivery limitations.

## Official references

1. [Render Blueprint fields and private/generated environment values](https://render.com/docs/blueprint-spec)
2. [Render persistent disks](https://render.com/docs/disks), [free-service limitations](https://render.com/docs/free), and [current pricing](https://render.com/pricing)
3. [Discord bot setup and token security](https://docs.discord.com/developers/quick-start/getting-started)
4. [Discord bot authentication](https://docs.discord.com/developers/topics/oauth2#bot-users) and [message API permissions](https://docs.discord.com/developers/resources/message#create-message)
5. [Render deployment button and branch selection](https://render.com/docs/deploy-to-render)
6. [Roblox Secrets and HTTP requests](https://create.roblox.com/docs/cloud-services/secrets)
7. [GitHub Pages is static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) and [GitHub Actions execution limits](https://docs.github.com/en/actions/reference/limits)
