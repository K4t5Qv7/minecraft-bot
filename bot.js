const mineflayer = require('mineflayer')

function startBot() {
  const bot = mineflayer.createBot({
    host: 'anarchia.gg',
    username: process.env.MC_USERNAME,
    version: '1.21.5'
  })

  let loggedIn = false

  bot.on('message', (message) => {
    const text = message.toString().toLowerCase()

    // Gdy serwer prosi o zalogowanie
    if (!loggedIn && text.includes('login')) {
      setTimeout(() => {
        bot.chat(`/login ${process.env.MC_PASSWORD}`)
      }, 1000)

      loggedIn = true

      // Po zalogowaniu uruchamia farmę
      setTimeout(() => {
        bot.chat('/farma start')
        console.log('Wpisano /farma start')
      }, 3000)
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
