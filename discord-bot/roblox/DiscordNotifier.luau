--!strict
-- Create a ModuleScript named DiscordNotifier in ServerScriptService and paste this file.
-- NEVER place this module in ReplicatedStorage or call it directly from a RemoteEvent.
local HttpService = game:GetService("HttpService")
local RunService = game:GetService("RunService")
assert(RunService:IsServer(), "DiscordNotifier is server-only")

local Config = {
	Endpoint = "https://YOUR_BOT_HOST/hooks/roblox", -- Replace with your public HTTPS endpoint.
	SecretName = "SWORDQUEST_BOT_API_KEY", -- Value goes in Roblox Secrets, NOT this script.
	Rarities = { legendary = true, mythic = true, mythical = true, secret = true },
	MaxQueue = 200,
	MaxAttempts = 6,
}

type Reward = { name: string, rarity: string, quantity: number?, chanceDenominator: number? }
type QueuedEvent = { eventId: string, body: string }
local queue: { QueuedEvent } = {}
local active = false
local accepting = true
local Notifier = {}

local function send(item: QueuedEvent)
	for attempt = 1, Config.MaxAttempts do
		local secretOk, secret = pcall(function()
			return HttpService:GetSecret(Config.SecretName)
		end)
		if not secretOk then
			warn("[DiscordNotifier] Missing secret. Configure Roblox Secrets (or Studio Local Secrets).")
			return
		end
		local ok, response = pcall(function()
			return HttpService:RequestAsync({
				Url = Config.Endpoint,
				Method = "POST",
				Headers = { ["Content-Type"] = "application/json", ["x-api-key"] = secret },
				Body = item.body,
			})
		end)
		if ok and response.Success then
			return -- HTTP 202 = stored by the bot, NOT necessarily delivered to Discord yet.
		end
		local status = if ok then response.StatusCode else 0
		if status >= 400 and status < 500 and status ~= 408 and status ~= 429 then
			warn(string.format("[DiscordNotifier] Event %s rejected (HTTP %d). Check configuration/payload.", item.eventId, status))
			return
		end
		if attempt < Config.MaxAttempts then
			local delaySeconds = math.min(30, 2 ^ (attempt - 1)) + math.random()
			if ok then
				local headers = response.Headers or {}
				local retryAfter = tonumber(headers["retry-after"] or headers["Retry-After"])
				if retryAfter then delaySeconds = math.max(delaySeconds, retryAfter) end
			end
			task.wait(delaySeconds)
		end
	end
	-- Do not print HTTP bodies, headers or exception strings: they may contain sensitive data.
	warn("[DiscordNotifier] Delivery to bot exhausted retries for event " .. item.eventId)
end

local function runQueue()
	if active then return end
	active = true
	task.spawn(function()
		while #queue > 0 do
			local item = table.remove(queue, 1)
			local ok = pcall(send, item)
			if not ok then warn("[DiscordNotifier] Sender failed for event " .. item.eventId) end
			task.wait(0.5)
		end
		active = false
	end)
end

-- Returns true when locally queued, or false plus a reason. It never waits for the network.
-- Supply the SAME UUID for repeated calls for the same saved reward transaction.
function Notifier.Notify(eventType: string, player: Player, reward: Reward, source: string, awardId: string?): (boolean, string)
	if not accepting then return false, "server_shutting_down" end
	if not Config.Endpoint:match("^https://") or Config.Endpoint:find("YOUR_", 1, true) then
		return false, "configure_https_endpoint"
	end
	if eventType ~= "rare_drop" and eventType ~= "rare_hatch" then return false, "invalid_type" end
	if typeof(player) ~= "Instance" or not player:IsA("Player") or player.UserId <= 0 then return false, "invalid_player" end
	if type(reward) ~= "table" or type(reward.rarity) ~= "string" or type(reward.name) ~= "string" then return false, "invalid_reward" end
	if not (Config.Rarities :: { [string]: boolean })[string.lower(reward.rarity)] then return false, "rarity_filtered" end
	if #queue >= Config.MaxQueue then return false, "local_queue_full" end
	local eventId = awardId or HttpService:GenerateGUID(false)
	local ok, body = pcall(function()
		return HttpService:JSONEncode({
			eventId = eventId,
			type = eventType,
			universeId = game.GameId, -- This is the Universe/Experience ID, NOT the Place ID.
			placeId = game.PlaceId,
			timestamp = os.time(),
			player = { userId = player.UserId, username = player.Name, displayName = player.DisplayName },
			reward = {
				name = reward.name, rarity = reward.rarity, quantity = reward.quantity or 1,
				chanceDenominator = reward.chanceDenominator,
			},
			source = source,
		})
	end)
	if not ok then return false, "invalid_payload" end
	table.insert(queue, { eventId = eventId, body = body })
	runQueue()
	return true, eventId
end

function Notifier.RareDrop(player: Player, reward: Reward, source: string, awardId: string?): (boolean, string)
	return Notifier.Notify("rare_drop", player, reward, source, awardId)
end
function Notifier.RareHatch(player: Player, reward: Reward, source: string, awardId: string?): (boolean, string)
	return Notifier.Notify("rare_hatch", player, reward, source, awardId)
end

game:BindToClose(function()
	accepting = false
	local deadline = os.clock() + 25
	while (active or #queue > 0) and os.clock() < deadline do task.wait(0.1) end
end)

return Notifier
