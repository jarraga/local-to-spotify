const adminChatId = process.env.TG_ADMIN_CHAT_ID
const botToken = process.env.TG_BOT_TOKEN

const fetch = require('node-fetch')

const sendMessage = message => {
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: adminChatId,
            text: message,
        })
    })
}

module.exports = { sendMessage }