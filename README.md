# localToSpotify

<img src="img/cover.png" style="border-radius: 1rem" />

This app scans your local mp3 files, searches for them on Spotify based on metadata information and generates a playlist on your account

## Live app

> https://localtospotify.web.app


## Run instructions

- Change name of wifi card (or developer card used) to 'wifi', or put name of actual card in globals.js line 11
- Check global variables in globals.js

## Environment variables server side 

- MODE ('dev' or 'prod')
- SPOTIFY_CLIENT_ID
- SPOTIFY_CLIENT_SECRET

I use telegram bot to error notifications

- TG_ADMIN_CHAT_ID
- TG_BOT_TOKEN

## Environment variables client side

Check .env.production and .env.development files in vue folder

- VUE_APP_SERVER_URL
- VUE_APP_CB_URL

## Run

### server

- "/" npm i
- "/" node main.js

### client

- "/vue" npm i
- "/vue" npm run serve

## Deploy

### server

- upload code to your own server or heroku app
- set MODE environment variable to 'prod'
- "/" node main.js

### client

- "/vue" npm run build
- upload client app (dist folder) to firebase or netlify like SPA app
- or to your own server and serve it like SPA
https://gist.github.com/ryanoglesby08/1e1f49d87ae8ab2cabf45623fc36a7fe

### pm2 commands for your own server

- backend "/"

> SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=xxx TG_ADMIN_CHAT_ID=xxx TG_BOT_TOKEN=xxx pm2 --name spoty-backend start main.js

- frontend "/vue"

> pm2 --name spoty-frontend serve --spa dist 5000

## Comments and feedback:

[Telegram](https://t.me/jarraga)

[Whatsapp](https://wa.me/5493482633220)
