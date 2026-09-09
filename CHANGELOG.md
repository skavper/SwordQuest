# Changelog

## Unreleased

The initial entries below were verified in Roblox Studio and saved to Roblox on 8 September 2026. Later updates state their own verification status. Publication status is recorded in the dated updates below; earlier verification notes describe their status at the time. This repository documents development changes; it does not contain the complete game source.

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


### Text Outline Visibility — 8 September 2026

- Fixed offset ghost lettering behind icon-button captions, including egg-opening controls, by hiding outlines with their source text.
- Text outlines now fade and reappear with the lettering while retaining the shared cartoon font and colors.

Verified hidden-text outlines and fade/reappear behavior in a fresh Studio playtest, plus actual egg controls in wide and narrow test containers. Applied in Studio, exported locally and saved to Roblox with the combined update on 8 September 2026 at 20:31 UTC. No live release is claimed.


### Area Bosses — 8 September 2026

- Added a timed boss to every area across all three zones, retaining Slime King and promoting the eight themed area leaders into boss encounters with enlarged family rigs.
- Increased difficulty sharply across the nine bosses: health rises from 3,000 to 3,000,000, with steadily increasing base damage and rewards. Existing family attacks, leader quest credit and sword loot remain integrated.
- Set initial spawns and post-defeat respawns to 1 minute 30 seconds, with one living boss per area.
- Extended the boss loot display to every area with the correct identity, level, preview, loot pool and countdown. Fixed distant-area streaming and kept the panel clear of the tutorial and combat controls.

Verified all nine initial spawns, actual attacks, credited kills and full 90-second respawns in Studio, including unchanged stats, fixed homes and no duplicates. Persistent Studio edits and source exports are complete; saved to Roblox with the combined update on 8 September 2026 at 20:31 UTC. Mobile hardware, multiplayer behavior and extended balance testing remain unverified. This documentation update does not contain complete game source or claim a live release.

### Grounded Scenery and Mountain Seams — 8 September 2026

- Grounded 88 scenery objects across the map, including pyramid bases, riverbank props and unsupported mountain-top decorations. Added a mount beneath the temple's sun emblem.
- Closed unintended mountain openings with 17 overlapping low-poly rock groups, including the spawn backdrop, cave-side boundary and ice-area ridges. Mountain rebuilds retain the seam repairs.
- Preserved spacing between separate scenery models and kept the spawn, roads, cave, quest gates and encounter markers unchanged.

Verified ground contact for 2,149 scenery objects, attachment for 378 mountain decorations and no bounding-box overlaps among 976 kit ground models. All nine area routes, the spawn route and cave approach passed pathfinding. Boundary checks found no outer or rear openings at the sampled player heights; three apparent seams beyond the enclosure were unreachable. Saved to Roblox on 8 September 2026 at 20:31 UTC; not published live. Complete game source is delivered separately.


### Boss Artwork and Dedicated Arenas — 8 September 2026

- Rebuilt all nine bosses in Blender with detailed low-poly silhouettes, themed armor and palette textures matching the map artwork. Preserved their combat rigs, weapons and jelly animation.
- Added a dedicated themed boss spot inside every existing area, with a rear landmark, flanking decorations and a ground-fitted entrance. Moved nearby scenery clear of the fighting spaces.
- Retained boss stats, rewards, timers and area progression.

Verified all nine bosses attacking, animating, grounding and displaying their complete artwork in a clean Studio playtest. All nine natural spawns also loaded the upgraded models. Published the combined SwordQuest update to Roblox on 8 September 2026 at 20:56 UTC, including these boss areas and the text-outline fix. New servers receive the update; existing servers were not forcibly restarted. Ordinary mob artwork was not rebuilt in this pass. Public multiplayer and mobile hardware testing remain unverified. This PR contains change notes only; game source and Blender assets are delivered separately.

### Sword Card Readability — 8 September 2026

- Made sword names substantially smaller and kept them on a centered single line with fitting for long names.
- Enlarged DMG in a bright gold row and added thousands separators to large damage values.
- Tidied spacing between names, damage and existence counts, retaining the raised slate cards and existing inventory actions.

Verified the rendered inventory, long-name and large-number samples, and smaller card layouts in Studio. Saved to Roblox on 8 September 2026 at 21:11 UTC; not published live. Full phone usability is outside this typography change. This entry documents a Studio change; game source is delivered separately.

### Larger Boss Courts — 8 September 2026

- Moved all nine boss courts to the middle of their existing areas along the right-hand mountain edge, retaining Slime King's mountain grotto.
- Doubled the thrones, rear landmarks, flanking props and entrance pieces, and expanded the grotto floor to accommodate them.
- Cleared grass and obstructing vegetation from the fighting spaces, blended the cleared ground into each biome and relocated nearby scenery, including large landmarks.

Verified all nine walking routes, exact prop scaling, grass-free arena interiors and grounded, non-overlapping relocated scenery in Studio. All nine bosses spawned naturally at their new homes. Saved to Roblox on 8 September 2026 at 21:24 UTC; not published live. This entry documents a Studio change; game source is delivered separately.

### Unified Gift Reward Notifications — 8 September 2026

- Removed the central gift reward popup. Gift coins, XP and miscellaneous items now appear through the same icon notification row as ordinary item drops, with item details and quantities in its tooltips.
- Kept reward notifications visible above the open Gifts menu. Claim failures appear inline and do not create reward icons.

Verified the Claim All handler, all reward types and quantities, loaded artwork, five-second cleanup and repeated-claim rejection in Studio. Normal gift timers were restored after testing. Installed and exported locally; this change's Roblox cloud save and live publication are unconfirmed.

### Mob Crafting Materials — 8 September 2026

- Added 36 distinctive signature materials, one guaranteed drop for every active mob type, using the existing cartoon icon pack. Materials accompany existing sword and consumable loot.
- Added Forge Power and crafting affinities for future rings. Inventory materials sort by highest Forge Power first and show their power, affinity and source mob; search supports these details.
- Protected materials from consumption and included each boss's guaranteed material in its loot preview. Blacksmith and ring crafting gameplay remain planned for a later update.

Verified all 36 mappings, rendered icons, pickup collection and descending inventory order in Studio. Credited ordinary-mob and boss kills awarded the correct material; consumption rejection, profile round trips and compact inventory details passed. Saved to Roblox on 8 September 2026 at 21:59 UTC; not published live. Production database rejoin and multiplayer behavior remain unverified. This entry documents a Studio change; game source is delivered separately.

### Unique Spawn Houses — 8 September 2026

- Replaced the old spawn cottages with four original low-poly buildings: a large medieval blacksmith, a two-story inn, an alchemist house and a provision shop.
- Placed the houses directly against the spawn circle at four diagonal positions, with blended foundations and no connecting roads. Moved the boards and benches into the side gaps.
- Added an open smithing yard with a large anvil, hammer, furnace and lava cauldron, including fire, embers, warm lighting and chimney smoke.

Verified all four models and their textures in Studio, foundation contact, all four entrance routes and an actual player walk into the forge yard. Saved to Roblox on 8 September 2026 at 22:23 UTC; not published live. These are scenery assets; shop and crafting gameplay are not part of this update. Complete game source and Blender assets are delivered separately.

### Desktop Controls and Menu Recovery — 8 September 2026

- Restored desktop spacing and action sizes in Pets, miscellaneous inventory and community menus after phone layout changes.
- Kept phone layout selection separate from mouse-and-keyboard computers and stopped phone controls from disabling native sword activation.
- Prevented the Roblox player list from covering menu close buttons, restoring it after menus close.

Verified desktop layouts at 1536×548 and 1536×726, menu opening and closing, and six server-confirmed mouse swings including a three-hit combo after closing menus. Saved to Roblox on 8 September 2026 at 22:37 UTC; not published live. Complete phone-device testing remains pending. This entry documents a Studio change; game source is delivered separately.

### Super Combo Abilities — 9 September 2026

- Added Flash Triple at x20, Cyclone Barrage at x50, and Heavenbreaker at x100 successful combo hits, with rapid sword strikes, colored slash effects and afterimages.
- Added an E keycap prompt and draining 0.33-second reaction meter, with touch activation and controller support. Successful activation is limited to one use per earned opportunity.
- Kept damage, reach, visibility and eligibility checks on the server. Bonus strikes preserve the earned combo count; ordinary attacks resume afterward.

Verified all three abilities' actual damage, E-key activation, blocked-wall rejection, normal attacks afterward, prompt timing, loaded opening sound and effect cleanup in Studio. An isolated 39-assertion suite passed milestone, expiry, replay, cross-player and character-reset checks. Physical mobile/gamepad devices, production network latency and extended balance remain untested. Saved to Roblox on 8 September 2026 at 23:14 UTC; not published live. This entry documents a Studio change; game source is delivered separately.

### Slime Arena Forest Backdrop — 9 September 2026

- Filled the rear of Slime King's open court with five layered mountain groups, 65 varied trees in irregular clusters, and 18 forest details.
- Mixed tree species, ages, sizes and terrace heights to replace the evenly spaced rows with a denser, asymmetric woodland backdrop.
- Kept the court and its approach clear and retained the existing encounter and mountain boundary.

Inspected the rendered scenery and verified an open arena route, grounded placements and no overlapping bounding boxes among the added trees and details. The complete addition contains 118 BaseParts and reuses existing forest meshes. Saved to Roblox on 8 September 2026 at 23:14 UTC; not published live. Mobile hardware performance remains untested. This entry documents a Studio change; game source and assets are delivered separately.

### Open Slime King Arena — 9 September 2026

- Replaced Slime King's cave with an open court matching the other boss arenas, centered along Slime Grove beside the right mountains.
- Added blended, grass-free fighting ground, sealed the former cave opening and moved nearby scenery and Slime homes clear of the court.
- Centered the boss display at the new arena and updated its area label.

Verified the walking route, sealed mountain boundary, normal timed boss spawn and client display in Studio. Saved to Roblox on 8 September 2026 at 23:14 UTC; not published live. This entry documents a Studio change; game source is delivered separately.

### Inventory Categories — 9 September 2026

- Added separate Misc and Materials buttons to Inventory. Food and boost potions appear under Misc; mob ingredients and crafting crystals appear under Materials.
- Search filters the selected category. Switching clears the previous item selection and scroll position, while inventory refreshes preserve the chosen category.
- Preserved highest-Forge-Power-first material ordering, item details, consumption rules and the shared menu entrance.

Verified all 55 catalog entries across the two categories, actual button switching, search, loading and empty states, selection reset, refresh behavior and material consumption remaining disabled in Studio. Layout checks passed at four desktop and smaller container sizes; physical phone input remains untested. Saved to Roblox on 8 September 2026 at 23:14 UTC; not published live. This entry documents a Studio change; game source is delivered separately.

### FORGE and Rings — 9 September 2026

- Added Coin, EXP, Damage and Luck rings with saved equipment bonuses and four original illustrated icons.
- Added material-based forging with an exact result preview, total Forge Power, up to three material types and ten of each per craft. Materials are consumed together with the saved ring.
- Added a waving blacksmith, a glowing walk-in circle and a FORGE hologram at the spawn blacksmith.
- Added a purple equipment panel beside a searchable white ring inventory, stat filters, equip/unequip controls and confirmed deletion. Five standard slots unlock at levels 1, 25, 100, 250 and 500; three premium slots have ownership checks and configurable game passes.

Verified recipe limits, all four crafts, equipment bonuses, actual coin/EXP awards, rejected remote requests, the walk-in menu and the NPC wave in Studio. Rule and persistence checks passed, including a lost save acknowledgement followed by retry without duplicating a ring or consuming extra materials. Saved to Roblox on 9 September 2026 at 00:42 UTC; not published live. Premium game-pass IDs remain unconfigured, so checkout is unavailable. All four ring icons rendered correctly in a fresh Studio playtest after Roblox processed the uploads. Physical phone/controller input, production multiplayer and live database rejoins remain untested. This entry documents a Studio change; game source and artwork are delivered separately.

### Rings and FORGE Visual Polish — 9 September 2026

- Replaced all four ring images with genuinely transparent artwork, removing the square backgrounds from the HUD launcher, menu header and crafting previews.
- Added deeper shadows, rounded inner highlights and stronger selected outlines to slots, cards and buttons. Increased purple and orange saturation, brightened action colors and added dark stat strips and a clearer details panel.
- Preserved dark-label contrast on pale cards and corrected shadow layering while retaining the existing menu layout and opening motion.

Verified all four transparent icons, populated and empty menus, locked/unlocked slots, selected materials, enabled/disabled Forge actions and a compact layout in Studio using temporary presentation fixtures. The final playtest console was clean, and the fixtures were removed before saving. Saved to Roblox on 9 September 2026 at 01:10 UTC; not published live. This update changes presentation only; premium game-pass configuration remains pending. Game source and artwork are delivered separately.

### Eggs Across Every Progression Area — 9 September 2026

- Extended the existing egg system to all nine progression areas, with one themed station and exactly five obtainable pets per egg: 45 species in total.
- Reused 42 purchased pet models and retained the three existing original pets. Adapted imported egg assets to each area's theme while preserving the first pedestal, fixed coin plaque and proximity menu.
- Added increasing coin prices and area-specific hatch pools with displayed chances matching the server. Preserved owned pets, existing IDs, inventory, discovery silhouettes, equip bonuses, smooth following and the shared x1/x3/x9 hatch animation.
- Kept purchases and area eligibility server-authoritative, including existing level and quest restrictions. Every station supports the existing Auto Egg, Stop Auto and Skip controls.

Verified 475 content, probability, save-compatibility and XP checks, plus 376 isolated Studio runtime assertions including all 27 area/batch combinations. Reviewed all 45 pet icons and model previews, all nine egg designs, actual hatching, inventory/index displays and new pet followers. Confirmed clear station approaches and removed test fixtures. Saved to Roblox on 9 September 2026 at 02:00 UTC; not published live. Production multiplayer, live database rejoins, physical device input and long-term economy balance remain untested. This entry documents a Studio change; game source and assets are delivered separately.

### Egg Display and Normal Pet Pools — 9 September 2026

- Fixed coin plaques turning blank when viewed from the road by extending their draw distance while retaining the static model-mounted display.
- Cleared a slightly wider grass patch around each pedestal without changing terrain height.
- Removed HUGE pets from progression egg pools. Astral now offers the normal-sized Evil Dragon as its fifth pet, with a 1% chance and +750% XP; existing owned pets and saved receipts remain valid.
- Added registry validation preventing HUGE or exclusive pets from entering ordinary egg pools. All nine eggs retain five normal species each.

Verified 523 content, probability, batch-charge and saved-pet compatibility checks, a real Astral x9 purchase, the replacement pet's saved inventory/equipment/follower behavior and the plaque rendering beyond its former distance cutoff. Saved to Roblox on 9 September 2026 at 10:25 UTC; not published live. Production multiplayer, live database rejoins and physical devices remain untested. This entry documents a Studio change; game source is delivered separately.

### Expanded Tutorial and Quest Guidance — 9 September 2026

- Added lessons for dashing, visiting the blacksmith, forging a ring and equipping it in the free Level 1 slot, bringing the tutorial to ten objectives.
- Added a floating 3D arrow that stays beside the character, destination outline and distance label for world objectives, including nearby Meadow Slimes, the first egg and the Forge.
- Added pulsing UI outlines and contextual instructions that follow menu navigation, material selection, crafting, ring selection and equipment.
- Added recovery guidance for empty material inventories: collect an ingredient from slimes, then follow the arrow back to the Forge.
- Preserved existing tutorial progress and rewards. Dash credit follows server-accepted movement; ring credit waits for committed inventory state.

Verified actual dash, Forge arrival, crafting and equipping through the game controls in a fresh Studio session. Also checked duplicate reward protection, legacy save sanitization, pending-save rejection, material pickup retargeting, arrow direction and noncollision, and cleanup during cutscenes and after completion. The final client error log was clear. Saved to Roblox on 9 September 2026 at 10:44 UTC; not published live. Physical phone/controller input, production multiplayer and live database rejoins remain untested. This entry documents a Studio change; game source is delivered separately.

### Tutorial Arrow Polish — 9 September 2026

- Replaced the oversized intersecting arrow pieces with a smaller, seamless gold arrow with rounded edges and a thin dark outline.
- Smoothed turns and movement beside the character, removed bobbing and reduced rapid switching between nearby slime targets.
- Updated the arrow after camera movement so it stays steady alongside normal and dash camera effects.

Inspected the arrow during actual Studio gameplay. Compilation and a 241-frame camera-motion check passed, including single-solid geometry, noncollision, upright transforms and bounded turning; the client error log was clear. Saved to Roblox on 9 September 2026 at 11:06 UTC; not published live. Physical-device and production performance remain untested. This entry documents a Studio change; game source and its reproducible model builder are delivered separately.

### Egg Seating, Compact Prices and Pet Portraits — 9 September 2026

- Corrected imported egg offsets so all nine egg models sit directly on their pedestal bases and remain seated while turning.
- Shortened coin plaques to labels such as 1.5k and 24k, including the server refresh that previously restored full numbers. Purchase costs are unchanged.
- Replaced Emberwing Drake's backwards thumbnail with a forward-facing model portrait across egg cards, inventory, index and hover details. Undiscovered pets retain black silhouettes and no tooltip.

Verified all nine model clearances, a stable repeat build, 523 existing content/purchase/save checks and five price-format checks. Fresh Studio play confirmed compact prices, seated egg animation, the discovered portrait/tooltip and the locked silhouette. Saved to Roblox on 9 September 2026 at 11:51 UTC; not published live. Production multiplayer, live database rejoins and physical device tests were not repeated. This entry documents a Studio change; game source is delivered separately.

### Longer Super Combo Prompt — 9 September 2026

Changed the x20, x50 and x100 Super Combo ability prompt and draining meter from 0.33 seconds to 1 second. The existing four-second ordinary combo chain is unchanged.

Verified the shared client/server setting and 39 isolated contract checks, including acceptance at 0.8 seconds and expiry beyond the new deadline plus bounded transport grace. Installed in Studio and exported; the subsequent cloud save is unconfirmed because the save dialog could not be completed through automation. Not published live. This entry documents a Studio change; game source is delivered separately.

### Black Item Icon Outlines — 9 September 2026

- Added black contours following the artwork on 15 previously unoutlined food, crystal and special-item icons, including Champion Burger, Brave Carrot and Royal Tonic.
- Applied the shared treatment to inventory cards, enlarged previews, boost icons, loot and reward displays while retaining existing baked outlines.
- Kept contours aligned through scaling and rotation, with composited fades and cleanup when images change or disappear.

Verified all 15 configured images, preview alignment, fades, visibility, already-outlined exclusions and cleanup in Studio. A fresh playtest retained exactly the expected outlines after five inventory rebuilds, and small reward notices expired correctly with no runtime errors. Saved to Roblox on 9 September 2026 at 12:13 UTC; not published live. Physical-device performance remains untested. This entry documents a Studio change; game source is delivered separately.


### Pet Stacking and Fusion — 9 September 2026

- Grouped matching pets into inventory stacks by species and tier, with outlined quantities and access to individual copies for equipping, locking and deletion.
- Added three-to-one fusion: three Normal pets create one Golden, and three Golden pets create one Rainbow. Golden gives twice the base XP bonus; Rainbow gives four times the base bonus.
- Added a confirmation showing the upgrade and XP increase. Locked or equipped pets cannot be consumed, and invalid or repeated requests leave inventory unchanged.
- Applied tier bonuses to rewards, Equip Best, sorting and tooltips, with matching Golden/Rainbow artwork and follower styling.

Verified 42 isolated rule assertions, both upgrade paths through actual Studio controls, inventory counts, copy switching, Equip Best and follower tiers. Confirmation uses the shared opening motion and loaded quiet sound. Installed and exported; final cloud save remains unconfirmed. Not published live. Physical devices, production multiplayer and live database rejoins remain untested. This entry documents a Studio change; game source is delivered separately.


### Boss Ultimate Swords and Spawn Restoration — 9 September 2026

- Added nine boss-exclusive Ultimate swords, each with an exact one-in-1,000 drop chance unaffected by luck bonuses.
- Added grand area-themed models, glowing auras and distinct sword swings at the standard attack timing, plus dark matter inventory and collection styling.
- Enlarged the sword previews on boss displays. Undiscovered swords show ???, their chance and a black silhouette; names and details unlock after discovery.
- Restored the four original spawn houses and compact plaza layout from the existing model backup, retaining the current terrain and walkable approaches.

Verified all nine drop rolls, 181 inventory assertions and 36 actual combat hits in Studio. Boss display checks covered larger previews, hidden tooltips and discovery updates. Added ground clearance to the boss display; its entire lower edge stayed above terrain across 12 camera positions. All four house assets loaded successfully and their entrance routes passed. Saved to Roblox on 9 September 2026 at 21:48 UTC; not published live. Physical devices and production multiplayer remain untested. This entry documents Studio changes; game source is delivered separately.


### Pet Multi-Delete and Fusion Effects — 9 September 2026

- Added click/tap multi-selection and desktop drag-box selection for pet deletion, with exact copy counts, Select Visible and Cancel controls.
- Protected locked and equipped pets, and added an exact-count confirmation with atomic, revision-checked deletion of the selected copies.
- Added a new illustrated pet fusion icon and Golden/Rainbow transformations with converging pets, an explosion, fireworks, sounds and a compact fused-pet reward banner above the health bar.
- Preserved reduced-motion and sound preferences, with cleanup when the animation finishes or is cancelled.

Verified 26 data assertions, actual 14-pet drag selection and deletion, both fusion tiers and XP bonuses, loaded effect sounds, model previews, mute/reduced-motion behavior, and an 82-frame health-clearance/cleanup check in Studio. Saved to Roblox on 9 September 2026 at 21:48 UTC; not published live. Physical touch devices and production multiplayer remain untested. This entry documents Studio changes; game source is delivered separately.


### Reference Sword Inventory and Damage Icon — 9 September 2026

- Rebuilt the Swords inventory with four columns of wide rounded cards, diagonal weapon previews, rarity stars, fusion labels and rarity-to-fusion gradient outlines.
- Added a narrow sword tooltip with damage, Equip, Stats, Fuse and Lock controls, bold Fredoka One lettering, and a simple cartoon sword damage icon.
- Added saved stack locks that prevent manual deletion, batch deletion and manual or automatic fusion until unlocked.
- Retained search, rarity filtering, Equip Best, Auto Fuse, cosmetic navigation, sword effects and shared menu opening motion and sound.

Verified the desktop layout, loaded icon, hover/click tooltip, stats and cosmetics presentation in Studio. Seventeen isolated inventory checks covered lock persistence, legacy saves, protected deletion/fusion, atomic batch rejection and unlock recovery. Actual tooltip locking reached the server and blocked fusion without consuming swords. Saved to Roblox on 9 September 2026 at 22:09 UTC; not published live. Physical touch devices and production database rejoins remain untested. This entry documents Studio changes; game source is delivered separately.

### Zone Teleport Menu — 9 September 2026

- Added a dark, outlined Teleport menu with three expandable zone banners and nine area destinations, using new screenshots of the actual map.
- Added personal unlock indicators, boss/level requirements and disabled travel buttons for locked areas. Existing server progression rules validate every destination.
- Added a return-to-spawn shortcut, navigation to the existing Shop, and the shared menu entrance and quiet sound.
- Fitted the additional launcher row and teleport list to short phone screens while retaining desktop layout.
- Fixed expanded area lists staying open: pressing Close or clicking the same zone header again now collapses the dropdown.

Verified 710 progression/terrain checks, invalid and locked destination rejection, actual travel, boss-unlock updates, Shop navigation, rapid reopening and loaded artwork in Studio. Desktop and phone simulator layouts were inspected; physical phone/controller input, production multiplayer and database rejoins remain untested. Dropdown opening and closing through both controls were verified with in-game clicks. Saved to Roblox on 9 September 2026 at 22:23 UTC. Not published live. This entry documents a Studio change; game source and photos are delivered separately.

### Teleport Curtain Animation — 9 September 2026

- Added a smooth purple curtain with playful folds, a bouncing destination card and a quick arrival reveal.
- The curtain waits for destination streaming and nearby visual assets before travel and checks loading again after arrival.
- Added departure and arrival sounds, a fast screen fade and a FOV bounce that composes with sprint and dash.
- Added reduced-motion and UI-audio mute support, duplicate-request protection, and screen/control cleanup after rejection, timeout or death.
- Auto Attack pauses while the teleport transition covers the world.

Verified an actual teleport-menu click and server-authorized Spawn travel, successful nearby asset preloading, both loaded sound cues, FOV restoration, reduced-motion/mute behavior, duplicate rejection, rejected-request recovery, timeout and death cleanup in Studio. The Auto Attack pause addition was compiled and inspected. Physical mobile devices and production network conditions remain untested. Saved to Roblox on 9 September 2026 at 22:45 UTC. This entry documents Studio changes; source files are delivered separately. Not published live.

### Instant Boss Respawns — 9 September 2026

- Added an Instant Respawn button beneath every boss loot display, with a repeatable purchase priced at 9 Robux for each of the nine bosses.
- Completed purchases respawn a defeated boss in the current server. If the boss has already returned, the purchased respawn is saved for later use at that boss.
- Added saved receipt protection, retry handling and server checks for proximity, area access and boss state. The normal 90-second timer remains available.
- Kept the expanded display above terrain and moved it clear of the contextual tutorial hint on narrower windows.

Verified all nine Roblox products at 9 Robux, 23 isolated persistence checks, 51 encounter/receipt checks, a completed native Studio test purchase and purchase cancellation. Checked ground clearance across 12 camera positions and the final display in a fresh error-free Studio session. Saved to Roblox on 9 September 2026 at 22:50 UTC; not published live. Real Robux charges, production multiplayer/database rejoins and physical phone/controller input remain untested. This entry documents Studio changes; game source is delivered separately.


### Sword Inventory Layout Fixes — 9 September 2026

- Enlarged rarity stars by 50% and separated stars, fusion labels, sword previews and card status text.
- Corrected inconsistent action lettering, removed obsolete icon padding and fitted long captions on one line.
- Fitted the fusion-tier guide inside the current inventory, restored its Back button label, and prevented sword tooltips from opening through secondary panels.
- Made unavailable Equip/Fuse actions visibly disabled, reflected locked stacks in the tooltip, and moved the tutorial close hint below the inventory controls.

Verified desktop rendering, search empty-state recovery, delete/cancel controls, lock-dependent action states, all ten tier rows and narrow two-column fitting in Studio. The final single-line caption check and runtime log passed; all three final scripts compiled. Saved to Roblox on 9 September 2026 at 22:57 UTC; not published live. Narrow fitting was simulated; physical phone testing remains pending. This documents Studio changes; game source is delivered separately.
