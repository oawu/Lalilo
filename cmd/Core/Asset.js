/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const FileSystem = require('fs')
const Path       = require('path')

const Babel      = require("@babel/core")

const Config     = require('@oawu/_Config')
const Helper     = require('@oawu/_Helper')

const Comment = [
  '/**',
  ' * @author      OA Wu <oawu.tw@gmail.com>',
  ` * @copyright   Copyright (c) 2015 - ${new Date().getFullYear()}, Lalilo`,
  ' * @license     http://opensource.org/licenses/MIT  MIT License',
  ' * @link        https://www.ioa.tw/',
  ' */',
].join('\n')

const cssDir = _ => {
  return Config.assetDir.css
}
const jsDir = _ => {
  return Config.assetDir.js
}
const entryDir = _ => {
  return Config.assetDir.entry
}

const Asset = function() {
  if (!(this instanceof Asset)) {
    return new Asset()
  }

  this._cssMap = new Map()
  this._jsMap = new Map()

  this._cssList = []
  this._jsList = []

}

Asset.prototype.css = function(src, attr = { type: 'text/css', rel: 'stylesheet' }) {
  if (!(typeof src == 'string' && src !== '')) {
    return this
  }
  if (src.startsWith('http://') || src.startsWith('https://')) {
    if (!this._cssMap.get(src)) {
      this._cssList.push({ src, file: null, attr })
      this._cssMap.set(src, true)
    }
    return this
  }

  let files = []
  const dirs = src.split('/').filter(t => t !== '')
  if (!dirs.length) {
    files = []
  } else if (dirs[dirs.length - 1] == '**') {
    files = Helper.Fs.scanDirSync(`${cssDir()}${Helper.Fs.dirOrEmpty(dirs.slice(0, -1).join(Path.sep))}`, true).filter(file => Path.extname(file) == '.css')
  } else if (dirs[dirs.length - 1] == '*') {
    files = Helper.Fs.scanDirSync(`${cssDir()}${Helper.Fs.dirOrEmpty(dirs.slice(0, -1).join(Path.sep))}`, false).filter(file => Path.extname(file) == '.css')
  } else {
    const file = `${cssDir()}${dirs.join(Path.sep)}`
    if (Helper.Fs.exists(file)) {
      files = [file]
    }
  }

  for (const file of files) {
    if (Helper.Fs.inDir(entryDir(), file)) {
      if (!this._cssMap.get(file)) {
        let name = Path.relative(entryDir(), file)
        this._cssList.push({ file, attr, name, src: `${Config.baseUrl}${name.split(Path.sep).join('/')}` })
        this._cssMap.set(file, true)
      }
    }
  }

  return this
}
Asset.prototype.js = function(src, minify = true, attr = { type: 'text/javascript', language: 'javascript' }) {
  if (!(typeof src == 'string' && src !== '')) {
    return this
  }

  if (src.startsWith('http://') || src.startsWith('https://')) {
    if (!this._jsMap.get(src)) {
      this._jsList.push({ src, file: null, attr })
      this._jsMap.set(src, true)
    }
    return this
  }

  let files = []

  const dirs = src.split('/').filter(t => t !== '')

  if (!dirs.length) {
    files = []
  } else if (dirs[dirs.length - 1] == '**') {
    files = Helper.Fs.scanDirSync(`${jsDir()}${Helper.Fs.dirOrEmpty(dirs.slice(0, -1).join(Path.sep))}`, true).filter(file => Path.extname(file) == '.js')
  } else if (dirs[dirs.length - 1] == '*') {
    files = Helper.Fs.scanDirSync(`${jsDir()}${Helper.Fs.dirOrEmpty(dirs.slice(0, -1).join(Path.sep))}`, false).filter(file => Path.extname(file) == '.js')
  } else {
    const file = `${jsDir()}${dirs.join(Path.sep)}`
    if (Helper.Fs.exists(file)) {
      files = [file]
    }
  }

  for (const file of files) {
    if (Helper.Fs.inDir(entryDir(), file)) {
      if (!this._jsMap.get(file)) {
        let name = Path.relative(entryDir(), file)
        this._jsList.push({ file, minify, attr, name, src: `${Config.baseUrl}${name.split(Path.sep).join('/')}` })
        this._jsMap.set(file, true)
      }
    }
  }

  return this
}

const joinAttr = obj => {
  const attrs = []
  for (let key in obj) {
    if (typeof key == 'string' && key !== '') {
      let val = obj[key]
      if (val === undefined) {

      } else if (val === null) {
        attrs.push(`${key}`)
      } else {
        attrs.push(`${key}="${obj[key]}"`)
      }
    }
  }
  return attrs.length ? ` ${attrs.join(' ')}` : ''
}
const mergeCss = list => {
  const tags = []
  let strs = []
  let merge = _ => {
    if (!strs.length) {
      return null
    }
    tags.push(`<style${joinAttr({ type: 'text/css' })}>\n@charset "UTF-8";\n\n${strs.join('\n\n')}\n</style>`)
    strs = []
  }

  for (const { file, src, attr, name } of list) {
    if (file === null) {
      merge()
      tags.push(`<link href="${src}"${joinAttr(attr)} />`)
    } else {
      let content = null
      try {
        content = FileSystem.readFileSync(file, 'utf8').trim().replace(/^\uFEFF/gm, "")
        if (content.startsWith('@charset "UTF-8";')) {
          content = content.substring('@charset "UTF-8";'.length).trim()
        }
      } catch (_) {
        content = null
      }

      if (content !== null) {
        strs.push(`/* ----- ${name} ----- */\n${content}`)
        // strs.push(`/* ---------- */\n${content}`)
      }
    }
  }
  merge()

  return tags
}
const mergeJs = list => {
  const tags = []
  let strs = []

  let merge = _ => {
    if (!strs.length) {
      return null
    }

    let content = null

    if (Config.isMinify) {
      try {
        content = [Comment, `${Babel.transformSync(strs.join('\n\n'), Config.Build.jsMinify).code}`].join('\n')
      } catch (_) {
        content = null
      }
    }

    if (content == null) {
      content = strs.join('\n\n')
    }

    tags.push(`<script${joinAttr({ type: 'text/javascript', language: 'javascript' })}>\n${content}\n</script>`)
    strs = []
  }

  for (const { file, minify, src, attr, name } of list) {
    if (file === null) {
      merge()
      tags.push(`<script src="${src}"${joinAttr(attr)}></script>`)
    } else if (!minify) {
      let content = null
      try {
        content = FileSystem.readFileSync(file, 'utf8').trim().replace(/^\uFEFF/gm, "")
      } catch (_) {
        content = null
      }

      if (content !== null) {
        merge()
        tags.push(`<script${joinAttr(attr)}>${content}</script>`)
      }
    } else {
      let content = null
      try {
        content = FileSystem.readFileSync(file, 'utf8').trim().replace(/^\uFEFF/gm, "")
      } catch (_) {
        content = null
      }

      if (content !== null) {
        strs.push(`/* ----- ${name} ----- */\n${content}`)
        // strs.push(`/* ---------- */\n${content}`)
      }
    }
  }
  merge()

  return tags
}

Asset.prototype.toString = function() {
  return Config.isMerge
    ? [
        ...mergeCss(this._cssList),
        ...mergeJs(this._jsList),
      ].join('\n')
    : [
        ...this._cssList.map(({ src, attr }) => `<link href="${src}"${joinAttr(attr)} />`),
        ...this._jsList.map(({ src, attr }) => `<script src="${src}"${joinAttr(attr)}></script>`)
      ].join('\n')
}

module.exports = Asset
