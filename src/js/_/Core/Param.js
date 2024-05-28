/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Param = {
  _: {
    split: (str, map = new Map()) => (str.split('&').forEach(val => {
      
      const splitter = val.split('=')
      
      if (splitter.length < 2) {
        return
      }
      
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
      if (Param._[key] === undefined) {
        Param._[key] = new Map()
      }

      const object = new prototype()

      for (const k in sets) {
        Param._[key].set(k, map.has(k)
          ? Param._.Meta(map.get(k), false, key == 'hash')
          : Param._.Meta(sets[k], true, key == 'hash'))
        
        Object.defineProperty(object, k, {
          set (val) {
            const data = Param._[key].get(k)
            if (data instanceof Param._.Meta) {
              data.val = val
            }
          },
          get () {
            const data = Param._[key].get(k)
            return data instanceof Param._.Meta
              ? data.val
              : undefined
          }
        })
      }
      return object
    },
    string: (key, object, splitter) => {
      if (Param._[key] === undefined) {
        Param._[key] = new Map()
      }

      const sets = []
      for (let [k, v] of Param._[key]) {
        if (v instanceof Param._.Meta && !v.d4) {
          if (Array.isArray(v.val)) {
            sets.push(...v.val.map(v => `${k}[]=${encodeURIComponent(v)}`))
          } else{
            if (v.val !== null) {
              sets.push(`${k}=${encodeURIComponent(v.val)}`)
            }
          }
        }
      }
      
      if (object instanceof Param._.Object.Hash || object instanceof Param._.Object.Query) {
        sets.push(...Param._.kv(object))
      }

      return sets.length > 0
        ? `${splitter}${sets.join('&')}`
        : ''
    },
    kv: (object, sets = []) => {
      for (let k of Object.keys(object)) {
        if (Array.isArray(object[k])) {
          sets.push(...object[k].map(v => `${k}[]=${encodeURIComponent(v)}`))
        } else {
          sets.push(`${k}=${encodeURIComponent(object[k])}`)
        }
      }
      return sets
    },
    Meta: function(v, d, h) {
      if (!(this instanceof Param._.Meta)) {
        return new Param._.Meta(v, d, h);
      }

      this._val = v
      this._d4 = d
      this._hs = h
    },
    Object: {
      Hash: function() {
        if (this instanceof Param._.Object.Hash) {
          return
        }

        return new Param._.Object.Hash()
      },
      Query: function() {
        if (this instanceof Param._.Object.Query) {
          return
        }

        return new Param._.Object.Query()
      },
    }
  },
  Query: function(sets) {
    this.Query = this._.init(
      'query',
      sets,
      Param._.Object.Query,
      this._.split(window.location.search.substr(1)))
  },
  Hash: function(sets) {
    this.Hash = this._.init(
      'hash',
      sets,
      Param._.Object.Hash,
      this._.split(window.location.hash.replace(/^#/, '')))
  },
}
Object.defineProperty(Param._.Meta.prototype, 'd4', {
  get () { return this._d4 }
})
Object.defineProperty(Param._.Meta.prototype, 'val', {
  get () { return this._val },
  set (val) {
    this._val = val
    this._d4 = false
    history.pushState({}, null, `${window.location.protocol}//${window.location.host}${window.location.pathname}${Param.Query}${Param.Hash}`)
    return this
} })
Param._.Object.Query.prototype.toString = function() {
  return Param._.string('query', this, '?')
}
Param._.Object.Hash.prototype.toString = function() {
  return Param._.string('hash', this, '#')
}
Param.toString = function() {
  const q = this.Query instanceof this._.Object.Query
    ? this.Query
    : ''

  const h = this.Hash instanceof this._.Object.Hash
    ? this.Hash
    : ''
  
  return `${q}${h}`
}