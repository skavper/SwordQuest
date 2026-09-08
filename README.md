# SwordQuest

SwordQuest development changelog.

Updates are proposed through draft pull requests before review and merging.

## Discord notifications

The [Discord notification bot](discord-bot/README.md) provides a server-side Roblox hook for rare sword drops and pet hatches, configurable Discord channels, a persistent delivery queue, tests and deployment instructions.

**To put it online:** follow the [Render deployment guide](discord-bot/DEPLOY_RENDER.md). The repository includes a deployment template with private token entry, an automatically generated Roblox shared key, a health check, and persistent storage. Hosting requires your approval of Render's paid service and disk charges.

[Open Render deployment setup](https://render.com/deploy?repo=https%3A%2F%2Fgithub.com%2Fskavper%2FSwordQuest%2Ftree%2Ffeat%2Fdiscord-notifications)

Real secrets belong in your host's environment and Roblox Secrets, never in this repository. Reset any token that has appeared in chat or screenshots. The starter is not deployed or connected to live game reward code automatically; GitHub is not its always-running host.
