local DRKDispatch = exports[Config.CoreName]:GetCoreObject()

DRKDispatch.Functions.CreateCallback('drk-policesystem:server:getActiveCops', function(source, cb)
    local ActivePolice = 0
    local OnDutyPolice = 0
    local OffDutyPolice = 0
    local BusyDutyPolice = 0
    local Data = {}
    for k,v in pairs(DRKDispatch.Functions.GetPlayers()) do
        local Player = DRKDispatch.Functions.GetPlayer(v)
        if Player.PlayerData.job.name == 'police' then
            ActivePolice = ActivePolice + 1
            if Player.PlayerData.job.onduty then
                OnDutyPolice = OnDutyPolice + 1
            else
                OffDutyPolice = OffDutyPolice + 1
            end
            if Player.PlayerData.job.busy then
                BusyDutyPolice = BusyDutyPolice + 1 
            end

            local rank = Player.PlayerData.job.grade.name
            local FullName = (Player.PlayerData.charinfo.firstname.. " "..Player.PlayerData.charinfo.lastname)
            local callsign = Player.PlayerData.metadata['callsign']
            local duty = Player.PlayerData.job.onduty
            local busy = Player.PlayerData.job.busy
            local id = Player.PlayerData.source
            local officerArea = Player.PlayerData.metadata['police']['dir']
            
            table.insert(Data, {
                src = source,
                id = id,
                rank = rank,
                name = FullName,
                callsign = callsign,
                duty = duty,
                busy = busy,
                area = officerArea
            })
        end
    end
    cb(ActivePolice, OnDutyPolice, OffDutyPolice, BusyDutyPolice, Data)
end)

DRKDispatch.Functions.CreateCallback('drk-policesystem:server:GetActiveWings', function(source, cb)
    local HeavyCops = {}
    local K9Cops = {}
    local UnderCoverCops = {}
    local PilotsCops = {}

    for k,v in pairs(DRKDispatch.Functions.GetPlayers()) do
        local Player = DRKDispatch.Functions.GetPlayer(v)
        if Player.PlayerData.job.name == 'police' then
            if Player.PlayerData.metadata['wings']['weapons'] then
                table.insert(HeavyCops, {
                    name = Player.PlayerData.charinfo.firstname.. " "..Player.PlayerData.charinfo.lastname,
                })
            end
            if Player.PlayerData.metadata['wings']['k9'] then
                table.insert(K9Cops, {
                    name = Player.PlayerData.charinfo.firstname.. " "..Player.PlayerData.charinfo.lastname,
                })
            end
            if Player.PlayerData.metadata['wings']['undercover'] then
                table.insert(UnderCoverCops, {
                    name = Player.PlayerData.charinfo.firstname.. " "..Player.PlayerData.charinfo.lastname,
                })
            end
            if Player.PlayerData.metadata['wings']['pilot'] then
                table.insert(PilotsCops, {
                    name = Player.PlayerData.charinfo.firstname.. " "..Player.PlayerData.charinfo.lastname,
                })
            end
        end
    end

    -- --print(json.encode(HeavyCops) == '[]')
    if json.encode(HeavyCops) == '[]' then
        HeavyCops = 'nothing'
    end

    if json.encode(K9Cops) == '[]' then
        K9Cops = 'nothing'
    end

    if json.encode(UnderCoverCops) == '[]' then
        UnderCoverCops = 'nothing'
    end

    if json.encode(PilotsCops) == '[]' then
        PilotsCops = 'nothing'
    end
    cb(HeavyCops, K9Cops, UnderCoverCops, PilotsCops)
end)

DRKDispatch.Commands.Add('wings', 'Change Wing status for police officer', {
    {name = 'type', help = 'remove / add'},
    {name = 'wing', help = 'k9 / weapons / undercover / pilot'},
    {name = 'officerid', help = 'OfficerId'}
}, false, function(source, args)
    local Me = DRKDispatch.Functions.GetPlayer(source)
    local Target = DRKDispatch.Functions.GetPlayer(tonumber(args[3]))
    local type = args[1]
    local wing = args[2]
    
    if type ~= nil and wing ~= nil and Target ~= nil then
        if type == 'remove' then
            if wing == 'k9' or wing == 'weapons' or wing == 'undercover' or 'pilot' then
                Target.Functions.SetMetaData('wings', {
                    [wing] = false,
                })
                TriggerClientEvent('drk-policesystem:client:showmessage', Target.PlayerData.source, 'You lost a wing : '..wing)  
            else
                TriggerClientEvent('drk-policesystem:client:showmessage', source, 'Wings Types (k9, pilot, undercover, weapons)')        
            end
        elseif type == 'add' then
            if wing == 'k9' or wing == 'weapons' or wing == 'undercover' or 'pilot' then
                Target.Functions.SetMetaData('wings', {
                    [wing] = true,
                })
                TriggerClientEvent('drk-policesystem:client:showmessage', Target.PlayerData.source, 'You got a new wing : '..wing)  
            else
                TriggerClientEvent('drk-policesystem:client:showmessage', source, 'Wings Types (k9, pilot, undercover, weapons)')        
            end
        else

        end
    else
        TriggerClientEvent('drk-policesystem:client:showmessage', source, 'Please Insert the correct info!')
    end
end)

RegisterCommand('createmeta', function(source, args)
    local Player = DRKDispatch.Functions.GetPlayer(source)
    Player.Functions.SetMetaData('wings', {
        ['weapons'] = false,
        ['k9'] = false,
        ['undercover'] = false,
        ['pilot'] = false,  
    })
end)

RegisterCommand('Setmeta', function(source, args)
    local Player = DRKDispatch.Functions.GetPlayer(source)
    Player.Functions.SetMetaData('wings', {
        ['weapons'] = true,
        ['k9'] = false,
        ['undercover'] = true,
        ['pilot'] = true,  
    })
end)

DRKDispatch.Functions.CreateCallback('drk-policesystem:server:dirOfficer', function(source, cb, area, target)
    local id = tonumber(target)
    local Target = DRKDispatch.Functions.GetPlayer(id)

    if Target ~= nil and Target.PlayerData.job.name == 'police' then
        cb(true, (Target.PlayerData.charinfo.firstname.. ' '..Target.PlayerData.charinfo.lastname))
        TriggerClientEvent('drk-policesystem:client:showmessage', id, area)
        Target.Functions.SetMetaData('police', {
            ['dir'] = area
        })
    else
        cb(false)
    end
end)

RegisterNetEvent('drk-policesystem:server:SendAnnouncement', function(Message)
    for k, v in pairs(DRKDispatch.Functions.GetPlayers()) do
        local Player = DRKDispatch.Functions.GetPlayer(v)

        if Player.PlayerData.job.name == 'police' then
            TriggerClientEvent('drk-policesystem:client:showmessage', tonumber(v), 'Message From Dispatch : ' ..Message)
        end
    end
end)

RegisterNetEvent('drk-policesystem:server:serachCitizen', function(data)
    local Player = DRKDispatch.Functions.GetPlayerByCitizenId(data.info)

    if Player ~= nil then
        TriggerClientEvent('drk-policesystem:client:showmessage', source, 'Citizen Name : '..Player.PlayerData.charinfo.firstname.. ' '..Player.PlayerData.charinfo.lastname..',  Phone Number : '..Player.PlayerData.charinfo.phone)
    else
        TriggerClientEvent('drk-policesystem:client:showmessage', source, 'No One With this Citizen Id')
    end
end)

RegisterNetEvent('drk-policesystem:server:serachPlate', function(data)
    local src = source
    local result = MySQL.query.await('SELECT * FROM player_vehicles WHERE plate LIKE ? LIMIT 1', {data})
    if result then
        -- --print(json,encode(result))
        for i = 1, #result do
            local row = result[i]
            local VehicleOwner = DRKDispatch.Functions.GetPlayerByCitizenId(row.citizenid)
            if VehicleOwner ~= nil then
                -- --print(row.citizenid, row.vehicle, row.garage)
                -- --print( VehicleOwner.PlayerData.charinfo.firstname)
                TriggerClientEvent('drk-policesystem:client:showmessage', src, 'Owner Name : '..VehicleOwner.PlayerData.charinfo.firstname.. ' '..VehicleOwner.PlayerData.charinfo.lastname..',  Owner Citizen Id : '..VehicleOwner.PlayerData.citizenid)
            else
                TriggerClientEvent('drk-policesystem:client:showmessage', src, 'There is no vehicle with this plate')
            end
       end
    else
        TriggerClientEvent('drk-policesystem:client:showmessage', src, 'There is no vehicle with this plate')
    end
end)

-- WBO42461

-- drk-policesystem
local calls = {}

function _U(entry)
	return Locales[Config.Locale][entry] 
end

local function IsPoliceJob(job)
    for k, v in pairs(Config.PoliceJob) do
        if job == v then
            return true
        end
    end
    return false
end

local function IsDispatchJob(job)
    for k, v in pairs(Config.PoliceAndAmbulance) do
        if job == v then
            return true
        end
    end
    return false
end

RegisterNetEvent("dispatch:server:notify", function(data)
	local newId = #calls + 1
	calls[newId] = data
    calls[newId]['source'] = source
    calls[newId]['callId'] = newId
    calls[newId]['units'] = {}
    calls[newId]['responses'] = {}
    calls[newId]['time'] = os.time() * 1000

	TriggerClientEvent('dispatch:clNotify', -1, data, newId, source)
    TriggerClientEvent("drk-policesystem:client:AddCallBlip", -1, data.origin, dispatchCodes[data.dispatchcodename], newId)
end)

function GetDispatchCalls() return calls end
exports('GetDispatchCalls', GetDispatchCalls) -- 

-- this is mdt call
AddEventHandler("dispatch:addUnit", function(callid, player, cb)
    if calls[callid] then
        if #calls[callid]['units'] > 0 then
            for i=1, #calls[callid]['units'] do
                if calls[callid]['units'][i]['cid'] == player.cid then
                    cb(#calls[callid]['units'])
                    return
                end
            end
        end

        if IsPoliceJob(player.job.name) then
            calls[callid]['units'][#calls[callid]['units']+1] = { cid = player.cid, fullname = player.fullname, job = 'Police', callsign = player.callsign }
        elseif player.job.name == 'ambulance' then
            calls[callid]['units'][#calls[callid]['units']+1] = { cid = player.cid, fullname = player.fullname, job = 'EMS', callsign = player.callsign }
        end
        cb(#calls[callid]['units'])
    end
end)

AddEventHandler("dispatch:sendCallResponse", function(player, callid, message, time, cb)
    local Player = DRKDispatch.Functions.GetPlayer(player)
    local name = Player.PlayerData.charinfo.firstname.. " " ..Player.PlayerData.charinfo.lastname
    if calls[callid] then
        calls[callid]['responses'][#calls[callid]['responses']+1] = {
            name = name,
            message = message,
            time = time
        }
        local player = calls[callid]['source']
        if GetPlayerPing(player) > 0 then
            TriggerClientEvent('dispatch:getCallResponse', player, message)
        end
        cb(true)
    else
        cb(false)
    end
end)

-- this is mdt call
AddEventHandler("dispatch:removeUnit", function(callid, player, cb)
    if calls[callid] then
        if #calls[callid]['units'] > 0 then
            for i=1, #calls[callid]['units'] do
                if calls[callid]['units'][i]['cid'] == player.cid then
                    calls[callid]['units'][i] = nil
                end
            end
        end
        cb(#calls[callid]['units'])
    end    
end)


RegisterCommand('togglealerts', function(source, args, user)
	local source = source
    local Player = DRKDispatch.Functions.GetPlayer(source)
	local job = Player.PlayerData.job
	if IsPoliceJob(job.name) or job.name == 'ambulance' then
		TriggerClientEvent('dispatch:manageNotifs', source, args[1])
	end
end)

-- Explosion Handler
local ExplosionCooldown = false
AddEventHandler('explosionEvent', function(source, info)
    if ExplosionCooldown then return end

    for i = 1, (#Config.ExplosionTypes) do
        if info.explosionType == Config.ExplosionTypes[i] then
            TriggerClientEvent("drk-policesystem:client:Explosion", source)
            ExplosionCooldown = true
            SetTimeout(1500, function()
                ExplosionCooldown = false
            end)
        end
    end
end)

DRKDispatch.Commands.Add("cleardispatchblips", "Clear all dispatch blips", {}, false, function(source, args)
    local src = source
    local Player = DRKDispatch.Functions.GetPlayer(src)
	local job = Player.PlayerData.job.name
    if IsDispatchJob(job) then
        TriggerClientEvent('drk-policesystem:client:clearAllBlips', src)
    end
end)

DRKDispatch.Functions.CreateCallback('drk-policesystem:server:getActiveCopsNumber', function(source, cb)
    local ActiveCops = 0
    for k,v in pairs(DRKDispatch.Functions.GetPlayers()) do
        local Player = DRKDispatch.Functions.GetPlayer(v)
        if Player.PlayerData.job.name == 'police' then
            ActiveCops = ActiveCops + 1
        end
    end
    cb(ActiveCops)
end)

-- MiniHub

RegisterNetEvent('drk-policesystem:server:updateofficer', function(type, variable)
    local Player = DRKDispatch.Functions.GetPlayer(source)
    local variable = ''
    --print(variable, Player.PlayerData.metadata['showradio'])
    if type == 'busy' then
        Player.Functions.SetJobBusy(not Player.PlayerData.job.busy)
    elseif type == 'duty' then
        Player.Functions.SetJobDuty(not Player.PlayerData.job.onduty)
    elseif type == 'radiochannel' then
        if not Player.PlayerData.metadata['showradio'] then
            variable = true
        elseif Player.PlayerData.metadata['showradio'] then
            variable = false
        end
        --print(variable, Player.PlayerData.metadata['showradio'])
        Player.Functions.SetMetaData('showradio', variable)
    end
    UpdateForAll()
end)

DRKDispatch.Functions.CreateCallback('drk-policesystem:server:GetData', function(source, cb)
    local Officers = {}
    local OfficersCount = 0
    for k, id in pairs(DRKDispatch.Functions.GetPlayers()) do
        local Ply = DRKDispatch.Functions.GetPlayer(id)
        
        if Ply.PlayerData.job.name == 'police' then
            OfficersCount = OfficersCount + 1

            local officerRank = Ply.PlayerData.job.grade.name
            local officerFullName = (Ply.PlayerData.charinfo.firstname.. " "..Ply.PlayerData.charinfo.lastname)
            local officerCallsign = Ply.PlayerData.metadata['callsign']
            local officerDuty = Ply.PlayerData.job.onduty
            local officerBusy = Ply.PlayerData.job.busy
            local officerId = Ply.PlayerData.source
            local officerShow = Ply.PlayerData.metadata['showradio']
            local officerChannel = Player(officerId).state['radioChannel']
            local officerVehicle = (GetVehiclePedIsIn(GetPlayerPed(id)))
            -- --print(officerChannel)
            table.insert(Officers, {
                src = source,
                id = officerId,
                rank = officerRank,
                name = officerFullName,
                callsign = officerCallsign,
                duty = officerDuty,
                busy = officerBusy,
                radioShow = officerShow,
                radioChannel = officerChannel,
                vehicle = officerVehicle,
            })
        end
    end
    
    cb(Officers, OfficersCount)
end)

function UpdateForAll()
    for k,v in pairs(DRKDispatch.Functions.GetPlayers()) do
        local Player = DRKDispatch.Functions.GetPlayer(v)
        if Player.PlayerData.job.name == 'police' then
            TriggerClientEvent('drk-policesystem:client:update', Player.PlayerData.source)
        end
    end
end

CreateThread(function()
    while true do
        Wait(1000)
        UpdateForAll()
    end
end)

DRKDispatch.Functions.CreateCallback('drk-policesystem:server:GetDir')