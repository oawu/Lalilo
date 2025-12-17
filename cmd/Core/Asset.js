/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */


const fs = require('fs/promises')
const Path = require('path')
const Babel = require("@babel/core")
const Terser = require('terser');

const Config = require('@oawu/_Config')
const { Type: T, tryFunc } = require('@oawu/helper')
const { inDir, Concat, scanFiles, fileExt } = require('@oawu/_Helper')

const cssDir = _ => {
  return Config.assetDir.css
}
const jsDir = _ => {
  return Config.assetDir.js
}
const entryDir = _ => {
  return Config.assetDir.entry
}
const baseUrl = _ => {
  return Config.baseUrl
}
const isMerge = _ => {
  return Config.isMerge
}
const isMinify = _ => {
  return Config.isMinify
}
const jsMinify = _ => {
  return Config.Build.jsMinify
}

const Asset = function () {
  if (!(this instanceof Asset)) {
    return new Asset()
  }

  this._cssList = []
  this._jsList = []
}

Asset.prototype.css = function (src, attr = { type: 'text/css', rel: 'stylesheet' }) {
  if (!T.str(src)) {
    return this
  }
  src = src.trim()
  if (!T.neStr(src)) {
    return this
  }

  this._cssList.push({ src, attr, merge: false })
  return this
}

Asset.prototype.js = function (src, merge = true, attr = { type: 'text/javascript', language: 'javascript' }) {
  if (!T.str(src)) {
    return this
  }
  src = src.trim()
  if (!T.neStr(src)) {
    return this
  }

  this._jsList.push({ src, merge, attr })
  return this
}


const _joinAttr = obj => {
  const attrs = []
  for (let key in obj) {
    if (T.str(key)) {
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

const _extract = async (list, dir, _ext) => {
  const filesList = await Promise.all(list.map(async ({ src, attr, merge }) => {
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return [{ src, file: null, attr, merge }]
    }

    let files = []

    const dirs = src.split('/').filter(t => t !== '')
    if (!dirs.length) {
      return files
    }

    if (dirs[dirs.length - 1] == '**') {
      files = await scanFiles(Concat.dir(dir, dirs.slice(0, -1).join(Path.sep), ''), true)
    } else if (dirs[dirs.length - 1] == '*') {
      files = await scanFiles(Concat.dir(dir, dirs.slice(0, -1).join(Path.sep), ''), false)
    } else {
      const fullpath = Concat.file(dir, dirs.join(Path.sep), '')
      files = [{ fullpath, attr, merge, ext: fileExt(fullpath) }]
    }

    return files.filter(({ fullpath, ext }) => ext === _ext && inDir(entryDir(), fullpath)).map(({ fullpath: file }) => {
      let name = Path.relative(entryDir(), file)
      const src = baseUrl() + name.split(Path.sep).join('/')
      return { file, attr, name, src, merge }
    })
  }))

  const _files = filesList.reduce((a, b) => a.concat(b), []).reverse()

  const files = []
  const _map = new Map()
  for (const file of _files) {
    if (file.file === null) {
      if (!_map.get(file.src)) {
        files.push(file)
        _map.set(file.src, true)
      }
    } else {
      if (!_map.get(file.file)) {
        files.push(file)
        _map.set(file.file, true)
      }
    }
  }

  return files.reverse()
}

const _mergeCss = async list => {
  const tags = []
  let strs = []

  let _merge = _ => {
    if (!strs.length) {
      return null
    }
    tags.push(`<style${_joinAttr({ type: 'text/css' })}>@charset "UTF-8";${strs.join('')}\n</style>`)
    strs = []
  }

  for (const { file, src, attr, name } of list) {
    if (file === null) {
      _merge()
      tags.push(`<link href="${src}"${_joinAttr(attr)} />`)
      continue
    }

    let content = await tryFunc(fs.readFile(file, { encoding: 'utf8' }))
    if (T.err(content)) {
      continue
    }

    content = content.trim().replace(/^\uFEFF/gm, "")
    if (content.startsWith('@charset "UTF-8";')) {
      content = content.substring('@charset "UTF-8";'.length).trim()
    }
    strs.push(`${content}`)
    // strs.push(`/* ----- ${name} ----- */\n${content}`)
  }
  _merge()

  return tags
}

const _mergeJs = async list => {
  const tags = []
  let strs = []

  let _merge = async _ => {
    if (!strs.length) {
      return null
    }

    let content = null

    if (isMinify()) {
      try {
        const babelOutput = Babel.transformSync(strs.join('\n\n'), jsMinify()).code
        const minified = await Terser.minify(babelOutput, {
          format: {
            comments: false
          }
        })

        if (minified.error) {
          throw minified.error
        }

        content = [`${minified.code}`].join('\n')
      } catch (_) {
        content = null
      }
    }

    if (content == null) {
      content = strs.join('\n\n')
    }

    tags.push(`<script${_joinAttr({ type: 'text/javascript', language: 'javascript' })}>\n${content}\n</script>`)
    strs = []
  }

  for (const { file, merge, src, attr, name } of list) {
    if (file === null) {
      await _merge()
      tags.push(`<script src="${src}"${_joinAttr(attr)}></script>`)
      continue
    }

    if (!merge) {
      let content = await tryFunc(fs.readFile(file, { encoding: 'utf8' }))
      if (T.err(content)) {
        continue
      }

      content = content.trim().replace(/^\uFEFF/gm, "")
      await _merge()
      tags.push(`<script${_joinAttr(attr)}>${content}</script>`)
      continue
    }

    let content = await tryFunc(fs.readFile(file, { encoding: 'utf8' }))
    if (T.err(content)) {
      continue
    }
    content = content.trim().replace(/^\uFEFF/gm, "")
    strs.push(`/* ----- ${name} ----- */\n${content}`)
    // strs.push(`/* ---------- */\n${content}`)
  }
  await _merge()

  return tags
}

Asset.prototype.toString = async function () {
  const [cssList, jsList] = await Promise.all([_extract(this._cssList, cssDir(), '.css'), _extract(this._jsList, jsDir(), '.js')])
  return isMerge()
    ? [
      ...await _mergeCss(cssList),
      ...await _mergeJs(jsList),
    ].join('\n')
    : [
      ...cssList.map(({ src, attr }) => `<link href="${src}"${_joinAttr(attr)} />`),
      ...jsList.map(({ src, attr }) => `<script src="${src}"${_joinAttr(attr)}></script>`)
    ].join('\n')
}

module.exports = Asset
