const http = require('http')
const mineflayer = require('mineflayer')

const PORT = process.env.PORT || 3000

http.createServer((req, res) => {
  res.writeHead(200)
  res.end('Bot działa')
}).listen(PORT, '0.0.0.0')

function startBot() {
  const bot = mineflayer.createBot({
    host: 'anarchia.gg',
    username: process.env.MC_USERNAME,
    version: '1.21.5'
  })

  let loggedIn = false
  let farmStarted = false

  bot.on('message', (message) => {
    const text = message.toString().toLowerCase()

    if (!loggedIn && text.includes('login')) {
      setTimeout(() => {
        bot.chat(`/login ${process.env.MC_PASSWORD}`)
        loggedIn = true

        setTimeout(() => {
          if (!farmStarted) {
            bot.chat('/farma start')
            farmStarted = true
            console.log('Wpisano /farma start')
          }
        }, 3000)
      }, 1000)
    }
  })

  bot.once('spawn', () => {
    console.log('Bot wszedł na serwer!')
  })

  bot.on('end', () => {
    console.log('Bot rozłączony. Ponowna próba za 10 sekund...')
    setTimeout(startBot, 10000)
  })

  bot.on('error', (err) => {
    console.log('Błąd:', err.message)
  })
}

startBot()
