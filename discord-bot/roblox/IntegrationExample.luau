-- EXAMPLE ONLY: adapt these functions inside your EXISTING SERVER reward/hatch service.
-- This file does not grant items and deliberately does not fire on PlayerAdded.
local ServerScriptService = game:GetService("ServerScriptService")
local Notifier = require(ServerScriptService:WaitForChild("DiscordNotifier"))

local function afterSwordWasAwardedAndSaved(player: Player, savedAwardUuid: string)
	-- Replace sample values with your trusted server-side item definitions.
	-- Run only AFTER your inventory service successfully awards/saves the sword.
	local queued, reason = Notifier.RareDrop(player, {
		name = "Celestial Blade",
		rarity = "Mythic",
		chanceDenominator = 100000, -- Actual odds for this roll, including luck modifiers.
	}, "Grasslands Slime", savedAwardUuid)
	if not queued and reason ~= "rarity_filtered" then
		warn("[SwordQuest] Notification not queued: " .. reason)
	end
end

local function afterPetWasAwardedAndSaved(player: Player, savedAwardUuid: string)
	Notifier.RareHatch(player, {
		name = "Golden Dragon",
		rarity = "Secret",
		chanceDenominator = 1000000,
	}, "Forest Egg", savedAwardUuid)
end

return { SwordAwarded = afterSwordWasAwardedAndSaved, PetAwarded = afterPetWasAwardedAndSaved }
