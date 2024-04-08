/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

require('@oawu/xterm').stringPrototype()
require('@oawu/cli-progress').option.color = true

const Path = require('path')
const FileSystem = require('fs')

const Queue = require('@oawu/queue')
const cli   = require('@oawu/cli-progress')

const Helper = require('@oawu/_Helper')
const Valid = require('@oawu/_Valid')
const ArgV = require('@oawu/_ArgV')

const sigints = []
const startAt = Date.now()

Queue()
  .enqueue(next => {
    // 定義終止時
    process.on('SIGINT', _ => {
      for (const sigint of sigints) {
        try {
          typeof sigint == 'function' && sigint()
        } catch (_) {
          // 
        }
      }

      process.exit(1)
    })

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
      .enqueue((next, Config) => Valid.Source(next, Config, sigints))
      .enqueue(Valid.Build)
      .enqueue((_next, Config) => next(Config, _next()))
  })
  .enqueue((next, Config) => {
    Helper.Print.ln(`\n ${'【檢查參數】'.yellow}`)

    const env      = ArgV.env('Production')
    const baseUrl  = ArgV.buildUrl()
    const isMinify = ArgV.min()
    const isMerge  = ArgV.merge()
    const vals     = ArgV.vals()

    cli.title('配置設定檔')

    Object.defineProperty(Config, 'env', { get () { return env } })
    Object.defineProperty(Config, 'baseUrl', { get () { return baseUrl } })
    Object.defineProperty(Config, 'isMinify', { get () { return isMinify } })
    Object.defineProperty(Config, 'isMerge', { get () { return isMerge } })
    Object.defineProperty(Config, 'argVals', { get () { return vals } })

    cli.appendTitle(Helper.Display.cmd('baseUrl', Config.baseUrl))
    cli.appendTitle(Helper.Display.cmd('env', Config.env))
    cli.appendTitle(Helper.Display.cmd('merge', Config.isMerge ? 'yes' : 'no'))
    cli.appendTitle(Helper.Display.cmd('min', Config.isMinify ? 'yes' : 'no'))
    for (let {key, val} of Config.argVals) { cli.appendTitle(Helper.Display.cmd(key, val)) }
    cli.done()

    next(Config)
  })

  .enqueue((next, Config) => Valid._CssIconScss(next, Config))
  .enqueue((next, Config) => Valid._Build(next, Config))

  .enqueue((next, Config) => {
    Helper.Print.ln(`\n ${'【編譯完成】'.yellow}`)
    Helper.Print.ln(`${' '.repeat(3)}🎉 太棒惹，已經完成編譯囉，趕緊去看一下的吧！`)
    Helper.Print.ln(`${' '.repeat(3)}⏰ 編譯耗費時間${'：'.dim}${Helper.Display.during(startAt).lightGray}`)
    Helper.Print.ln(`${' '.repeat(3)}🚀 編譯完後的目錄在專案下的${'：'.dim}${Helper.Fs.dirOrEmpty(Path.$.rRoot(Config.Build.path)).lightGray}`)
    Helper.Print.ln(``)

    if (Config.Build.autoOpenFolder) {
      try {
        let open = require('open')
        if (typeof open == 'function') {
          open(Config.Build.path)
        }
      } catch (_) {
        // 
      }
    }
  })
