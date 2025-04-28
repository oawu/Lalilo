/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Data = {
  _enable: null,
  get enable () {
    if (this._enable === null) {
      const { Type: T } = window.Helper
      this._enable = T.func(Storage) && T.obj(localStorage) && T.obj(JSON)
    }

    return this._enable
  },
  set (key, val, ttl = null) {
    if (!this.enable) {
      return this
    }

    const { Type: T, Json } = window.Helper
    const str = Json.encode({ val, ttl: T.num(ttl) ? Date.now() + ttl : null })

    if (!T.err(str)) {
      localStorage.setItem(key, str)
    }
    return this
  },
  del (key) {
    localStorage.removeItem(key)
  },
  get (key) {
    if (!this.enable) {
      return undefined
    }

    const content = localStorage.getItem(key)

    if (content === null) {
      return undefined
    }

    const { Type: T, Json } = window.Helper

    const val = Json.decode(content)
    if (T.err(val)) {
      return undefined
    }

    if (Date.now() <= val.ttl) {
      return val.val
    }

    localStorage.removeItem(key)

    return undefined
  }
}
