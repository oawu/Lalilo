/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Data = {
  _enable: null,
  get enable () {
    if (this._enable === null) {
      this._enable = typeof Storage != 'undefined'
        && typeof localStorage != 'undefined'
        && typeof JSON != 'undefined'
    }

    return this._enable
  },
  set (key, val) {
    if (this.enable) {
      localStorage.setItem(key, JSON.stringify({ val: val }))
    }
    return this
  },
  get (key) {
    if (!this.enable) {
      return undefined
    }

    key = localStorage.getItem(key)

    if (key === null) {
      return undefined
    }

    try {
      key = JSON.parse(key)
      key = key.val
    } catch (_) {
      key = undefined
    }

    return key
  }
}
