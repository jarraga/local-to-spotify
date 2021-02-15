const fetch = require('node-fetch')
const { sendMessage } = require('./telegram')

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
const base64 = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

let accessToken = {
    code: null,
    timeStamp: null,
    type: null,
    age: null
}

// 50 minutes
const expireTime = 50 * 60000

const appToken = (req, res) => {

    if (accessToken.timeStamp) {
        if (Date.now() - accessToken.timeStamp < expireTime) {
            accessToken.type = 'old'
            res.send({ result: 'ok', data: accessToken })
            return
        }
    }

    const body = new URLSearchParams({
        grant_type: 'client_credentials'
    })

    fetch('https://accounts.spotify.com/api/token', {
        method: 'post',
        headers: { Authorization: `Basic ${base64}` },
        body
    })
        .then(r => r.json())
        .then(r => {
            accessToken.code = r.access_token
            accessToken.type = 'new'
            accessToken.timeStamp = Date.now()
            res.send({ result: 'ok', data: accessToken })
        })
        .catch(err => {
            sendMessage(err)
            res.send({ result: 'error', message: 'internal error in the server, the administrator has already been notified' })
        })
}

const userToken = (req, res) => {

    const { code } = req.body

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${appUrl[mode]}callback`,
        client_id: clientId,
        client_secret: clientSecret,
    });

    fetch(`https://accounts.spotify.com/api/token`, {
        method: 'post',
        body,
    })
        .then((r) => r.json())
        .then((r) => {
            res.send({ result: 'ok', data: r })
        })
        .catch(err => {
            sendMessage(err)
            res.send({ result: 'error', message: 'internal error in the server, the administrator has already been notified' })
        })
}

module.exports = { appToken, userToken }