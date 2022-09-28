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
      header: line.substring(0, regex).trim() || 'div',
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

// Param
const Param = {
  _: {
    split: (str, map = new Map()) => (str.split('&').forEach(val => {
      const splitter = val.split('=')
      if (splitter.length < 2)
        return
      
      const k = decodeURIComponent(splitter.shift())
      const v = decodeURIComponent(splitter.join('='))

      if (k.slice(-2) == '[]') {
        const nk = k.slice(0, -2)

        if (map.has(nk)) {
          let nv = map.get(nk)
          nv = Array.isArray(nv) ? nv : []
          nv.push(v)
        } else {
          map.set(nk, [v])
        }
      } else {
        map.set(k, v)
      }
    }), map),
    init: (key, sets, prototype, map) => {
      if (Param._[key] === undefined)
        Param._[key] = new Map()

      const object = new prototype()

      for (const k in sets) {
        Param._[key].set(k, map.has(k)
          ? Param._.Meta(map.get(k), false, key == 'hash')
          : Param._.Meta(sets[k], true, key == 'hash'))
        
        Object.defineProperty(object, k, {
          set (val) {
            const data = Param._[key].get(k)
            if (data instanceof Param._.Meta) data.val = val
          },
          get () {
            const data = Param._[key].get(k)
            return data instanceof Param._.Meta ? data.val : undefined
          }
        })
      }
      return object
    },
    string: (key, object, splitter) => {
      if (Param._[key] === undefined)
        Param._[key] = new Map()

      const sets = []
      for (let [k, v] of Param._[key])
        if (v instanceof Param._.Meta && !v.d4)
          if (Array.isArray(v.val))
            sets.push(...v.val.map(v => `${k}[]=${encodeURIComponent(v)}`))
          else
            sets.push(`${k}=${encodeURIComponent(v.val)}`)
      
      if (object instanceof Param._.Object.Hash || object instanceof Param._.Object.Query)
        sets.push(...Param._.kv(object))

      return sets.length > 0 ? `${splitter}${sets.join('&')}` : ''
    },
    kv: (object, sets = []) => {
      for (let k of Object.keys(object))
        if (Array.isArray(object[k]))
          sets.push(...object[k].map(v => `${k}[]=${encodeURIComponent(v)}`))
        else
          sets.push(`${k}=${encodeURIComponent(object[k])}`)
      return sets
    },
    Meta: function(v, d, h) { if (!(this instanceof Param._.Meta)) return new Param._.Meta(v, d, h); else return this._val = v, this._d4 = d, this._hs = h },
    Object: {
      Hash: function() { if (!(this instanceof Param._.Object.Hash)) return new Param._.Object.Hash() },
      Query: function() { if (!(this instanceof Param._.Object.Query)) return new Param._.Object.Query() },
    }
  },
  Query: function(sets) { this.Query = this._.init('query', sets, Param._.Object.Query, this._.split(window.location.search.substr(1))) },
  Hash: function(sets) { this.Hash = this._.init('hash', sets, Param._.Object.Hash, this._.split(window.location.hash.replace(/^#/, ''))) },
}
Object.defineProperty(Param._.Meta.prototype, 'd4', { get () { return this._d4 } })
Object.defineProperty(Param._.Meta.prototype, 'val', { get () { return this._val }, set (val) { return this._val = val, this._d4 = false, this._hs && (window.location.hash = `${Param.Hash}`), this } })
Param._.Object.Query.prototype.toString = function() { return Param._.string('query', this, '?') }
Param._.Object.Hash.prototype.toString = function() { return Param._.string('hash', this, '#') }
Param.toString = function() { return `${this.Query instanceof this._.Object.Query ? this.Query : ''}${this.Hash instanceof this._.Object.Hash ? this.Hash : ''}` }

const BaseURL = (path = '', query = null, hash = null) => {
  if (BaseURL.func === undefined)
    BaseURL.func = (splitter, object, className) => {
      if (object instanceof className) return `${object}`
      if (typeof object != 'object' || Array.isArray(object) || object === null || object === undefined) return ''
      const hs = Param._.kv(object)
      return `${hs.length > 0 ? `${splitter}${hs.join('&')}` : ''}`
    }

  if (typeof path == 'object' && !Array.isArray(path) && path !== null && path !== undefined) hash = query, query = path, path = null
  if (typeof path != 'string') path = window.location.pathname
  if (query instanceof Param._.Object.Hash) hash = query, query = null

  return `${/(http(s?)):\/\//.test(path) ? path : `${window.location.protocol}//${window.location.host}/${path.split('/').map(t => t.trim()).filter(t => t !== '').join('/') || 'index'}${new RegExp(`${EXT}$`).test(path) ? '' : EXT}`}${BaseURL.func('?', query, Param._.Object.Query)}${BaseURL.func('#', hash, Param._.Object.Hash)}`
}
const Redirect = (url, query = null, hash = null) => {
  window.location.assign(BaseURL(url, query, hash))
  throw new Error('頁面重新導向中…')
}
const Change = (url, query = null, hash = null) => {
  window.location.replace(BaseURL(url, query, hash))
  throw new Error('頁面重新導向中…')
}
const Reload = (url) => {
  location.reload(true)
  throw new Error('頁面重新導向中…')
}
