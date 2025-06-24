/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  const { Type: T, Json } = window.Helper

  window.Data = {
    _enable: null,
    get enable() {
      if (this._enable === null) {
        this._enable = T.func(Storage) && T.obj(localStorage) && T.obj(JSON)
      }

      return this._enable
    },
    set(key, val, ttl = null) {
      if (!this.enable) {
        return this
      }

      const str = Json.encode({ val, ttl: T.num(ttl) ? Date.now() + ttl : null })

      if (!T.err(str)) {
        localStorage.setItem(key, str)
      }
      return this
    },
    del(key) {
      localStorage.removeItem(key)
    },
    get(key) {
      if (!this.enable) {
        return undefined
      }

      const content = localStorage.getItem(key)

      if (content === null) {
        return undefined
      }

      const val = Json.decode(content)
      if (T.err(val)) {
        return undefined
      }

      if (val.ttl === null) {
        return val.val
      }

      if (Date.now() <= val.ttl) {
        return val.val
      }

      localStorage.removeItem(key)

      return undefined
    }
  }
})();