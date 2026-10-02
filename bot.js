const http = require('http')
const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')

const PORT = process.env.PORT || 3000

http.createServer((req, res) => {
  res.writeHead(200)
  res.end('Bot działa')
}).listen(PORT, '0.0.0.0')

function startBot() {
  console.log('Łączenie z serwerem...')

  const bot = mineflayer.createBot({
    host: 'anarchia.gg',
    username: process.env.MC_USERNAME,
    version: '1.21.4'
  })

  bot.loadPlugin(pathfinder)

  let loggedIn = false
  let started = false

  bot.once('spawn', () => {
    console.log('Bot wszedł na serwer!')
  })

  bot.on('message', async (message) => {
    const text = message.toString()

    console.log('CHAT:', text)

    if (!loggedIn && text.toLowerCase().includes('login')) {
      console.log('Logowanie...')

      await new Promise(resolve => setTimeout(resolve, 1000))

      bot.chat(`/login ${process.env.MC_PASSWORD}`)
      loggedIn = true

      console.log('Wpisano /login')

      await new Promise(resolve => setTimeout(resolve, 3000))

      if (!started) {
        started = true
        await wejdzDoSMP()
      }
    }
  })

  async function wejdzDoSMP() {
    console.log('Idę 5 bloków do przodu...')

    const defaultMove = new Movements(bot)

    bot.pathfinder.setMovements(defaultMove)

    const start = bot.entity.position.clone()
    const yaw = bot.entity.yaw

    const x = start.x - Math.sin(yaw) * 5
    const z = start.z - Math.cos(yaw) * 5

    await bot.pathfinder.goto(
      new goals.GoalNear(x, start.y, z, 1)
    )

    console.log('Jestem 5 bloków dalej!')

    await new Promise(resolve => setTimeout(resolve, 1000))

    const entities = Object.values(bot.entities)
      .filter(entity => entity !== bot.entity)
      .filter(entity => entity.position)
      .filter(entity => bot.entity.position.distanceTo(entity.position) < 4)

    if (entities.length > 0) {
      const target = entities[0]

      console.log(
        'Klikam PPM na:',
        target.username || target.name || target.type
      )

      try {
        await bot.lookAt(
          target.position.offset(0, 1, 0),
          true
        )

        bot.activateEntity(target)

        console.log('Kliknięto!')
      } catch (err) {
        console.log('Nie udało się kliknąć:', err.message)
      }
    } else {
      console.log('Nie znaleziono obiektu do kliknięcia!')
    }

    await new Promise(resolve => setTimeout(resolve, 3000))

    console.log('Wpisuję /farma start...')

    bot.chat('/farma start')
  }

  bot.on('kicked', reason => {
    console.log('BOT WYRZUCONY:', reason)
  })

  bot.on('error', err => {
    console.log('BŁĄD:', err.message)
  })

  bot.on('end', reason => {
    console.log('BOT ROZŁĄCZONY:', reason)

    setTimeout(startBot, 10000)
  })
}

startBot()
