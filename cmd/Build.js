/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Path = require('path')

const xterm = require('@oawu/xterm')
const { Print, Sigint, Type: T, Argv } = require('@oawu/helper')
const { cli, during } = require('@oawu/_Helper')
const Valid = require('@oawu/_Valid')
const Config = require('@oawu/_Config')

xterm.stringPrototype()

const startAt = Date.now()

const _baseUrl = async _ => await cli('判斷基本網址', async cli => {
  cli.cmdSubtitle('取得參數', '-U 或 --url')

  const argvs = Argv.dash()

  const urls = [
    ...(T.arr(argvs['-U']) ? argvs['-U'] : []),
    ...(T.arr(argvs['--url']) ? argvs['--url'] : []),
  ].reduce((a, b) => a.includes(b) ? a : a.concat(b), [])
    .filter(url => T.neStr(url) && (url === '/' || /(http(s?)):\/\//i.test(url)))
    .map(url => url === '' ? url : `${url.replace(/\/*$/, '')}/`)

  urls.unshift('')
  return urls.pop()
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

  Print.ln(`\n ${'【檢查參數】'.yellow}`)
  await Valid.setConfig({ ...await Valid.argv('Production'), baseUrl: await _baseUrl() })

  Print.ln(`\n ${'【編譯檔案】'.yellow}`)
  await Valid.cssIconScss()

  Print.ln(`\n ${'【編譯並輸出目錄】'.yellow}`)
  await Valid.build()


  Print.ln(`\n ${'【編譯完成】'.yellow}`)
  Print.ln(`${' '.repeat(3)}🎉 太棒惹，已經完成編譯囉，趕緊去看一下的吧！`)
  Print.ln(`${' '.repeat(3)}⏰ 編譯耗費時間${'：'.dim}${during(startAt).lightGray}`)
  Print.ln(`${' '.repeat(3)}🚀 編譯完後的目錄在專案下的${'：'.dim}${Path.$.rRoot(Config.Build.path, true).lightGray}`)
  Print.ln('')
}

main()
  .catch(Valid.error)
  .finally(async _ => await Sigint.execute())