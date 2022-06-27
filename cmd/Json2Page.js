const Path = require('path')
const FileSystem = require('fs')

const { argv, println } = require('@oawu/helper')
const Config = require('./config/Serve.js')

const dirEntry = argv(['-E', '--entry'])
const jsonFile = argv(['-F', '--file'])
const dirPage = dirEntry + (Config.dir.html !== '' ? Config.dir.html + Path.sep : '')

const errorHandler = error => {
  println(error instanceof Error ? error.message : error)
  process.exit(1)
}

const json = require(jsonFile)

const lines = []
lines.push("<?php")
lines.push("")
lines.push("/**")
lines.push(" * @author      OA Wu <oawu.tw@gmail.com>")
lines.push(" * @copyright   Copyright (c) 2015 - 2022, LaliloCore")
lines.push(" * @license     http://opensource.org/licenses/MIT  MIT License")
lines.push(" * @link        https://www.ioa.tw/")
lines.push(" */")
lines.push("")
lines.push("namespace HTML;")
lines.push("")
lines.push("echo html(")
lines.push("  head(")
lines.push("    meta()->attr('http-equiv', 'Content-Language')->content('zh-tw'),")
lines.push("    meta()->attr('http-equiv', 'Content-type')->content('text/html; charset=utf-8'),")
lines.push("    meta()->name('viewport')->content('width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,minimal-ui'),")
lines.push("")
lines.push("    title(TITLE),")
lines.push("")
lines.push("    asset()")
lines.push("  ),")
lines.push("  body()")
lines.push(")->lang('zh-Hant');")

FileSystem.writeFile(dirPage + json.key + '.php', lines.join("\n"), { encoding: 'utf8' }, error => {

})

console.error(dirPage);







// // const Queue = require('@oawu/queue')



// const dirEntry = argv(['-E', '--entry'])
// const dirPage = dirEntry + (Config.dir.html !== '' ? Config.dir.html + Path.sep : '')

// console.error(dirPage);


















// // const Path = require('path')
// // const FileSystem = require('fs')

// // const { argv, println, scanDir } = require('@oawu/helper')

// // const dirEntry = argv(['-E', '--entry'])
// // const dirSrc = dirEntry + (Config.dir.html !== '' ? Config.dir.html + Path.sep : '')

// // Promise.all(scanDir(dirSrc).filter(file => ['.html', '.php'].includes(Path.extname(file))).map(file => new Promise((resolve, reject) => FileSystem.unlink(file, error => error ? reject(error) : resolve))))
// //   .then(_ => process.exit(0))
// //   .catch(error => {
// //     println(error.message)
// //     process.exit(1)
// //   })


// // setTimeout(_ => {
  
  
// // }, 1000)
// // process.stdout.write('' + 'text' + "\n")

// // const { argv, println } = require('@oawu/helper')
// // const file = argv(['-F', '--file'])
// // const json = require(file)

// // const FileSystem = require('fs')
// // const Path = require('path')

// // const root = Path.resolve(__dirname, ('..' + Path.sep).repeat(1)) + Path.sep
// // const src = root + 'src' + Path.sep
// // const page = src + 'page' + Path.sep

// // FileSystem.writeFile(page + json.key + '.html', '123aaa', { encoding: 'utf8' }, error => {

// // })

// // process.exit(0)