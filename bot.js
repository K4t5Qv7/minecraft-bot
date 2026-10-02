const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  host: 'anarchia.gg',
  username: process.env.MC_USERNAME,
  version: '1.21.5'
})

bot.on('message', (message) => {
  const text = message.toString()

  if (text.toLowerCase().includes('login')) {
    setTimeout(() => {
      bot.chat(`/login ${process.env.MC_PASSWORD}`)
    }, 1000)
  }
})

bot.once('spawn', () => {
  console.log('Bot wszedł na serwer!')
})

bot.on('end', () => {
  console.log('Rozłączono z serwerem.')
})

bot.on('error', (err) => {
  console.log('Błąd:', err.message)
})
