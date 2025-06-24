/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  const { Type: T, Json, promisify, tryFunc } = window.Helper

  window.Api = function (url, base = null) {
    if (!(this instanceof window.Api)) {
      return new window.Api(url, base)
    }

    this._url = ''
    this._base = null
    this._method = 'GET'
    this._progress = null
    this._timeout = null

    this._headers = {}
    this._queries = {}

    this._payload = {
      type: null,
      raw: null,
      formdata: null,
      urlencoded: null,
    }

    this.url(url, base)
  }

  window.Api.prototype.timeout = function (val) {
    if (val === null || (T.num(val) && val > 0)) {
      this._timeout = val
    }
    return this
  }
  window.Api.prototype.progress = function (val) {
    if (val === null || T.func(val)) {
      this._progress = val
    }
    return this
  }

  window.Api.prototype.url = function (val, base = null) {
    this._url = `${val}`

    if (base === null || T.neStr(base)) {
      this._base = base
    }

    return this
  }
  window.Api.prototype.method = function (val) {
    if (T.neStr(val)) {
      this._method = val.toUpperCase()
    }

    return this
  }

  window.Api.prototype.header = function (key, val) {
    if (!T.str(key)) {
      return this
    }

    this._headers[key] = val
    return this
  }
  window.Api.prototype.setHeader = function (obj) {
    if (!T.obj(obj)) {
      return this
    }

    this._headers = obj
    return this
  }

  window.Api.prototype.query = function (key, val) {
    if (!T.str(key)) {
      return this
    }

    this._queries[key] = val
    return this
  }
  window.Api.prototype.setQuery = function (obj) {
    if (!T.obj(obj)) {
      return this
    }

    this._queries = obj
    return this
  }

  Object.defineProperty(window.Api.prototype, 'payload', {
    get() {
      const that = this
      return {
        raw(val) {
          if (T.str(val)) {
            that._payload.raw = val
            that._payload.type = 'rawtext'
            return that
          }

          val = Json.encode(val)

          if (!T.str(val)) {
            return that
          }

          that._payload.raw = val
          that._payload.type = 'rawjson'
          return that
        },
        formdata(key, val) {
          if (!T.str(key)) {
            return that
          }

          if (!(that._payload.formdata instanceof FormData)) {
            that._payload.formdata = new FormData()
          }

          that._payload.formdata.append(key, val)
          that._payload.type = 'formdata'

          return that
        },
        setFormdata(obj) {
          if (!T.obj(obj)) {
            return that
          }

          if (obj instanceof FormData) {
            that._payload.formdata = obj
            that._payload.type = 'formdata'
            return that
          }

          that._payload.formdata = new FormData()

          for (const k in obj) {
            that._payload.formdata.append(k, obj[k])
          }

          that._payload.type = 'formdata'
          return that
        },
        urlencoded(key, val) {
          if (!T.str(key)) {
            return that
          }

          if (!T.obj(that._payload.urlencoded)) {
            that._payload.urlencoded = {}
          }

          that._payload.urlencoded[key] = val
          that._payload.type = 'urlencoded'
          return that
        },
        setUrlencoded(obj) {
          if (!T.obj(obj)) {
            return that
          }

          that._payload.urlencoded = obj
          that._payload.type = 'urlencoded'
          return that
        }
      }
    }
  })

  const _send = function (closure) {
    return promisify(closure, async _ => {

      const _data = await tryFunc(_ => {

        const base = T.neStr(this._base) ? this._base : window.location.origin
        const url = new URL(this._url, base)

        for (const k in this._queries) {
          url.searchParams.append(k, this._queries[k])
        }

        const headers = { ...this._headers }

        let body = null
        if (T.str(this._payload.raw) && this._payload.type === 'rawtext') {
          headers['Content-Type'] = 'text/plain'
          body = this._payload.raw
        }
        if (T.str(this._payload.raw) && this._payload.type === 'rawjson') {
          headers['Content-Type'] = 'application/json'
          body = this._payload.raw
        }
        if (T.obj(this._payload.formdata) && (this._payload.formdata instanceof FormData) && this._payload.type === 'formdata') {
          body = this._payload.formdata
        }
        if (T.obj(this._payload.urlencoded) && this._payload.type === 'urlencoded') {
          headers['Content-Type'] = 'application/x-www-form-urlencoded'
          body = new URLSearchParams(this._payload.urlencoded).toString()
        }

        return {
          url, headers, body
        }
      })

      if (T.err(_data)) {
        throw new Error('資料結構錯誤！', { cause: _data })
      }

      const { url, headers, body } = _data

      const data = await tryFunc(new Promise((resolve, _) => {
        const xhr = new XMLHttpRequest()
        xhr.open(this._method.toUpperCase(), url.toString(), true)

        for (const key in headers) {
          const val = headers[key]
          xhr.setRequestHeader(key, val)
        }

        if (T.num(this._timeout) && this._timeout > 0) {
          xhr.timeout = this._timeout
        }

        if (T.func(this._progress) && xhr.upload) {
          xhr.upload.onprogress = e => {
            if (e.lengthComputable) {
              this._progress((e.loaded / e.total) * 100, e.loaded, e.total, e)
            }
          }
        }

        // xhr.responseType = 'json'

        xhr.onload = function () {
          // if (this.status >= 200 && this.status < 300) {
          resolve(this)
          // }
          // resolve(new Error(`HTTP ${this.status}: ${this.statusText}`))
        }

        xhr.onerror = _ => resolve(new Error('網路錯誤'))
        xhr.ontimeout = _ => resolve(new Error('超出預期時間'))
        xhr.send(body)
      }))

      if (T.err(data)) {
        throw new Error('呼叫失敗！', { cause: data })
      }

      const json = Json.decode(data.response)

      return {
        code: data.status,
        json,
        data
      }
    }, this)
  }

  window.Api.prototype.send = function (closure = null) {
    return _send.call(this, closure)
  }
  window.Api.prototype.get = function (closure = null) {
    return _send.call(this.method('get'), closure)
  }
  window.Api.prototype.post = function (closure = null) {
    return _send.call(this.method('post'), closure)
  }
  window.Api.prototype.put = function (closure = null) {
    return _send.call(this.method('put'), closure)
  }
  window.Api.prototype.delete = function (closure = null) {
    return _send.call(this.method('delete'), closure)
  }
  window.Api.prototype.del = function (closure = null) {
    return _send.call(this.method('delete'), closure)
  }
})();