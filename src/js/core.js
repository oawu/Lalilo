/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

// Local Storage
const Data = {
  _enable: null,
  get enable () {
    if (this._enable === null)
      this._enable = typeof Storage != 'undefined'
        && typeof localStorage != 'undefined'
        && typeof JSON != 'undefined'

    return this._enable
  },
  set (key, val) {
    this.enable
      && localStorage.setItem(key, JSON.stringify({ val: val }))
    return this
  },
  get (key) {
    if (!this.enable)
      return undefined

    key = localStorage.getItem(key)

    if (key === null)
      return undefined

    try {
      key = JSON.parse(key)
      key = key.val
    } catch (_) {
      key = undefined
    }

    return key
  }
}

// Element3
const El3 = function(str) {
  if (!(this instanceof El3))
    return new El3(str)

  const lines = str.split("\n").filter(t => t.trim().length).map(line => {
    const space = line.search(/\S|$/)
    const splitLine = El3._.split(line, /\s+=\>\s+/gm)
    const tmpHeader = El3._.split(splitLine.header, /\.|#/gm)
    const tokens = (splitLine.tokens + (tmpHeader.match + tmpHeader.tokens).replace(/#/gm, ' '.repeat(El3._.splitLength) + '#').replace(/\./gm, ' '.repeat(El3._.splitLength) + '.')).split(new RegExp('\\s{' + El3._.splitLength + ',}', 'gm')).map(attr => {
      if (attr === '*else')
        return { key: 'v-else', val: null }

      attr[0] === '#' && !attr.includes('=') && (attr = `id=${attr.substr(1)}`)
      attr[0] === '.' && !attr.includes('=') && (attr = `class=${attr.substr(1).replace('.', ' ')}`)

      attr.includes(':slot:') && (attr = attr.replace(/^:slot:/, 'v-slot:'))
      if (!attr.includes('=') && attr.includes('v-slot:'))
        return { key: attr, val: null }

      const i = attr.indexOf('=')
      attr = [attr.substr(0, i).trim(), attr.substr(i + 1).trim()].filter(t => t.length)
      return El3._.toVue(attr.shift(), attr.shift())
    }).filter(unit => unit)

    const attrs = {}
    for (let token of tokens)
      attrs[token.key] = token.key == 'class' && attrs[token.key] ? attrs[token.key] + ' ' + token.val : token.val

    const attr = ['']
    for (let key in attrs)
      attr.push(key + (attrs[key] !== null ? `="${attrs[key]}"` : ''))

    return El3._.Line(tmpHeader.header, space, attr.join(' '))
  })

  this.els = []
  let tmp = {}

  for (let line of lines) {
    const parent = tmp[line.space - 2]
    parent
      ? line.space > parent.space && parent.children.push(line)
      : this.els.push(line)
    tmp[line.space] = line
  }
  tmp = null
  delete tmp
}
El3.prototype.toString = function() { return this.els.join('') }
El3._ = {
  Line: function(header, space, attr) {
    if (!(this instanceof El3._.Line))
      return new El3._.Line(header, space, attr)

    this.header = header
    this.space = space
    this.attr = attr
    this.children = []
  },
  splitLength: 3,
  singles: ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'],
  split: (line, regex) => {
    let match = line.match(regex)

    if (!match)
      return {
        header: line.trim(),
        tokens: '',
        match: ''
      }

    regex = line.indexOf(match[0])
    match = match.shift()

    return {
      header: line.substring(0, regex).trim(),
      tokens: line.substring(regex + match.length).trim(),
      match
    }
  },
  toVue: (key, val) => key && val
    ? { key: key.replace(/^\*/, 'v-').replace(/^@/, 'v-on:'), val: val.replace(/"/g, "'") }
    : null
}
El3._.Line.prototype.toString = function() {
  return this.header[0] !== '|'
    ? El3._.singles.indexOf(this.header) != -1
      ? `<${this.header + this.attr} />`
      : `<${this.header + this.attr}>${this.children.join('')}</${this.header}>`
    : this.header.substr(1).trim()
}

// Load
const Load = {
  _: {
    mount (opt) {
      return document.body.appendChild(new Vue(this.option(opt)).$mount().$el)
    },
    option (opt) {
      if (typeof opt == 'function')
        opt = opt()

      if (typeof opt != 'object' || opt === null || Array.isArray(opt))
        return opt

      if (typeof opt.template == 'undefined')
        opt.template = ''

      if (typeof opt.template == 'string')
        opt.template = El3(opt.template)

      if (opt.template instanceof El3)
        opt.template = opt.template.toString()

      if (typeof opt.template == 'object')
        opt.template = opt.template.toString()
      
      return opt
    }
  },
  Vue: opt => $(_ => Load._.mount(opt)),
  VueComponent: (identifier, opt) => Vue.component(identifier, Load._.option(opt))
}
