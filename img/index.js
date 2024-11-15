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


const Print = {
  cn: _    => process.stdout.write("\x1b[2J\x1b[0f"),
  ln: text => process.stdout.write(`${text}\n`), 
}

Queue()
  .enqueue(next => {

    // 顯示主要大標題
    Print.cn()
    Print.ln(`\n${' § '.dim}${'啟動 Lalilo'.bold}`)

    Path.$ = {
      root: `${Path.resolve(__dirname, ('..' + Path.sep).repeat(0))}${Path.sep}`,
    }

    Print.ln(`\n ${'【檢查 AWS S3 配置】'.yellow}`)
    cli.title('檢查配置')
    
    let Config = null
    try {
      Config = require('./Config.json')
    } catch (e) {
      cli.fail('失敗', e)
    }
    cli.done()

    const path = `${Path.$.root}S3${Path.sep}`

    require('@oawu/uploader').S3({
      bucket:      Config.bucket,
      access:      Config.access,
      secret:      Config.secret,
      region:      Config.region,
      destDir:     path,
      isDisplay:   true,
      prefix:      Config.prefix,
      ignoreNames: Config.ignoreNames,
      ignoreExts:  Config.ignoreExts,
      ignoreDirs:  [],
      option:      { ACL: 'public-read' },
    }).put(error => {
      error ? errorLog(error) : next(Config)
    })

  })
  .enqueue(next => {
    Print.ln("\n " + '【部署完成】'.yellow)
    Print.ln(`${' '.repeat(3)}🎉 太棒惹，已經完成部署囉，趕緊去看最新版的吧！`)
    Print.ln(`${' '.repeat(3)}❗️ 若有設定 CDN 快取的話，請等 Timeout 後再試。`)
    Print.ln('')
    next()
  })
