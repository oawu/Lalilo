/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

// Element3
const El3 = function(str) {
  if (!(this instanceof El3)) {
    return new El3(str)
  }

  const lines = str.split("\n").filter(t => t.trim().length).map(line => {
    // 取得此行前面空幾格
    const space = line.search(/\S|$/)

    // 依據 => 切割
    const splitLine = El3._.split(line, /\s+=\>\s+/gm)
    
    // 依據 . 或 # 切割 header，得到 header 物件
    const tmpH = El3._.split(splitLine.header, /\.|#/gm)

    // 將 #id 以及 .class 轉化為 attr
    const attrH = `${tmpH.match}${tmpH.tokens}`.replace(/#/gm, ' '.repeat(El3._.splitLength) + '#')
                                              .replace(/\./gm, ' '.repeat(El3._.splitLength) + '.')

    // 依據三個(El3._.splitLength)以上的空格做切割
    const tokens = `${splitLine.tokens}${attrH}`.split(new RegExp('\\s{' + El3._.splitLength + ',}', 'gm')).map(attr => {
      if (attr === '*else') {
        return { key: 'v-else', val: null }
      }

      if (attr[0] === '#' && !attr.includes('=')) {
        attr = `id=${attr.substr(1)}`
      }

      if (attr[0] === '.' && !attr.includes('=')) {
        attr = `class=${attr.substr(1).replace('.', ' ')}`
      }

      if (attr.includes(':slot:')) {
        attr = attr.replace(/^:slot:/, 'v-slot:')
      }

      if (!attr.includes('=') && attr.includes('v-slot:')) {
        return { key: attr, val: null }
      }

      const i = attr.indexOf('=')

      attr = [
        attr.substr(0, i).trim(),
        attr.substr(i + 1).trim()
      ].filter(t => t.length)

      const key = attr.shift()
      const val = attr.shift()

      if (!(key && val)) {
        return null
      }

      return {
        key: key.replace(/^\*/, 'v-').replace(/^@/, 'v-on:'),
        val: val.replace(/"/g, "'")
      }

    }).filter(t => t !== null)

    // 整理出 attr
    const attrs = {}
    for (let token of tokens) {
      if (token.key == 'class' && attrs[token.key]) {
        attrs[token.key] = `${attrs[token.key]} ${token.val}`
      } else {
        attrs[token.key] = token.val
      }
    }

    const attr = ['']
    for (let key in attrs) {
      attr.push(`${key}${attrs[key] !== null ? `="${attrs[key]}"` : ''}`)
    }

    // 回傳 Line 物件
    return El3._.Line(tmpH.header, space, attr.join(' '))
  }).filter(t => t !== null)

  // 組合出巢狀
  this.els = []
  let tmp = {}

  for (let line of lines) {
    const parent = tmp[line.space - 2]

    if (parent) {
      if (line.space > parent.space) {
        parent.children.push(line)
      }
    } else {
      this.els.push(line)
    }

    tmp[line.space] = line
  }
  tmp = null
}
El3.prototype.toString = function() { return this.els.join('') }
El3._ = {
  splitLength: 3,
  singles: ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'],
  Line: function(header, space, attr) {
    if (!(this instanceof El3._.Line)) {
      return new El3._.Line(header, space, attr)
    }

    this.header = header
    this.space = space
    this.attr = attr
    this.children = []
  },
  split: (line, regex) => {
    let match = line.match(regex)

    if (!match) {
      return {
        header: line.trim(),
        tokens: '',
        match: ''
      }
    }

    regex = line.indexOf(match[0])
    match = match.shift()

    const header = line.substring(0, regex).trim()
    const tokens = line.substring(regex + match.length).trim()

    return {
      header: header === '' ? 'div' : header,
      tokens,
      match
    }
  },
  join: (header, attr, children = []) => {
    return El3._.singles.indexOf(header) == -1
      ? `<${header}${attr}>${children.join('')}</${header}>`
      : `<${header}${attr} />`
  }
}
El3._.Line.prototype.toString = function() {
  let tmp = this.header.slice(0, 2)

  if (!(tmp !== '//')) {
    return `<!-- ${El3._.join(this.header.substr(2).trim(), this.attr, this.children)} -->`
  }

  if (!(tmp !== '>>' && tmp !== '||')) {
    return `{{ ${this.header.substr(2).trim()} }}`
  }
  
  if (!(this.header[0] !== '>' && this.header[0] !== '|')) {
    return this.header.substr(1).trim()
  }

  return El3._.join(this.header, this.attr, this.children)
}