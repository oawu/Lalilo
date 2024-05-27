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

const startAt    = Date.now()

const errorLog = error => {
  Helper.Print.ln(`${"\n 【錯誤訊息】\n".red}${' '.repeat(3)}${'◉'.red} ${error instanceof Error ? error.stack : error}`)
  process.emit('SIGINT')
}

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
      .enqueue(Valid.Build)
      .enqueue(Valid.Deploy)
      .enqueue((_next, Config) => next(Config, _next()))
  })
  .enqueue((next, Config) => {
    Helper.Print.ln(`\n ${'【檢查參數】'.yellow}`)

    const goal      = ArgV.goal(Config, ['s3', 'gh', 'github', 'gh-pages'])
    const baseUrl   = ArgV.deployUrl(goal)
    const env       = ArgV.env('Production')
    const isMinify  = ArgV.min()
    const isMerge   = ArgV.merge()
    const vals      = ArgV.vals()

    cli.title('配置設定檔')

    Object.defineProperty(Config, 'goal', { get () { return goal } })
    Object.defineProperty(Config, 'env', { get () { return env } })
    Object.defineProperty(Config, 'baseUrl', { get () { return baseUrl } })
    Object.defineProperty(Config, 'isMinify', { get () { return isMinify } })
    Object.defineProperty(Config, 'isMerge', { get () { return isMerge } })
    Object.defineProperty(Config, 'argVals', { get () { return vals } })

    cli.appendTitle(Helper.Display.cmd('goal', Config.goal.type))
    cli.appendTitle(Helper.Display.cmd('baseUrl', Config.baseUrl))
    cli.appendTitle(Helper.Display.cmd('env', Config.env))
    cli.appendTitle(Helper.Display.cmd('minify', Config.isMinify ? 'yes' : 'no'))
    cli.appendTitle(Helper.Display.cmd('merge', Config.isMerge ? 'yes' : 'no'))
    for (let {key, val} of Config.argVals) { cli.appendTitle(Helper.Display.cmd(key, val)) }
    cli.done()

    next(Config)
  })

  .enqueue((next, Config) => Valid._CssIconScss(next, Config))
  .enqueue((next, Config) => Valid._Build(next, Config))

  .enqueue((next, Config) => {
    if (Config.goal.type != 'github') {
      return next(Config)
    }

    Helper.Print.ln(`\n ${'【檢查 Github 配置】'.yellow}`)
    cli.title('檢查配置')

    if (!Helper.Type.isNotEmptyString(Config.goal.account)) {
      return cli.fail('錯誤', `部署至 GitHub 需給予 ${'--gh-account'.lightGray} 參數`)
    }
    if (!Helper.Type.isNotEmptyString(Config.goal.repository)) {
      return cli.fail('錯誤', `部署至 GitHub 需給予 ${'--gh-repository'.lightGray} 參數`)
    }

    cli.done()

    require('@oawu/uploader').GitHub({
      account:     Config.goal.account,
      repository:  Config.goal.repository,
      branch:      Config.goal.branch,
      message:     Config.goal.message,
      destDir:     Config.Build.path,
      isDisplay:   true,
      prefix:      Config.Deploy.github.prefix,
      ignoreNames: Config.Deploy.github.ignoreNames,
      ignoreExts:  Config.Deploy.github.ignoreExts,
      ignoreDirs:  Config.Deploy.github.ignoreDirs,
    }).put(error => error ? errorLog(error) : next(Config))
  })
  .enqueue((next, Config) => {
    if (Config.goal.type != 's3') {
      return next(Config)
    }

    Helper.Print.ln(`\n ${'【檢查 AWS S3 配置】'.yellow}`)
    cli.title('檢查配置')

    if (!Helper.Type.isNotEmptyString(Config.goal.bucket)) {
      return cli.fail('錯誤', `部署至 AWS S3 需給予 ${'--s3-bucket'.lightGray} 參數`)
    }
    if (!Helper.Type.isNotEmptyString(Config.goal.access)) {
      return cli.fail('錯誤', `部署至 AWS S3 需給予 ${'--s3-access'.lightGray} 參數`)
    }
    if (!Helper.Type.isNotEmptyString(Config.goal.secret)) {
      return cli.fail('錯誤', `部署至 AWS S3 需給予 ${'--s3-secret'.lightGray} 參數`)
    }
    if (!Helper.Type.isNotEmptyString(Config.goal.region)) {
      return cli.fail('錯誤', `部署至 AWS S3 需給予 ${'--s3-region'.lightGray} 參數`)
    }

    cli.done()

    require('@oawu/uploader').S3({
      bucket:      Config.goal.bucket,
      access:      Config.goal.access,
      secret:      Config.goal.secret,
      region:      Config.goal.region,
      destDir:     Config.Build.path,
      isDisplay:   true,
      prefix:      Config.Deploy.s3.prefix,
      ignoreNames: Config.Deploy.s3.ignoreNames,
      ignoreExts:  Config.Deploy.s3.ignoreExts,
      ignoreDirs:  Config.Deploy.s3.ignoreDirs,
      option:      Config.Deploy.s3.putOptions,
    }).put(error => error ? errorLog(error) : next(Config))
  })
  .enqueue((next, Config) => {
    Helper.Print.ln("\n " + '【部署完成】'.yellow)
    Helper.Print.ln(`${' '.repeat(3)}🎉 太棒惹，已經完成部署囉，趕緊去看最新版的吧！`)
    Helper.Print.ln(`${' '.repeat(3)}❗️ 若有設定 CDN 快取的話，請等 Timeout 後再試。`)
    Helper.Print.ln(`${' '.repeat(3)}⏰ 部署耗費時間${'：'.dim}${Helper.Display.during(startAt).lightGray}`)
    Helper.Print.ln(`${' '.repeat(3)}🌏 這是您的網址${'：'.dim}${Config.baseUrl.lightBlue.italic.underline}`)
    Helper.Print.ln('')
    next()
  })
  .enqueue(next => {
    next()
    Sigint.run()
  })
