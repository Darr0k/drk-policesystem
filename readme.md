# Darrk Police System V1
`All you need for the police :)`
## Preview

![App Screenshot](https://media.discordapp.net/attachments/964753121744142336/1012156451634024559/unknown.png?width=1193&height=671)

![App Screenshot](https://media.discordapp.net/attachments/964753121744142336/1012156452057653359/unknown.png)

![App Screenshot](https://media.discordapp.net/attachments/964753121744142336/1012156452405776494/unknown.png)

![App Screenshot](https://media.discordapp.net/attachments/964753121744142336/1012156453085257748/unknown.png?width=554&height=671)


## Dependencies

[[qb-core]](https://github.com/qbcore-framework/qb-core/) (Latest) \
[[qb-target]](https://github.com/qbcore-framework/qb-target/) (Optional)\
[[drk-lib]](https://github.com/Darr0k/drk-lib) (Latest)\
[[oxmysql]](https://github.com/overextended/oxmysql/) (Latest)

## Installation
`qb-core/server/player.lua:144` \
```lua
PlayerData.metadata['police'] = PlayerData.metadata['police'] or {}
PlayerData.metadata['police']['points'] = PlayerData.metadata['police']['points'] or 0
PlayerData.metadata['wings'] = PlayerData.metadata['wings'] or {
    ['weapons'] = false,
    ['k9'] = false,
    ['undercover'] = false,
    ['pilot'] = false
}
```

`qb-core/server/player.lua:176` \
Replace Job With This
```lua
if PlayerData.job and PlayerData.job.name and not QBCore.Shared.Jobs[PlayerData.job.name] then PlayerData.job = nil end
PlayerData.job = PlayerData.job or {}
PlayerData.job.name = PlayerData.job.name or 'unemployed'
PlayerData.job.label = PlayerData.job.label or 'Civilian'
PlayerData.job.payment = PlayerData.job.payment or 10
PlayerData.job.type = PlayerData.job.type or 'none'
PlayerData.job.busy = PlayerData.job.busy or false

if QBCore.Shared.ForceJobDefaultDutyAtLogin or PlayerData.job.onduty == nil then
    PlayerData.job.onduty = QBCore.Shared.Jobs[PlayerData.job.name].defaultDuty
end
PlayerData.job.isboss = PlayerData.job.isboss or false
PlayerData.job.grade = PlayerData.job.grade or {}
PlayerData.job.grade.name = PlayerData.job.grade.name or 'Freelancer'
PlayerData.job.grade.level = PlayerData.job.grade.level or 0
```

*Optional* \
`qb-radialmenu/config.lua` \
Search for `["police"]` and add This
```lua
{
    id = 'Darrk_System',
    title = 'Police System',
    icon = 'tablet',
    type = 'client',
    event = 'drk-policesystem:client:opensystem',
    shouldClose = true
},
```
## Credits
- Original Alerts: https://github.com/Project-Sloth/ps-dispatch
