/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  const { Helper, Env, Data } = window
  const { Type: T } = Helper

  const _buildParams = function (key, value) {
    if (value === undefined || value === null) {
      return
    }

    if (T.func(value)) {
      _buildParams.call(this, key, value())
      return
    }

    if (T.num(value)) {
      this.append(key, `${value}`)
      return
    }

    if (T.str(value)) {
      this.append(key, value)
      return
    }

    if (T.bool(value)) {
      this.append(key, value ? 'true' : 'false')
      return
    }

    // 陣列 → 逐項遞迴，索引要帶上
    if (T.arr(value)) {
      for (const i in value) {
        const v = value[i]
        _buildParams.call(this, `${key}[${i}]`, v)
      }
      return
    }

    // 物件 → 逐欄遞迴
    if (typeof value === 'object') {
      for (const k in value) {
        const v = value[k]
        _buildParams.call(this, `${key}[${k}]`, v)
      }
      return
    }

    // 基本型別 → 直接 append
    this.append(key, value)
  }

  window.Page = function (path) {
    if (!(this instanceof window.Page)) {
      return new window.Page(path)
    }

    this._flashMessage = null
    this._isHttp = false
    this._type = null
    this._path = null
    this._queries = {}

    if (!T.str(path)) {
      return
    }

    this._isHttp = T.neStr(path) && /^https?:\/\//i.test(path)
    if (this._isHttp) {
      return this._path = path
    }

    const paths = path.split('/').map(path => path.trim()).filter(t => t !== '')
    if (T.arr(paths) && paths.length >= 1 && ['admin', 'organization'].includes(paths[0])) {
      this._type = paths[0]
    }

    this._path = `${Env.url.base}${paths.join('/')}`
  }

  window.Page.prototype.message = function (val) {
    if (T.obj(val) && T.neStr(val.type) && T.neStr(val.message) && ['failure', 'success', 'warning', 'info'].includes(val.type)) {
      if (!T.obj(this._flashMessage)) {
        this._flashMessage = {}
      }
      this._flashMessage.type = val.type
      this._flashMessage.message = val.message
    }
    return this
  }
  window.Page.prototype.failureMessage = function (val) { return this.message({ type: 'failure', message: val }) }
  window.Page.prototype.successMessage = function (val) { return this.message({ type: 'success', message: val }) }
  window.Page.prototype.warningMessage = function (val) { return this.message({ type: 'warning', message: val }) }
  window.Page.prototype.infoMessage = function (val) { return this.message({ type: 'info', message: val }) }

  window.Page.prototype.failure = function (val) { return this.failureMessage(val) }
  window.Page.prototype.success = function (val) { return this.successMessage(val) }
  window.Page.prototype.warning = function (val) { return this.warningMessage(val) }
  window.Page.prototype.info = function (val) { return this.infoMessage(val) }

  window.Page.prototype.query = function (key, val = undefined) {
    if (T.obj(key)) {
      return this.setQuery(key)
    }
    if (val === undefined) {
      return this
    }
    if (!T.str(key)) {
      return this
    }

    this._queries[key] = val
    return this
  }
  window.Page.prototype.setQuery = function (obj) {
    if (!T.obj(obj)) {
      return this
    }

    this._queries = obj
    return this
  }
  window.Page.prototype.replace = function (message = '導頁中…') {
    if (!(T.obj(Env) && T.str(this._path))) {
      return this
    }

    if (T.obj(Data) && this._type !== null && this._flashMessage) {
      Data.set(`${this._type}-flash`, this._flashMessage)
    }

    const url = new URL(this._path)

    if (T.obj(this._queries)) {
      for (const k in this._queries) {
        _buildParams.call(url.searchParams, k, this._queries[k])
      }
    }

    window.location.replace(url.toString())
    throw new Error(message)
  }

  window.Page.prototype.redirect = function (message = '導頁中…') {
    if (!(T.obj(Env) && T.str(this._path))) {
      return this
    }

    if (T.obj(Data) && this._type !== null && this._flashMessage) {
      Data.set(`${this._type}-flash`, this._flashMessage)
    }

    const url = new URL(this._path)

    for (const k in this._queries) {
      _buildParams.call(url.searchParams, k, this._queries[k])
    }

    window.location.assign(url.toString())
    throw new Error(message)
  }
  window.Page.prototype.open = function () {
    if (!(T.obj(Env) && T.str(this._path))) {
      return this
    }

    if (T.obj(Data) && this._type !== null && this._flashMessage) {
      Data.set(`${this._type}-flash`, this._flashMessage)
    }

    const url = new URL(this._path)

    for (const k in this._queries) {
      _buildParams.call(url.searchParams, k, this._queries[k])
    }

    window.open(url.toString(), '_blank')
  }
  window.Page.reload = function (message = '導頁中…') {
    location.reload(true)
    throw new Error(message)
  }
})();