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

### Item Reward Icons and Stack Counts — 8 September 2026

- Replaced large item-drop text panels with rounded icon boxes and a NEW ITEM heading above the health bar. Item names, rarity, quantity and descriptions appear only in a dark hover tooltip.
- Added smooth pop entrances, smooth vertical artwork motion without wobble inside stable boxes, sideways list movement and horizontal overflow scrolling. Repeated items combine without extending their five-second lifetime, followed by a quick fade.
- Enlarged sword inventory quantities to plain outlined text outside the top-right corner, removing their background boxes.

Verified tooltip visibility and readability, moving artwork, repeated-item counts, nine-item overflow and five-second cleanup even when repeated pickups arrive in Studio. Source snapshots were exported locally. The final cloud save is unconfirmed; no live release is claimed.

### Area Quest Walls — 8 September 2026

- Added six quest walls between areas inside Grasslands, Desert and Ice Land, while retaining the existing biome level requirements.
- Each wall requires defeating the preceding area's leader, beginning with Slime King for Ironfang Camp. Unlocks are personal and saved with player progression.
- Added grey walls at 30% opacity so the next area remains visible, bold outlined Fredoka lettering, animated progress bars and a fading unlock effect.
- Added server crossing checks and full-reset integration.

Verified all six leader kills, unlocked crossings, blocked bypass attempts, profile save/reload, progress surviving a delayed save, and animated fill/fade in Studio. Saved to Roblox on 8 September 2026. Production multiplayer and database rejoin testing remain unverified; this is not a live release.

### Emerald Hollow Forest Asset Kit — 8 September 2026

- Created 24 original forest scenery assets in the same chunky low-poly visual family as the desert kit: five tree types, foliage, logs, mossy rocks, ruins, wooden props, a well and a cottage.
- Prepared editable Blender source, individual FBX and glTF exports, a visual catalog and a reusable modeling guide. The unique meshes total 14,132 triangles and share one small palette texture.

Verified all 48 individual export round trips in Blender, including geometry, dimensions, UVs, textures and ground-center pivots, and inspected the rendered assets. Imported the kit into Studio, replaced 86 Grasslands trees and placed 203 forest Models across the first three areas. Revised their spacing to clear other scenery and routes. Saved to Roblox with the scenery update on 8 September 2026 at 19:36 UTC. Asset binaries are delivered separately; this documentation-only PR does not claim a live release.

### Biome Scenery and Mountain Detail — 8 September 2026

- Added 22 original low-poly scenery assets totaling 5,992 unique triangles, including slime springs and nests, orc camp props, thorn ruins, desert supplies, forge details and frozen relics.
- Added 624 ground prop placements across nine areas and 378 mountain-detail Models, including rock-face treatments, hanging foliage, shelves and cap accents.
- Integrated the 149-Model desert scenery set and revised forest and desert placement to prevent separate ground models from intersecting. Removed 455 old bush and snowy-shrub pieces and disabled their old generator helper.
- Supplied editable Blender source, FBX/glTF exports and a native Roblox library containing 46 forest and biome-detail templates.

Final Studio checks found no overlapping bounding boxes among the 976 kit ground Models, no central-road intrusions and no changes to protected spawn, gate, path, cave or mountain part geometry and collisions. All nine area routes and the cave approach passed pathfinding checks. New asset-instance loading passed without failures during a Studio play session. Mobile hardware performance and public-server behavior remain untested. Saved to the existing game on Roblox on 8 September 2026 at 19:36 UTC; not published live. Model binaries and complete game source are delivered separately.
