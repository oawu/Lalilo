/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const http = require('http')
const chokidar = require('chokidar')
const socketIo = require('socket.io')

const xterm = require('@oawu/xterm')
const { Print, Sigint, Type: T, tryFunc } = require('@oawu/helper')
const { cli, during } = require('@oawu/_Helper')
const Valid = require('@oawu/_Valid')
const Config = require('@oawu/_Config')

const Port = require('@oawu/_Port')
const Response = require('@oawu/_Response')
const Display = require('@oawu/_Display')
const Dispatch = require('@oawu/_FactoryDispatch')
const FactoryFile = require('@oawu/_FactoryFile')

xterm.stringPrototype()

const startAt = Date.now()
let ready = false

const _portTry = async val => await cli(`檢查 ${`${val}`.lightGray}`, async cli => {
  cli.cmdSubtitle('執行動作', `Listening port: ${val}`)
  const result = await tryFunc(Port(val))
  return T.err(result) ? result : val
})

const _port = async _port => {
  const val = _port.value

  const result = await _portTry(val)
  if (T.num(result)) {
    return result
  }

  const min = Math.min(Math.min(_port.min, val), _port.max)
  const max = Math.max(Math.max(_port.max, val), _port.min)

  for (let i = min; i <= max; i++) {
    if (i != val) {
      const result = await _portTry(i)
      if (T.num(result)) {
        return result
      }
    }
  }

  throw new Error('無法找到可用的 port')
}

const _baseUrl = async _ => await cli('取得基礎網址', async cli => {
  return `http://${Config.Server.server.domain}${Config.Server.server.port.value != 80 ? `:${Config.Server.server.port.value}` : ''}/`
})

const main = async _ => {
  process.on('SIGINT', async _ => await Sigint.execute())

  Print.cn()
  Print.ln(`\n${' § '.dim}${'啟動 Lalilo'.bold}`)

  Print.ln(`\n ${'【檢查環境】'.yellow}`)
  await Valid.path()
  await Valid.config()
  await Valid.sourceConfig()
  await Valid.serverConfig()

  Print.ln(`\n ${'【檢查 Server port】'.yellow}`)
  Config.Server.server.port.value = await _port(Config.Server.server.port)

  Print.ln(`\n ${'【檢查參數】'.yellow}`)
  await Valid.setConfig({ ...await Valid.argv('Development'), baseUrl: await _baseUrl() })

  Print.ln(`\n ${'【編譯檔案】'.yellow}`)
  await Valid.cssIconScss()

  await cli('監控自動重載檔案', async cli => {
    cli.cmdSubtitle('執行動作', 'Monitor auto reload files.')

    await new Promise((resolve, reject) => chokidar.watch(`${Config.Source.path}`, {
      persistent: true,
      depth: undefined,
      ignoreInitial: true,
    })
      .on('add', file => ready && Dispatch(file, factory => factory.create, 'add'))
      .on('change', file => ready && Dispatch(file, factory => factory.update, 'change'))
      .on('unlink', file => ready && Dispatch(file, factory => factory.remove, 'unlink'))
      .on('error', error => {
        if (!ready) { return reject(error) }
        throw error
      })
      .on('ready', resolve))

    // await new Promise(resolve => setTimeout(resolve, 0.5 * 1000))
  })

  Print.ln(`\n ${'【啟動 Server 伺服器】'.yellow}`)

  const server = await cli(`開啟 ${'http'.lightPurple} 伺服器`, async cli => {
    cli.cmdSubtitle('執行動作', `Start HTTP server, port: ${Config.Server.server.port.value}`)

    const Http = http.Server()
    Http.on('request', Response)
    await new Promise((resolve, reject) => {
      Http.on('error', reject)
      Http.listen(Config.Server.server.port.value, resolve)
    })

    return Http
  })

  await cli(`開啟 ${'WebSocket'.yellow} 伺服器`, async cli => {
    cli.cmdSubtitle('執行動作', 'Start WebSocket server.')

    const io = socketIo(server)

    FactoryFile.$on('reload', files => {
      if (!ready) {
        return null
      }

      const line = Display.Cyan('重新整理頁面')

      for (let { type, name } of files) {
        line.row(type, `${name}`.dim)
      }
      line.row('數量', `${io.sockets.sockets.size} 個頁面`.dim)
      line.go()

      io.sockets.emit('reload', true)
    })
  })

  Print.ln(`\n ${'【準備開發】'.yellow}`)
  Print.ln(`${' '.repeat(3)}🎉 Yes! 環境已經就緒惹！`)
  Print.ln(`${' '.repeat(3)}⏰ 啟動耗費時間${'：'.dim}${during(startAt).lightGray}`)
  Print.ln(`${' '.repeat(3)}🌏 Server 網址${'：'.dim}${Config.baseUrl.lightBlue.italic.underline}`)
  Print.ln(`${' '.repeat(3)}🚀 Go! Go! Go! 趕緊來開發囉！`)
  Print.ln(`\n ${'【開發紀錄】'.yellow}`)

  ready = true
}

main()
  .catch(async error => {
    await Valid.error(error)
    await Sigint.execute()
  })