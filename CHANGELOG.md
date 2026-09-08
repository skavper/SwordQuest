# Changelog

## Unreleased

The initial entries below were verified in Roblox Studio and saved to Roblox on 8 September 2026. Later updates state their own verification status. Publication to the live game is not confirmed. This repository documents development changes; it does not contain the complete game source.

### Added

- Exclusive sword cosmetics with rarity tiers, owner counts and hidden silhouettes for undiscovered items.
- A detailed Golden Pickaxe cosmetic with a golden glow.
- A cherry-blossom Sakura Scythe cosmetic with an aura.
- Shared menu pop-opening animations and a quiet scroll sound.
- Inventory boost timers, hover details and quantity selection for usable items.

### Changed

- Redesigned the Swords inventory to match Cosmetics with a compact four-column collection, bold text and clearer sword details.
- Refined the Sakura Scythe's shoulder-rest pose, upward blade orientation and custom attacks at default sword speed.
- Displayed dropped miscellaneous items as illustrated billboards with pickup effects.
- Reserved crystals as materials for future enchant crafting.
- Added automatic collection of uncollected miscellaneous drops after five seconds.

### Fixed

- Prevented notifications from stacking over one another and covering the level and coin display.
- Standardized capitalization across inventory labels, item stats and related UI.

### Weighted Sword Carry — 8 September 2026

- Added a braced sword walking animation with delayed stride sway, upper-body counterbalance, and a smooth settle when stopping.
- Preserved custom cosmetic carry poses and hand placement, with smooth transitions into attacks and back to walking. Damage, reach, and attack timing are unchanged.

Verified equipped walking, directional movement, stopping, moving attacks, and repeated equipping in Studio. Sprint blending was checked numerically; a real sprint playtest remains pending. Saved to Roblox with the combined update on 8 September 2026 at 14:54 UTC; no live release is claimed.

### Astral Arsenal Cosmetics — 8 September 2026

- Added five grand fantasy weapon appearances with themed auras and distinct custom attacks at default sword timing: Starfall Greatsword, Inferno Cleaver, Stormbreaker Maul, Moonveil Glaive, and Voidreaper.
- Added a daily shop featuring three cosmetics, a reset countdown, ownership checks, and permanent Robux unlocks priced at 149 / 199 / 249 / 299 / 399 respectively.
- Removed all cosmetic coin and EXP boosts, including the former Golden Pickaxe and Sakura Scythe bonuses. Underlying sword damage and reach remain unchanged.
- Preserved undiscovered collection silhouettes, exclusive rarity styling, and saved owner counts. Reduced-motion preferences suppress extra Arsenal aura particles and ribbons.

Verified the shop and collection UI, all twenty custom swings, hand seating, unchanged damage, aura cleanup, real Roblox product prices, receipt replay protection, and delayed-save recovery in Studio. Saved to Roblox on 8 September 2026 at 14:54 UTC. Live Robux checkout and worldwide owner totals remain unverified; this is not a live release.

### Sword Inventory and Fusion Presentation — 8 September 2026

- Enlarged sword cards into a clean three-column layout with raised slate surfaces, soft shadows, and a darker inventory window.
- Separated bold rarity-colored headings from small bracketed fusion tiers, and moved stack counts outside the top-right corner. Names, damage, and ownership counts retain their actual values.
- Added a subtle animated rainbow background to the Cosmetics button.
- Standardized game UI on bold outlined Fredoka lettering and removed competing text outlines.
- Replaced fused-sword orbit rings with animated backglow matching each fusion tier, with flame particles on equipped swords and motion-aware preview effects.

Verified card layout, selection, scrolling, stack badges, actual damage, Cosmetics navigation, shared typography, moving preview glow, and equipped flame emitters in Studio. The final cloud save is pending; no live release is claimed.

### Playtime Gifts — 8 September 2026

- Added 12 session gifts with independent playtime milestones, a HUD countdown and claimable-count badge, individual claims, and Claim All.
- Added modest random coins, XP and existing consumables through the normal progression profile. Server validation prevents early claims, repeated payouts and rerolling through retries.
- Gift eligibility resets on leaving while earned rewards remain in saved progression. Respawns preserve timers; collecting every gift does not restart the session.
- Added a responsive Gifts menu with larger white-outlined presents and chests, small shadows, a gift header icon, shared outlined lettering and pop-opening motion. Only countdowns and claim states appear; rewards are revealed after claiming.
- Presents pop, lift and tilt on hover, squash on press and settle on exit while their countdowns stay still.

Verified session rules, overlapping requests, delayed-save recovery, reward round trips, level-up behavior and the UI in Studio. Production database rejoin behavior remains unverified. The final cloud save is unconfirmed; this is not a live release. Game source is not included in this documentation update.
