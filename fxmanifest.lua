fx_version 'cerulean'
game 'gta5'
author 'Darrk'
description 'Darrk Police Dispatch'
version '1.0.0'

client_scripts {
    'client/*.lua',
    -- https://github.com/Project-Sloth/ps-dispatch/
    'client/alerts/*.*'
}

server_scripts {
	'@oxmysql/lib/MySQL.lua',
    'server/*.lua'
}

shared_scripts {
    'config/config_framework.lua',
    'config/config_*.lua',
    'config/config_*.js',
    'locales/locales.lua',
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/scripts/*.js',
    'html/styles/*.css',
    'html/images/**/*.*',
    'html/images/*.*'
} 


dependencys {
    'qb-core',
    'qb-target',
    'drk-lib',
    'oxmysql'
}