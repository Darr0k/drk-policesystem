local DRKDispatch = exports[Config.CoreName]:GetCoreObject()
local SystemOpen = false
local PoliceLos = 0
local PoliceSan = 0
local PoliceHighWay = 0
local PDPaletoActive = 0
local Library = exports['drk-lib']
local OpenedMiniHub = false
local PlayerData = {}

-- Sets the playerdata when spawned
RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    PlayerData = DRKDispatch.Functions.GetPlayerData()
end)

-- Sets the playerdata to an empty table when the player has quit or did /logout
RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    PlayerData = {}
end)

-- When the players job gets updated this will trigger and update the playerdata
RegisterNetEvent('QBCore:Client:OnJobUpdate', function(JobInfo)
    PlayerData.job = JobInfo
end)

-- When the players gang gets updated this will trigger and update the playerdata
RegisterNetEvent('QBCore:Client:OnGangUpdate', function(GangInfo)
    PlayerData.gang = GangInfo
end)

-- This will update all the PlayerData that doesn't get updated with a specific event other than this like the metadata
RegisterNetEvent('QBCore:Player:SetPlayerData', function(val)
    PlayerData = val
end)

RegisterNUICallback('refresh_System', function(data)
    RefreshSystem()
end)

RegisterNUICallback('close_System', function()
    SetNuiFocus(false, false)
    SystemOpen = false
end)

RegisterNUICallback('GetWings', function(data, cb)
    DRKDispatch.Functions.TriggerCallback('drk-policesystem:server:GetActiveWings', function(HeavyCops, K9Cops, UnderCoverCops, PilotsCops)
        if data.WingType == 'heavy-weapons' then
            cb(HeavyCops)
        elseif data.WingType == 'dogs' then
            cb(K9Cops)
        elseif data.WingType == 'undercover' then
            cb(UnderCoverCops)
        elseif data.WingType == 'helicopters' then
            cb(PilotsCops)
        end
    end)
end)

RegisterNUICallback('send_Dir', function(data)
    DRKDispatch.Functions.TriggerCallback('drk-policesystem:server:dirOfficer', function(isFinished, Message)
        if isFinished then
            SendMessage(Message..' Directed')
        else
            SendMessage('Officer Not Online')
        end
    end, data.area, data.id)
end)

RegisterNUICallback('SendAnnouncement', function(data)
    TriggerServerEvent('drk-policesystem:server:SendAnnouncement', data.info)
end)

RegisterNUICallback('SearchForCitizen', function(data)
    TriggerServerEvent('drk-policesystem:server:serachCitizen', data)
end)

RegisterNUICallback('SearchForVehicle', function(data)
    TriggerServerEvent('drk-policesystem:server:serachPlate', data.info)
end)

RegisterNUICallback('WatchCamera', function(data)
    if Config.Framework == 'DRKDispatch' then
        TriggerEvent('police:client:ActiveCamera', tonumber(data.info))
    else
        Config.Functions.Camera()
    end
end)

RegisterNUICallback('update', function(data)
    -- --print(data.type, data.variables)
    TriggerServerEvent('drk-policesystem:server:updateofficer', data.type, data.variable)
end)

RegisterNUICallback('markOfficer', function(data)
    if tonumber(data.id) ~= GetPlayerServerId(NetworkGetEntityOwner(PlayerPedId())) then
        local PlayerCoords = GetEntityCoords(GetPlayerPed(GetPlayerFromServerId(data.id)))
        SetNewWaypoint(PlayerCoords.x, PlayerCoords.y)
        DRKDispatch.Functions.Notify('Officer Located!', 'success')
    else
        DRKDispatch.Functions.Notify('You Cant mark your self !', 'error')
    end
end)

RegisterNUICallback('hide_cursor', function()
    SetNuiFocus(false, false)
    cursor = false
end)

RegisterCommand('testmic', function()
    OpenDispatchSystem()
end)

RegisterCommand('+OpenHub', function()
    local job = DRKDispatch.Functions.GetPlayerData().job
    -- --print(job.name == 'police', job.name)
    if job.name == 'police' then
        if not OpenedMiniHub then
            DRKDispatch.Functions.TriggerCallback('drk-policesystem:server:GetData', function(Data, OnDutyPolice)
                local id = GetPlayerServerId(NetworkGetEntityOwner(PlayerPedId()))
                for i,v in ipairs(Data) do 
                    if v.src == id then
                        Data[i].self = true
                    end
                end

                for i,v in ipairs(Data) do 
                    if v.vehicle ~= nil and v.vehicle ~= 0 then
                        local ped = GetPlayerPed(GetPlayerFromServerId(v.id))
                        local Vehicle = GetVehiclePedIsIn(ped)
                        print('VehicleClass: '..GetVehicleClass(Vehicle))
                        local Vehicleclass = GetVehicleClass(Vehicle)
                        Data[i].Vehicleclass = Vehicleclass
                    end
                end
            
                SendNuiMessage(json.encode({
                    action = 'OpenHub',
                    Data = Data,
                    OfficersCount = OnDutyPolice,
                    defultColor = Config.MainColor
                }))
                OpenedMiniHub = true
            end)
        else
            SendNuiMessage(json.encode({
                action = 'hide_hub'
            }))
            OpenedMiniHub = false
        end
    end
end)
RegisterCommand('+ShowCursor', function()
    local job = DRKDispatch.Functions.GetPlayerData().job
    -- --print(job.name == 'police', job.name)
    if job.name == 'police' then
        if OpenedMiniHub and not cursor then
            SetNuiFocus(true, true)
            cursor = true
        else
            SetNuiFocus(false, false)
            cursor = false
        end
    end
end)

RegisterKeyMapping('+OpenHub', 'Police Hub', 'keyboard', Config.MiniHub.OpenKeyBind)
RegisterKeyMapping('+ShowCursor', 'Police Hub Cursor', 'keyboard', Config.MiniHub.CursorKeyBind)

function OpenDispatchSystem()
    local PlayerData = DRKDispatch.Functions.GetPlayerData()
    if PlayerData.job.name == 'police' then
        if not SystemOpen then
            DRKDispatch.Functions.TriggerCallback('drk-policesystem:server:getActiveCops', function(ActivePolice, OnDutyPolice, OffDutyPolice, BusyDutyPolice, Data)
                local id = GetPlayerServerId(NetworkGetEntityOwner(PlayerPedId()))
                PoliceLos = 0
                PoliceSan = 0
                PoliceHighWay = 0
                PDPaletoActive = 0
                for i,v in ipairs(Data) do 
                    if v.src == id then
                        Data[i].self = true
                    end

                    local ped = GetPlayerPed(GetPlayerFromServerId(v.src))
                    local pos = GetEntityCoords(ped)
                    local los = GetDistanceBetweenCoords(pos, -390.9749, -877.7206, 155.39569, 0.3666915)
                    local sandy = GetDistanceBetweenCoords(pos, 1642.6593, 3873.3552, 155.39672, 215.36669)
                    local milltairy = GetDistanceBetweenCoords(pos, -2179.934, 3079.9108, 99.986839, 48.023315)
                    local paleto = GetDistanceBetweenCoords(pos, -145.8406, 6334.4121, 90.086837, 155.52333)
                    if los < 2500 then
                        PoliceLos = PoliceLos + 1
                    elseif sandy < 2300 then
                        PoliceSan = PoliceSan + 1
                    elseif milltairy < 1000 then
                        PoliceHighWay = PoliceHighWay + 1
                    elseif paleto < 715 then
                        PDPaletoActive = PDPaletoActive + 1
                    end
                end
            
                SendNuiMessage(json.encode({
                    action = 'open',
                    ActivePolice = ActivePolice,
                    OnDutyPolice = OnDutyPolice,
                    OffDutyPolice = OffDutyPolice,
                    BusyDutyPolice = BusyDutyPolice,
                    Data = Data,
                    Sandy = PoliceSan,
                    Los = PoliceLos,
                    Great = PoliceHighWay,
                    Paleto = PDPaletoActive,
                    defultColor = Config.MainColor
                }))
            end)
            SetNuiFocus(true, true)
            SystemOpen = true
        end
    else
        -- Anti-Cheat Event
    end
end

function RefreshSystem()
    local PlayerData = DRKDispatch.Functions.GetPlayerData()
    if PlayerData.job.name == 'police' then
        if not SystemOpen then
            DRKDispatch.Functions.TriggerCallback('drk-policesystem:server:getActiveCops', function(ActivePolice, OnDutyPolice, OffDutyPolice, BusyDutyPolice, Data)
                local id = GetPlayerServerId(NetworkGetEntityOwner(PlayerPedId()))
                PoliceLos = 0
                PoliceSan = 0
                PoliceHighWay = 0
                PDPaletoActive = 0
                for i,v in ipairs(Data) do 
                    if v.src == id then
                        Data[i].self = true
                    end

                    local ped = GetPlayerPed(GetPlayerFromServerId(v.src))
                    local pos = GetEntityCoords(ped)
                    local los = GetDistanceBetweenCoords(pos, -390.9749, -877.7206, 155.39569, 0.3666915)
                    local sandy = GetDistanceBetweenCoords(pos, 1642.6593, 3873.3552, 155.39672, 215.36669)
                    local milltairy = GetDistanceBetweenCoords(pos, -2179.934, 3079.9108, 99.986839, 48.023315)
                    local paleto = GetDistanceBetweenCoords(pos, -145.8406, 6334.4121, 90.086837, 155.52333)
                    if los < 2500 then
                        PoliceLos = PoliceLos + 1
                    elseif sandy < 2300 then
                        PoliceSan = PoliceSan + 1
                    elseif milltairy < 1000 then
                        PoliceHighWay = PoliceHighWay + 1
                    elseif paleto < 715 then
                        PDPaletoActive = PDPaletoActive + 1
                    end
                end
            
                SendNuiMessage(json.encode({
                    action = 'refresh',
                    ActivePolice = ActivePolice,
                    OnDutyPolice = OnDutyPolice,
                    OffDutyPolice = OffDutyPolice,
                    BusyDutyPolice = BusyDutyPolice,
                    Data = Data,
                    Sandy = PoliceSan,
                    Los = PoliceLos,
                    Great = PoliceHighWay,
                    Paleto = PDPaletoActive,
                    defultColor = Config.MainColor
                }))
            end)
            SetNuiFocus(true, true)
            SystemOpen = true
        end
    else
        -- Anti-Cheat Event
    end
end

RegisterNetEvent('drk-policesystem:client:showmessage', function(message)
    --print(message)
    SendNUIMessage({
        action = 'Message',
        message = message
    })
end)

RegisterNetEvent('drk-policesystem:client:update', function()
    RefreshHub()
end)

function SendMessage(message)
    SendNUIMessage({
        action = 'Message',
        message = message
    })
end

function RefreshHub()
    local PlayerData = DRKDispatch.Functions.GetPlayerData()
    if PlayerData.job.name == 'police' then
        DRKDispatch.Functions.TriggerCallback('drk-policesystem:server:GetData', function(Data, OnDutyPolice)
            local id = GetPlayerServerId(NetworkGetEntityOwner(PlayerPedId()))
            for i,v in ipairs(Data) do 
                if v.src == id then
                    Data[i].self = true
                end
            end
        
            for i,v in ipairs(Data) do 
                if v.vehicle ~= nil and v.vehicle ~= 0 then
                    local ped = GetPlayerPed(GetPlayerFromServerId(v.id))
                    local Vehicle = GetVehiclePedIsIn(ped)
                    print('VehicleClass: '..GetVehicleClass(Vehicle))
                    local Vehicleclass = GetVehicleClass(Vehicle)
                    Data[i].Vehicleclass = Vehicleclass
                end
            end

            SendNuiMessage(json.encode({
                action = 'refresh_hub',
                Data = Data,
                OfficersCount = OnDutyPolice,
                defultColor = Config.MainColor
            }))
        end)
    else
        -- Anti-Cheat Event
    end
end


if Config.Target['Enable'] then
    for k,v in pairs(Config.Target['Zones']) do
        exports[Config.Target['ScriptName']]:AddBoxZone(k.."_Dispatch", v.coords, v.lenght, v.width, {
            name=k.."_Dispatch",
            heading=v.heading,
            debugPoly=v.poly,
            minZ = v.minZ,
            maxZ = v.maxZ,
            }, {
                options = {
                    {
                        action = function(entity)
                            OpenDispatchSystem()
                        end,
                        canInteract = function(entity)
                            if v.CheckDuty then
                                return (DRKDispatch.Functions.GetPlayerData().job.onduty)
                            else
                                return true
                            end
                        end,
                        icon = v.icon,
                        label = v.Label,
                    },
                },
            distance = 3.5
        })
    end
end

RegisterNetEvent('drk-policesystem:client:opensystem', function()
    local PlayerData = DRKDispatch.Functions.GetPlayerData()

    if PlayerData.job.name == 'police' then
        OpenDispatchSystem()
    else
        -- Anti-Cheat Event
    end
end)
exports('OpenDispatchSystem', OpenDispatchSystem)
exports('SendMessage', SendMessage)
