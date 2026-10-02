const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  host: 'anarchia.gg',
  username: process.env.MC_USERNAME,
  auth: 'microsoft',
  version: '1.21.5'
})

bot.once('spawn', () => {
  console.log('Bot wszedł na serwer!')

  setTimeout(() => {
    bot.chat('/farma start')
  }, 5000)
})

bot.on('end', () => {
  console.log('Bot został rozłączony.')
})

bot.on('error', (err) => {
  console.log('Błąd:', err.message)
})
