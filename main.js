require('./globals')

// certificate

const fs = require('fs')

let cert, key, ca, credentials

if (mode == 'prod') {
    cert = fs.readFileSync('/home/ssl/cert.crt')
    key = fs.readFileSync('/home/ssl/key.key')
    ca = fs.readFileSync('/home/ssl/ca.pem')
    credentials = { key, cert, ca }
}

// app

const express = require('express')
const cors = require('cors')
const https = require('https')

const app = express()
app.use(express.json())
app.use(cors({ origin: appUrl[mode] }))


// appToken
const { appToken } = require('./controllers')
app.get('/appToken', appToken)

// userToken
const { userToken } = require('./controllers')
app.post('/userToken', userToken)


// run app

if (mode == 'dev') {
    app.listen(apiPort[mode], () => console.log(`API => ${apiBaseUrl[mode]}`))
} else {
    const appHttps = https.createServer(credentials, app)
    appHttps.listen(apiPort[mode], '0.0.0.0', () => {
        console.log(`API => ${apiBaseUrl[mode]}`)
    })
}