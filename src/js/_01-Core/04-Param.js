/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  const { Type: T } = window.Helper

  window.Param = {
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
        if (window.Param._[key] === undefined) {
          window.Param._[key] = new Map()
        }

        const object = new prototype()

        for (const k in sets) {
          const isNum = T.num(sets[k])

          if (map.has(k)) {
            const val = map.get(k)
            if (isNum) {
              const _val = 1 * val
              if (T.num(_val)) {
                window.Param._[key].set(k, window.Param._.Meta(_val, false, key == 'hash'))
              } else {
                window.Param._[key].set(k, window.Param._.Meta(sets[k], true, key == 'hash'))
              }
            } else {
              window.Param._[key].set(k, window.Param._.Meta(val, false, key == 'hash'))
            }
          } else {
            window.Param._[key].set(k, window.Param._.Meta(sets[k], true, key == 'hash'))
          }

          Object.defineProperty(object, k, {
            set(val) {
              const data = window.Param._[key].get(k)
              if (data instanceof window.Param._.Meta) {
                data.val = val
              }
            },
            get() {
              const data = window.Param._[key].get(k)
              return data instanceof window.Param._.Meta
                ? data.val
                : undefined
            }
          })
        }

        return object
      },
      string: (key, object, splitter) => {
        if (window.Param._[key] === undefined) {
          window.Param._[key] = new Map()
        }

        const sets = []
        for (let [k, v] of window.Param._[key]) {
          if (v instanceof window.Param._.Meta && !v.d4) {
            if (Array.isArray(v.val)) {
              sets.push(...v.val.map(v => `${k}[]=${encodeURIComponent(v)}`))
            } else {
              if (v.val !== null) {
                sets.push(`${k}=${encodeURIComponent(v.val)}`)
              }
            }
          }
        }

        if (object instanceof window.Param._.Object.Hash || object instanceof window.Param._.Object.Query) {
          sets.push(...window.Param._.kv(object))
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
      Meta: function (v, d, h) {
        if (!(this instanceof window.Param._.Meta)) {
          return new window.Param._.Meta(v, d, h);
        }

        this._val = v
        this._d4 = d
        this._hs = h
      },
      Object: {
        Hash: function () {
          if (this instanceof window.Param._.Object.Hash) {
            return
          }

          return new window.Param._.Object.Hash()
        },
        Query: function () {
          if (this instanceof window.Param._.Object.Query) {
            return
          }

          return new window.Param._.Object.Query()
        },
      }
    },
    Query: function (sets) {
      this.Query = this._.init(
        'query',
        sets,
        window.Param._.Object.Query,
        this._.split(window.location.search.substr(1)))
    },
    Hash: function (sets) {
      this.Hash = this._.init(
        'hash',
        sets,
        window.Param._.Object.Hash,
        this._.split(window.location.hash.replace(/^#/, '')))
    },
  }
  Object.defineProperty(window.Param._.Meta.prototype, 'd4', {
    get() { return this._d4 }
  })
  Object.defineProperty(window.Param._.Meta.prototype, 'val', {
    get() { return this._val },
    set(val) {
      this._val = val
      this._d4 = false
      history.pushState({}, null, `${window.location.protocol}//${window.location.host}${window.location.pathname}${T.obj(window.Param.Query) ? window.Param.Query : ''}${T.obj(window.Param.Hash) ? window.Param.Hash : ''}`)
      return this
    }
  })
  window.Param._.Object.Query.prototype.toString = function () {
    return window.Param._.string('query', this, '?')
  }
  window.Param._.Object.Hash.prototype.toString = function () {
    return window.Param._.string('hash', this, '#')
  }
  window.Param.toString = function () {
    const q = this.Query instanceof this._.Object.Query
      ? this.Query
      : ''

    const h = this.Hash instanceof this._.Object.Hash
      ? this.Hash
      : ''

    return `${q}${h}`
  }
})();