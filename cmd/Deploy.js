/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const xterm = require('@oawu/xterm')
const { Print, Sigint, Type: T, Argv } = require('@oawu/helper')
const Valid = require('@oawu/_Valid')
const { cli, during } = require('@oawu/_Helper')
const Config = require('@oawu/_Config')
const Uploader = require('@oawu/uploader')

xterm.stringPrototype()
const startAt = Date.now()

const _baseUrl = async goal => await cli('判斷基本網址', async cli => {
  cli.cmdSubtitle('取得參數', '-U 或 --url')
  const argvs = Argv.dash()

  let urls = [
    ...(T.arr(argvs['-U']) ? argvs['-U'] : []),
    ...(T.arr(argvs['--url']) ? argvs['--url'] : []),
  ].reduce((a, b) => a.includes(b) ? a : a.concat(b), [])

  if (goal.type == 'github' && T.neStr(goal.account) && T.neStr(goal.repository)) {
    urls.unshift(`https://${goal.account}.github.io/${goal.repository}/`)
  }

  urls = urls.filter(url => T.neStr(url) && (url === '/' || /(http(s?)):\/\//i.test(url))).map(url => url === '' ? url : `${url.replace(/\/*$/, '')}/`)
  urls.unshift('')

  let baseUrl = urls.pop()
  if (!T.neStr(baseUrl)) {
    throw new Error('請給予網址，請使用參數 -U 或 --url 來設定網址。')
  }

  return baseUrl
})

const main = async _ => {
  process.on('SIGINT', async _ => await Sigint.execute())

  Print.cn()
  Print.ln(`\n${' § '.dim}${'啟動 Lalilo'.bold}`)

  Print.ln(`\n ${'【檢查環境】'.yellow}`)
  await Valid.path()
  await Valid.config()
  await Valid.sourceConfig()
  await Valid.buildConfig()
  await Valid.deployConfig()

  Print.ln(`\n ${'【檢查檔案】'.yellow}`)
  await Valid.file()

  Print.ln(`\n ${'【檢查參數】'.yellow}`)
  const goal = await Valid.goal()
  await Valid.setConfig({ ...await Valid.argv('Production'), baseUrl: await _baseUrl(goal), goal })

  Print.ln(`\n ${'【編譯檔案】'.yellow}`)
  await Valid.cssIconScss()

  Print.ln(`\n ${'【編譯並輸出目錄】'.yellow}`)
  await Valid.build()

  if (Config.goal.type == 's3') {
    Print.ln(`\n ${'【部署至 AWS S3】'.yellow}`)
    await Uploader.S3(Config.Build.path, {
      bucket: Config.goal.bucket,
      access: Config.goal.access,
      secret: Config.goal.secret,
      region: Config.goal.region,

      prefix: Config.Deploy.s3.prefix,

      ignoreNames: Config.Deploy.s3.ignoreNames,
      ignoreExts: Config.Deploy.s3.ignoreExts,
      ignoreDirs: Config.Deploy.s3.ignoreDirs,
      option: Config.Deploy.s3.putOptions,
    }).execute(cli)
  }

  if (Config.goal.type == 'github') {
    Print.ln(`\n ${'【部署至 Github Page】'.yellow}`)
    await Uploader.GitHub(Config.Build.path, {
      account: Config.goal.account,
      repository: Config.goal.repository,
      branch: Config.goal.branch,
      message: Config.goal.message,

      prefix: Config.Deploy.github.prefix,

      ignoreNames: Config.Deploy.github.ignoreNames,
      ignoreExts: Config.Deploy.github.ignoreExts,
      ignoreDirs: Config.Deploy.github.ignoreDirs,
    }).execute(cli)
  }

  Print.ln("\n " + '【部署完成】'.yellow)
  Print.ln(`${' '.repeat(3)}🎉 太棒惹，已經完成部署囉，趕緊去看最新版的吧！`)
  Print.ln(`${' '.repeat(3)}❗️ 若有設定 CDN 快取的話，請等 Timeout 後再試。`)
  Print.ln(`${' '.repeat(3)}⏰ 部署耗費時間${'：'.dim}${during(startAt).lightGray}`)
  Print.ln(`${' '.repeat(3)}🌏 這是您的網址${'：'.dim}${Config.baseUrl.lightBlue.italic.underline}`)
  Print.ln('')
}

main()
  .catch(Valid.error)
  .finally(async _ => await Sigint.execute())