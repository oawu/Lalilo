/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

require('@oawu/xterm').stringPrototype()
require('@oawu/cli-progress').option.color = true

const Path       = require('path')
const FileSystem = require('fs')

const Queue      = require('@oawu/queue')
const cli        = require('@oawu/cli-progress')

const Helper     = require('@oawu/_Helper')
const Valid      = require('@oawu/_Valid')
const ArgV       = require('@oawu/_ArgV')
const Sigint     = require('@oawu/_Sigint')

const startAt    = Date.now()
let ready        = false

Queue()
  .enqueue(next => {
    // 定義終止時
    process.on('SIGINT', _ => Sigint.run())

    // 顯示主要大標題
    Helper.Print.cn()
    Helper.Print.ln(`\n${' § '.dim}${'啟動 Lalilo'.bold}`)

    next()
  })
  
  .enqueue(next => {
    const CmdExists = require('command-exists').sync

    Helper.Print.ln(`\n ${'【檢查環境】'.yellow}`)

    Queue()
      .enqueue(Valid.Path)
      .enqueue(Valid.Config)
      .enqueue((next, Config) => Valid.Source(next, Config))
      .enqueue(Valid.Serve)
      .enqueue((_next, Config) => next(Config, _next()))
  })

  .enqueue((next, Config) => {
    const Port = require('@oawu/_Port')
    
    Helper.Print.ln(`\n ${'【檢查 Server port】'.yellow}`)

    Queue()
      .enqueue(_next => {

        cli.title(`檢查 ${`${Config.Serve.server.port.default}`.lightGray}`, Helper.Display.cmd('執行動作', `Listening port: ${Config.Serve.server.port.default}`))
        
        Port.status(Config.Serve.server.port.default, error => {
          if (error) {
            return _next(false, cli.fail('失敗'))
          }
          Config.Serve.server.port.value = Config.Serve.server.port.default
          _next(true, cli.done())
        })
      })

      .enqueue((_next, result) => {
        if (result) {
          return _next()
        }

        Port.scan(Config.Serve.server.port.min, Config.Serve.server.port.min, Config.Serve.server.port.max, port => cli.title(`檢查 ${`${port}`.lightGray}`, Helper.Display.cmd('執行動作', `Listening port: ${port}`)), (error, port, result) => {
          if (error) {
            return cli.fail('已被使用', error)
          }

          if (!result) {
            return cli.fail('已被使用')
          }

          Config.Serve.server.port.value = port
          _next(cli.done())
        })
      })
      .enqueue(_next => {
        next(Config, _next())
      })

  })
  .enqueue((next, Config) => {

    Helper.Print.ln(`\n ${'【檢查參數】'.yellow}`)

    const env = ArgV.env('Development')
    const baseUrl = `http://${Config.Serve.server.domain}${Config.Serve.server.port.value != 80 ? `:${Config.Serve.server.port.value}` : ''}/`
    const isMerge = ArgV.merge()
    const vals = ArgV.vals()

    cli.title('配置設定檔')

    Object.defineProperty(Config, 'env', { get () { return env } })
    Object.defineProperty(Config, 'baseUrl', { get () { return baseUrl } })
    Object.defineProperty(Config, 'isMerge', { get () { return isMerge } })
    Object.defineProperty(Config, 'argVals', { get () { return vals } })

    cli.appendTitle(Helper.Display.cmd('baseUrl', Config.baseUrl))
    cli.appendTitle(Helper.Display.cmd('env', Config.env))
    cli.appendTitle(Helper.Display.cmd('merge', Config.isMerge ? 'yes' : 'no'))
    for (let {key, val} of Config.argVals) { cli.appendTitle(Helper.Display.cmd(key, val)) }
    cli.done()

    next(Config)
  })

  .enqueue((next, Config) => Valid._CssIconScss(next, Config))

  .enqueue((next, Config) => {
    cli.title('監控自動重載檔案')
    cli.appendTitle(Helper.Display.cmd('執行動作', 'Monitor auto reload files.'))

    const Dispatch = require('@oawu/_FactoryDispatch')

    require('chokidar')
      .watch(`${Config.Source.path}**${Path.sep}*`)
      .on('add',    file => ready && Dispatch(file, factory => factory.create))
      .on('change', file => ready && Dispatch(file, factory => factory.update))
      .on('unlink', file => ready && Dispatch(file, factory => factory.remove))
      .on('error', error => ready
        ? cli.title('監聽 FILE 檔案時發生錯誤！').fail(null, error)
        : cli.fail(null, error))
      .on('ready', _ => next(Config, cli.done()))
  })
  .enqueue((next, Config) => {
    Helper.Print.ln(`\n ${'【啟動 Server 伺服器】'.yellow}`)

    Queue()
      .enqueue(_next => {
        cli.title(`開啟 ${'http'.lightPurple} 伺服器`, Helper.Display.cmd('執行動作', `Start HTTP server, port: ${Config.Serve.server.port.value}`))

        const Response = require('@oawu/_Response')
        const Http = require('http').Server()

        Http.on('error', error => cli.fail(null, error))
        Http.listen(Config.Serve.server.port.value, _ => _next(Http, cli.done()))
        Http.on('request', Response)
      })
      .enqueue((_next, Http) => {
        cli.title(`開啟 ${'WebSocket'.yellow} 伺服器`, Helper.Display.cmd('執行動作', 'Start WebSocket server.'))
        const SocketIO = require('socket.io')(Http)

        require('@oawu/_FactoryFile').$on('reload', files => {
          if (!ready) {
            return null
          }

          const line = Helper.Display.LineCyan('重新整理頁面')
          for (let { type, name } of files) {
            line.row(type, `${name}`.dim)
          }
          line.row('數量', `${SocketIO.sockets.sockets.size} 個頁面`.dim)
          line.go()

          SocketIO.sockets.emit('reload', true)
        })

        next(Config, cli.done(), _next())
      })
  })
  .enqueue((next, Config) => {
    Helper.Print.ln(`\n ${'【準備開發】'.yellow}`)
    Helper.Print.ln(`${' '.repeat(3)}🎉 Yes! 環境已經就緒惹！`)
    Helper.Print.ln(`${' '.repeat(3)}⏰ 啟動耗費時間${'：'.dim}${Helper.Display.during(startAt).lightGray}`)
    Helper.Print.ln(`${' '.repeat(3)}🌏 Server 網址${'：'.dim}${Config.baseUrl.lightBlue.italic.underline}`)
    Helper.Print.ln(`${' '.repeat(3)}🚀 Go! Go! Go! 趕緊來開發囉！`)
    Helper.Print.ln(`\n ${'【開發紀錄】'.yellow}`)

    if (Config.Serve.autoOpenBrowser) {
      try {
        let open = require('open')
        if (typeof open == 'function') {
          open(url)
        }
      } catch (_) {
        // 
      }
    }

    ready = true
    next(Config)
  })
