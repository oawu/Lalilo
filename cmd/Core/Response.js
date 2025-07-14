/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const fs = require('fs/promises')
const URL = require('url')
const Path = require('path')
const mime = require('mime-types')
const crypto = require('crypto')
const Handlebars = require('handlebars')

const { tryFunc, Type: T } = require('@oawu/helper')

const Config = require('@oawu/_Config')
const { Exist, fileExt, execModel } = require('@oawu/_Helper')
const Display = require('@oawu/_Display')

const _main = 'index'

const HtmlModelPath = function (html, model) {
  if (!(this instanceof HtmlModelPath)) {
    return new HtmlModelPath(html, model)
  }
  this._html = html
  this._model = model
}
Object.defineProperty(HtmlModelPath.prototype, 'html', { get() { return this._html } })
Object.defineProperty(HtmlModelPath.prototype, 'model', { get() { return this._model } })

const _output = (response, status = 200, contentType = 'text/html; charset=UTF-8', html = '') => {
  response.writeHead(status, { 'Content-Type': contentType })
  response.write(html)
  response.end()
}

const _header = title => [
  '<!DOCTYPE html>',
  '<html lang="zh-Hant">',
  '<head>',
  '<meta http-equiv="Content-Language" content="zh-tw">',
  '<meta http-equiv="Content-type" content="text/html; charset=utf-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,minimal-ui">',
  '<meta name="robots" content="noindex,nofollow,noarchive">',
  '<meta name="googlebot" content="noindex,nofollow,noarchive">',
  `<title>${title} | Lalilo</title>`,
  '<link href="https://fonts.googleapis.com/css?family=Comfortaa:400,300,700" rel="stylesheet" type="text/css">',
  '<link href="https://cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/hack.css" rel="stylesheet">',
  '<style type="text/css">',
  '@charset "UTF-8";', 'a,span,p,h1{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}', '*,*:after,*:before{vertical-align:middle;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;-webkit-font-smoothing:subpixel-antialiased;-moz-font-smoothing:subpixel-antialiased;-ms-font-smoothing:subpixel-antialiased;-o-font-smoothing:subpixel-antialiased;font-smoothing:subpixel-antialiased}', 'div,article,h1,body,html{position:relative}', 'div:before,article:before,article:after{position:absolute}', 'i,a,span,h1,body,html{display:inline-block}', 'p,body,html{margin:0}', 'body,html{padding:0}', 'footer,div,h1,body{width:100%}', 'div:before,article:before,article:after{top:0;left:0}', 'footer,div,article{display:inline-flex;align-items:center}', 'article{flex-direction:column}', 'footer,div{flex-direction:row}', 'body{font-size:medium;text-align:center;font-family:Comfortaa;color:#f8f8f2;background-color:#373832}', 'h1{color:#d7d7d7;font-size:56px;font-family:Comfortaa;text-shadow:1px 1px 10px #0b0b0b}', 'p{color:#7f7f7f}', 'article{justify-content:flex-start;width:calc(100% - 16px);max-width:640px;text-align:left;padding:12px 8px;padding-left:0;margin:0 8px;margin-top:20px;background-color:#282923;overflow:hidden;overflow-x:auto;-webkit-border-radius:3px;-moz-border-radius:3px;-ms-border-radius:3px;-o-border-radius:3px;border-radius:3px;-webkit-box-shadow:inset 1px 1px 2px #1f1f1f,1px 1px 1px #454545;-moz-box-shadow:inset 1px 1px 2px #1f1f1f,1px 1px 1px #454545;box-shadow:inset 1px 1px 2px #1f1f1f,1px 1px 1px #454545}', 'article:after{bottom:0;display:inline-block;width:1px;background-color:#232323;content:""}', 'article:before{content:"";height:100%;width:36px;background-color:#282923;-webkit-box-shadow:0 0 5px #1f1f1f,0 0 1px #000;-moz-box-shadow:0 0 5px #1f1f1f,0 0 1px #000;box-shadow:0 0 5px #1f1f1f,0 0 1px #000}', 'div{justify-content:flex-start;height:22px;line-height:22px;padding:0;padding-left:48px;color:#f8f8f2;font-family:Hack,Comfortaa}', 'div:before{width:36px;color:#90918b;font-size:13px;font-weight:100;text-align:center}', 'div:nth-child(1):before{content:"01"}', 'div:nth-child(2):before{content:"02"}', 'div:nth-child(3):before{content:"03"}', 'div:nth-child(4):before{content:"04"}', 'div:nth-child(5):before{content:"05"}', 'div:nth-child(6):before{content:"06"}', 'div:nth-child(7):before{content:"07"}', 'div:nth-child(8):before{content:"08"}', 'div:nth-child(9):before{content:"09"}', 'div:nth-child(10):before{content:"10"}', 'div:nth-child(11):before{content:"11"}', 'div:nth-child(12):before{content:"12"}', 'div:nth-child(13):before{content:"13"}', 'div:nth-child(14):before{content:"14"}', 'div:nth-child(15):before{content:"15"}', 'div:nth-child(16):before{content:"16"}', 'div:nth-child(17):before{content:"17"}', 'div:nth-child(18):before{content:"18"}', 'div:nth-child(19):before{content:"19"}', 'div:nth-child(20):before{content:"20"}', 'span{flex-shrink:0}', '.p{color:#b07dff}', '.b{color:#61d8f1}', '.y{color:#d3c964}', '.r{color:#ee1b6b}', '.i{padding-left:16px}', '.s{filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=0);opacity:0}', 'footer{justify-content:center;margin-top:16px;margin-bottom:16px}', 'a{flex-shrink:0;text-decoration:none;font-family:Comfortaa;font-size:13px;padding:6px 8px;color:#7e807c;cursor:pointer;-webkit-transition:background-color .3s,color .3s;-moz-transition:background-color .3s,color .3s;-o-transition:background-color .3s,color .3s;transition:background-color .3s,color .3s;-webkit-border-radius:5px;-moz-border-radius:5px;-ms-border-radius:5px;-o-border-radius:5px;border-radius:5px}', 'a:hover{color:#d1d1d1;background-color:#555}', 'a:active{color:#d1d1d1;background-color:#444}', 'i{width:1px;height:16px;background-color:#636363;margin-left:8px;margin-right:8px}',
  '</style>',
  '</head>',
  '<body>']
const _footer = [
  '<footer>',
  '<a href="https://www.ioa.tw/" target="blank">OA</a>',
  '<i></i>',
  '<a href="https://github.com/oawu/" target="blank">GitHub</a>',
  '</footer>',
  '</body>']

const _outputError = (response, message) => _output(response, 500, 'text/html; charset=UTF-8', [
  ..._header('Error!'),
  ...['<h1>GG . 惹</h1>', '<p>糟糕，' + message + '</p>'],
  ..._footer].join(''))

const _output404 = response => _output(response, 404, 'text/html; charset=UTF-8', [
  ..._header('404 Not Found'),
  ...['<h1>肆 . 零 . 肆</h1>', '<p>糟糕，是 404 not found！</p>', '<article>', '<div><span class="r">html</span><span class="s">_</span><span>{</span></div>', '<div><span class="b i">position</span><span>:</span><span class="s">_</span><span class="b">fixed</span><span>;</span></div>', '<div><span class="b i">top</span><span>:</span><span class="s">_</span><span class="p">-99999</span><span class="r">px</span><span>;</span></div>', '<div><span class="b i">left</span><span>:</span><span class="s">_</span><span class="p">-99999</span><span class="r">px</span><span>;</span></div>', '<div></div>', '<div><span class="b i">z-index</span><span>:</span><span class="s">_</span><span class="p">-99999</span><span>;</span></div>', '<div></div>', '<div><span class="b i">display</span><span>:</span><span class="s">_</span><span class="b">null</span><span>;</span></div>', '<div><span class="b i">width</span><span>:</span><span class="s">_</span><span class="p">0</span><span>;</span></div>', '<div><span class="b i">height</span><span>:</span><span class="s">_</span><span class="p">0</span><span>;</span></div>', '<div></div>', '<div><span class="b i">filter</span><span>:</span><span class="s">_</span><span class="b">progid:DXImageTransform.Microsoft.Alpha</span><span>(Opacity=0);</span></div>', '<div><span class="b i">opacity</span><span>:</span><span class="s">_</span><span class="p">0</span><span>;</span></div>', '<div></div>', '<div><span class="b i">-webkit-transform</span><span>:</span><span class="s">_</span><span class="b">scale</span><span>(</span><span class="p">0</span><span>,</span><span class="s">_</span><span class="p">0</span><span>);</span></div>', '<div><span class="s i">_</span><span class="s">_</span><span class="s">_</span><span class="b">-moz-transform</span><span>:</span><span class="s">_</span><span class="b">scale</span><span>(</span><span class="p">0</span><span>,</span><span class="s">_</span><span class="p">0</span><span>);</span></div>', '<div><span class="s i">_</span><span class="s">_</span><span class="s">_</span><span class="s">_</span><span class="b">-ms-transform</span><span>:</span><span class="s">_</span><span class="b">scale</span><span>(</span><span class="p">0</span><span>,</span><span class="s">_</span><span class="p">0</span><span>);</span></div>', '<div><span class="s i">_</span><span class="s">_</span><span class="s">_</span><span class="s">_</span><span class="s">_</span><span class="b">-o-transform</span><span>:</span><span class="s">_</span><span class="b">scale</span><span>(</span><span class="p">0</span><span>,</span><span class="s">_</span><span class="p">0</span><span>);</span></div>', '<div><span class="s i">_</span><span class="s">_</span><span class="s">_</span><span class="s">_</span><span class="s">_</span><span class="s">_</span><span class="s">_</span><span class="s">_</span><span class="b">transform</span><span>:</span><span class="s">_</span><span class="b">scale</span><span>(</span><span class="p">0</span><span>,</span><span class="s">_</span><span class="p">0</span><span>);</span></div>', '<div><span>}</span></div>', '</article>'],
  ..._footer].join(''))

const _appendWebSocket = data => {
  const script = '<script src="/socket.io/socket.io.js"></script><script type="text/javascript">io && io.connect().on("reload", function(data) { location.reload(data); });</script>'
  data = data.split('</head>')
  if (data.length < 2) {
    return data.join('</head>') + script
  }
  return [data.shift(), script, '</head>', data.join('</head>')].join('')
}

const _outputModel = async (response, path, html) => {
  if (T.err(await tryFunc(Exist.file(`${path}`, fs.constants.R_OK)))) {
    return _output(response, 200, 'text/html; charset=UTF-8', _appendWebSocket(html))
  }

  const model = await tryFunc(fs.readFile(path, { encoding: 'utf8' }))
  if (T.err(model)) {
    Display.Red('讀取 Model 失敗')
      .row('目錄', `${Path.$.rRoot(path)}`)
      .row('原因', model.message)
      .go()
    return _output(response, 200, 'text/html; charset=UTF-8', _appendWebSocket(html))
  }

  const md5 = crypto.createHash('md5').update(model).digest('hex')
  const tmpPath = `${Config.Source.modelTmpDir}${md5}.js`

  let i = 0
  while (true) {

    const copy = await tryFunc(fs.copyFile(path, tmpPath))

    if (!T.err(copy)) {
      break
    }

    if (++i >= 10) {
      Display.Red('無法複製 Model')
        .row('檔案', `${Path.$.rRoot(path)}`)
        .row('原因', copy.message)
        .go()

      return _output(response, 200, 'text/html; charset=UTF-8', _appendWebSocket(html))
    }

    await new Promise(resolve => setTimeout(resolve, 100))
  }

  const obj = await tryFunc(require(tmpPath))
  await tryFunc(fs.unlink(tmpPath))

  if (T.err(obj)) {
    Display.Red('執行 Model 錯誤')
      .row('檔案', `${Path.$.rRoot(path)}`)
      .row('原因', obj.message)
      .go()

    return _output(response, 200, 'text/html; charset=UTF-8', _appendWebSocket(html))
  }
  const tmp = await execModel(obj)
  const template = Handlebars.compile(html)
  return _output(response, 200, 'text/html; charset=UTF-8', _appendWebSocket(template(tmp)))
}

const _readHtml = async (response, htmlModel) => {

  const html = await tryFunc(fs.readFile(htmlModel.html, { encoding: 'utf8' }))
  if (T.err(html)) {
    return _outputError(response, '無法讀取檔案！')
  }
  if (!htmlModel.model) {
    return _output(response, 200, 'text/html; charset=UTF-8', _appendWebSocket(html))
  }
  await _outputModel(response, htmlModel.model, html)
}

const _readFile = async (response, path, extension) => {
  const isUtf8 = Config.Server.server.utf8Exts.includes(extension)
  const data = await tryFunc(fs.readFile(path, isUtf8 ? { encoding: 'utf8' } : {}))
  if (T.err(data)) {
    return _outputError(response, '無法讀取檔案！')
  }

  const contentType = mime.lookup(path) + (isUtf8 ? '; charset=UTF-8' : '')
  return _output(response, 200, contentType, data)
}

module.exports = async (request, response) => {
  const pathname = URL.parse(request.url).pathname.replace(/\/+/gm, '/').replace(/\/$|^\//gm, '')
  const extension = fileExt(pathname)
  const dirs = pathname.split('/').filter(t => t !== '')

  // http://127.0.0.1/
  if (dirs.length == 0) {
    const path = HtmlModelPath(
      `${Config.Source.dir.html}${_main}.html`,
      `${Config.Source.dir.model}${_main}.js`)

    if (!T.err(await tryFunc(Exist.file(path.html, fs.constants.R_OK)))) {
      return await _readHtml(response, path)
    }

    return _output404(response)
  }

  // http://127.0.0.1/a/b.html
  if (extension === '.html') {
    const name = dirs.pop()

    const path = HtmlModelPath(
      `${Config.Source.dir.html}${dirs.join(Path.sep)}${Path.sep}${name}`,
      `${Config.Source.dir.model}${dirs.join(Path.sep)}${Path.sep}${Path.basename(name, '.html')}.js`)

    if (!T.err(await tryFunc(Exist.file(path.html, fs.constants.R_OK)))) {
      return await _readHtml(response, path)
    }

    return _output404(response)
  }

  // http://127.0.0.1/a/b
  if (extension === '') {
    const path1 = HtmlModelPath(
      `${Config.Source.dir.html}${dirs.join(Path.sep)}.html`,
      `${Config.Source.dir.model}${dirs.join(Path.sep)}.js`)

    if (!T.err(await tryFunc(Exist.file(path1.html, fs.constants.R_OK)))) {
      return await _readHtml(response, path1)
    }

    const path2 = HtmlModelPath(
      `${Config.Source.dir.html}${dirs.join(Path.sep)}${Path.sep}${_main}.html`,
      `${Config.Source.dir.model}${dirs.join(Path.sep)}${Path.sep}${_main}.js`)

    if (!T.err(await tryFunc(Exist.file(path2.html, fs.constants.R_OK)))) {
      return await _readHtml(response, path2)
    }

    return _output404(response)
  }

  // other
  const path1 = `${Config.Source.dir.html}${dirs.join(Path.sep)}`
  if (!T.err(await tryFunc(Exist.file(path1, fs.constants.R_OK)))) {
    return await _readFile(response, path1, extension)
  }

  const path2 = `${Config.Source.path}${dirs.join(Path.sep)}`
  if (!T.err(await tryFunc(Exist.file(path2, fs.constants.R_OK)))) {
    return await _readFile(response, path2, extension)
  }

  return _output404(response)
}