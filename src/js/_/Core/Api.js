/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

// Api
const Api = function(url) {
  if (!(this instanceof Api)) {
    return new Api(url)
  }

  this._url = ''
  this._method = 'GET'
  this._header = {}

  this._befores = []
  this._dones = []
  this._fails = []
  this._afters = []
  this._progresses = []

  this._query = null
  this._raw = null
  this._form = null
  this._file = null

  this.url(url)
  this.method('get')
}
Api.prototype.url = function(url) {
  if (typeof url == 'string') {
    this._url = url
  }
  return this
}
Api.prototype.query = function(key, val = null) {
  if (typeof key == 'object' && key !== null && !Array.isArray(key)) {
    this._query = key
  } else if (typeof key == 'string') {
    if (this._query === null) {
      this._query = {}
    }
    this._query[key] = val
  }
  return this
}
Api.prototype.raw = function(val) {
  if (typeof val == 'object' && val !== null) {
    this._raw = val
  } else if (typeof val == 'string') {
    if (this._raw === null) {
      this._raw = ''
    }
    this._raw = val
  }
  return this
}
Api.prototype.form = function(key, val = null) {
  if (typeof key == 'object' && key !== null && !Array.isArray(key)) {
    this._form = key
  } else if (typeof key == 'string') {
    if (this._form === null) {
      this._form = {}
    }
    this._form[key] = val
  }
  return this
}
Api.prototype.file = function(key, val = null) {
  if (typeof key == 'object' && key !== null && !Array.isArray(key)) {
    this._file = key
  } if (typeof key == 'string' && typeof val == 'object' && val !== null && !Array.isArray(val) && val instanceof File) {
    if (this._file === null) {
      this._file = {}
    }
    this._file[key] = val
  }
  return this
}
Api.prototype.method = function(method) {
  if (typeof method != 'string') {
    return this
  }

  method = method.toUpperCase()

  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(method)) {
    return this
  }

  this._method = method
  return this
}
Api.prototype.header = function(key, val) {
  if (typeof key == 'string') {
    this._header[key] = val
  }
  return this
}
Api.prototype.before = function(before) {
  typeof before == 'function' && this._befores.push(before)
  return this
}
Api.prototype.done = function(done) {
  typeof done == 'function' && this._dones.push(done)
  return this
}
Api.prototype.fail = function(fail) {
  typeof fail == 'function' && this._fails.push(fail)
  return this
}
Api.prototype.after = function(after) {
  typeof after == 'function' && this._afters.push(after)
  return this
}
Api.prototype.progress = function(progress) {
  typeof progress == 'function' && this._progresses.push(progress)
  return this
}
Api.prototype.auth = function(token) {
  return this.header('Authorization', `Bearer ${token}`)
}

Api.prototype.send = function() {
  let method = this._method.toUpperCase()

  let option = {
    url: this._url + (this._query !== null ? `?${$.param(this._query)}` : ''),
    type: method,
    headers: this._header,
    beforeSend: (...data) => this._befores.forEach(before => before(...data))
  }

  if (this._progresses.length) {
    option.xhr = _ => {
      let xhr = $.ajaxSettings.xhr()
      xhr.upload.onprogress = e => {
        e = Math.floor(e.loaded / e.total *100)
        this._progresses.forEach(progress => progress(e))
      }
      return xhr
    }
  }

  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    if (this._raw !== null) {
      option.processData = false

      if (typeof this._raw == 'object') {
        option.contentType = 'application/json'
        option.data = JSON.stringify(this._raw)
      } else {
        option.contentType = 'text/plain'
        option.data = `${this._raw}`
      }
    } else {
      let data = {}
      if (this._file !== null) {
        option.processData = false
        option.contentType = false

        data = new FormData()
        for (let key in this._file) {
          data.append(key, this._file[key])
        }
      }

      if (this._form !== null) {
        if (data instanceof FormData) {
          for (let key in this._form) {
            data.append(key, this._form[key])
          }
        } else {
          option.contentType = 'application/x-www-form-urlencoded'
          data = $.param(this._form)
        }
      }

      option.data = data
    }
  }

  $.ajax(option)
  .done((...datas) => this._dones.forEach(done => done(...datas)))
  .fail(({ status: code, responseJSON = null }) => {
    if (!(typeof responseJSON == 'object' && responseJSON !== null && !Array.isArray(responseJSON))) {
      responseJSON = {}
    }
    if (typeof responseJSON.message == 'string' && !Array.isArray(responseJSON.messages)) {
     responseJSON.messages = [responseJSON.message]
    }
    if (!Array.isArray(responseJSON.messages)) {
      responseJSON.messages = ['請工程師排查此狀況！']
    }

    const err = Api.Error(code, responseJSON.messages)
    this._fails.forEach(fail => fail(err))
  })
  .complete((...data) => this._afters.forEach(after => after(...data)))

  return this
}
Api.Error = function(status, messages) {
  if (!(this instanceof Api.Error)) {
    return new Api.Error(status, messages)
  }

  this._status = status
  this._messages = messages
}
Api.Error.prototype = Object.create(Error.prototype)

Object.defineProperty(Api.Error.prototype, 'status', { get () { return this._status } })
Object.defineProperty(Api.Error.prototype, 'messages', { get () { return this._messages } })

Api.GET    = url => Api(url).method('get')
Api.POST   = url => Api(url).method('post')
Api.PUT    = url => Api(url).method('put')
Api.DELETE = url => Api(url).method('delete')
