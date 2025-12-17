/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  const { Type: T, Json, promisify, tryFunc } = window.Helper

  let _when = null

  const _buildParams = async function (key, value) {
    if (value === undefined || value === null) {
      return
    }

    if (T.func(value)) {
      value = value()
    }

    if (T.asyncFunc(value)) {
      value = await value()
    }

    if (T.promise(value)) {
      value = await value
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
        await _buildParams.call(this, `${key}[${i}]`, v)
      }
      return
    }

    // 物件 → 逐欄遞迴
    if (typeof value === 'object') {
      for (const k in value) {
        const v = value[k]
        await _buildParams.call(this, `${key}[${k}]`, v)
      }
      return
    }

    // 基本型別 → 直接 append
    this.append(key, value)
  }

  const _send = function (closure) {
    return promisify(closure, async _ => {
      if (T.arr(this._when)) {
        const cause = await tryFunc(async _ => {
          for (const when of this._when) {
            if (T.func(when)) {
              when(this)
            }
            if (T.asyncFunc(when)) {
              await when(this)
            }
            if (T.promise(when)) {
              await when
            }
          }
        })

        if (T.err(cause)) {
          throw new Error('資料結構錯誤！', { cause })
        }
      }

      const request = await tryFunc(async _ => {
        const base = T.neStr(this._base) ? this._base : window.location.origin
        const url = new URL(this._url, base)

        for (const k in this._queries) {
          await _buildParams.call(url.searchParams, k, this._queries[k])
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

      if (T.err(request)) {
        throw new Error('資料結構錯誤！', { cause: request })
      }

      const { url, headers, body } = request

      const response = await tryFunc(new Promise((resolve, _) => {
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

        xhr.onload = function () { resolve(this) }
        xhr.onerror = _ => resolve(new Error('網路錯誤'))
        xhr.ontimeout = _ => resolve(new Error('超出預期時間'))
        xhr.send(body)
      }))

      if (T.err(response)) {
        throw new Error('呼叫失敗！', { cause: response })
      }

      let data = response

      const afters = [...this._afters]

      for (const after of afters) {
        let result = undefined
        if (T.func(after)) {
          result = await tryFunc(_ => after(data))
        }
        if (T.asyncFunc(after)) {
          result = await tryFunc(async _ => await after(data))
        }
        if (T.promise(after)) {
          result = await tryFunc(after)
        }
        if (T.err(result)) {
          throw result
        }
        if (result !== undefined) {
          data = result
        }
      }

      return data
    }, this)
  }

  window.Api = function (url = '', base = null) {
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

    this._afters = []
    this._when = null

    this.url(url).base(base)
  }
  window.Api.when = (key, func = null) => {
    if (T.func(key)) {
      func = key
      key = null
    }

    if (!(key === null || T.num(key) || T.str(key))) {
      return window.Api
    }
    if (!T.func(func)) {
      return window.Api
    }

    if (!T.obj(_when)) {
      _when = {}
    }

    if (!T.arr(_when[key])) {
      _when[key] = []
    }

    _when[key].push(func)
    return window.Api
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
  window.Api.prototype.url = function (val) {
    this._url = `${val}`
    return this
  }
  window.Api.prototype.base = function (val) {
    if (val === null || T.neStr(val)) {
      this._base = val
    }
    return this
  }
  window.Api.prototype.method = function (val) {
    if (T.neStr(val)) {
      this._method = val.toUpperCase()
    }

    return this
  }
  window.Api.prototype.header = function (key, val = undefined) {
    if (T.obj(key)) {
      return this.setHeader(key)
    }
    if (val === undefined) {
      return that
    }
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
  window.Api.prototype.query = function (key, val = undefined) {
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
  window.Api.prototype.setQuery = function (obj) {
    if (!T.obj(obj)) {
      return this
    }

    this._queries = obj
    return this
  }
  window.Api.prototype.setAfter = function (funcs = null) {
    if (T.arr(funcs)) {
      this._afters = funcs.filter(func => T.func(func) || T.asyncFunc(func) || T.promise(func))
    }
    return this
  }
  window.Api.prototype.after = function (func = null) {
    if (T.arr(func)) {
      return this.setAfter(func)
    }

    if (!(T.func(func) || T.asyncFunc(func) || T.promise(func))) {
      return this
    }

    this._afters.push(func)
    return this
  }
  window.Api.prototype.load = function (key = null) {
    if (!(key === null || T.num(key) || T.str(key))) {
      return this
    }
    if (!T.obj(_when)) {
      return this
    }
    if (!T.arr(_when[key])) {
      return this
    }
    for (const when of _when[key]) {
      when(this)
    }
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
        formdata(key, val = undefined) {
          if (T.obj(key)) {
            return this.setFormdata(key)
          }
          if (val === undefined) {
            return that
          }
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
        urlencoded(key, val = undefined) {
          if (T.obj(key)) {
            return this.setUrlencoded(key)
          }
          if (val === undefined) {
            return that
          }
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

  window.Api.prototype.send = function (closure = null) {
    return _send.call(this.load(), closure)
  }
  window.Api.prototype.get = function (closure = null) {
    return _send.call(this.load().method('get'), closure)
  }
  window.Api.prototype.post = function (closure = null) {
    return _send.call(this.load().method('post'), closure)
  }
  window.Api.prototype.put = function (closure = null) {
    return _send.call(this.load().method('put'), closure)
  }
  window.Api.prototype.delete = function (closure = null) {
    return _send.call(this.load().method('delete'), closure)
  }
  window.Api.prototype.del = function (closure = null) {
    return _send.call(this.load().method('delete'), closure)
  }
})();