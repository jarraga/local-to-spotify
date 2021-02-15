const ip = require('ip')
const domain = 'endigital.store'

// mode dev | prod
const mode = process.env.MODE
global.mode = mode || 'dev'

// ip local wifi connection
let wifiIp
if (mode == 'dev') {
    wifiIp = ip.address('wifi')
}

console.clear()
console.log(`running on ${mode.toUpperCase()} mode`)

global.apiPort = {
    dev: 3000,
    prod: 777
}

global.apiBaseUrl = {
    dev: `http://${wifiIp}:${apiPort[mode]}/`,
    prod: `https://${domain}:${apiPort[mode]}/`
}

global.appUrl = {
    dev: `http://${wifiIp}:8080/`,
    prod: 'https://localtospotify.web.app/'
}
