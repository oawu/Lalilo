/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  if (typeof window.App != 'undefined') { return }
  if (typeof window.Bridge == 'undefined') {
    window.Bridge = { type: 'Web' }
  }

  if (window.Bridge.type == 'iOS') {
    console.error = (...data) => data.forEach(val => window.webkit.messageHandlers['console.error'].postMessage(window.App._toStr(val)))
    console.log = (...data) => data.forEach(val => window.webkit.messageHandlers['console.log'].postMessage(window.App._toStr(val)))
  }

  const _vaild = struct => {
    if (!window.App._T.obj(struct)) { return undefined }
    if (!window.App._T.str(struct.name)) { return undefined }
    return struct
  }
  const _emitStr = cmd => {
    if (!(cmd instanceof window.App._CMD)) {
      return new Error('類型錯誤')
    }

    if (!window.App._T.func(cmd._vaild)) {
      return new Error('沒有驗證的方法')
    }

    const vaild = cmd._vaild()

    if (vaild instanceof Error) {
      return vaild
    }

    if (!window.App._T.func(cmd._struct)) {
      return new Error('沒有轉換 Struct 的方法')
    }

    const struct = _vaild(cmd._struct())

    if (struct === undefined) {
      return new Error('Struct 格式有誤')
    }

    let str = null
    try {
      str = JSON.stringify(struct)
    } catch (e) {
      str = e
    }

    if (str instanceof Error) {
      return new Error(`轉換 Json 時發生錯誤，錯誤原因：${str.message}`)
    }

    return window.App._T.str(str)
      ? str
      : new Error(`轉換 Json 時發生錯誤，錯誤原因：轉出格式不是字串`)
  }
  const _emit = str => {
    if (window.Bridge.type == 'Web') {
      window.App._T.func(window.App.$.EMU) && window.App.$.EMU(str)
      return null
    }

    if (window.Bridge.type == 'iOS') {
      window.webkit.messageHandlers['emit'].postMessage(str)  
      return null
    }
  }

  const App = {
    $: {},

    get isWeb () {
      return window.Bridge.type == 'Web'
    }
  }
  App._T = {
    arr:   v => Array.isArray(v),
    bool:  v => typeof v == 'boolean',
    num:   v => typeof v == 'number' && !isNaN(v) && v !== Infinity,
    str:   v => typeof v == 'string',
    neStr: v => typeof v == 'string' && v !== '',
    obj:   v => typeof v == 'object' && v !== null && !Array.isArray(v),
    func:  v => typeof v == 'function',
    url:   v => {
      if (typeof v != 'string' && v !== '') { return false }
      try {
        const url = new URL(v)
        return url.protocol === 'http:' || url.protocol === 'https:'
      } catch (err) { return false }
    }
  }

  App._toStr = t => {
    if (App._T.num(t)) {
      return `${t}`
    }
    if (App._T.bool(t)) {
      return `${t ? 'true' : 'false'}`
    }
    if (App._T.str(t)) {
      return `"${t}"`
    }
    if (App._T.func(t)) {
      return '()=>{}'
    }
    if (Array.isArray(t)) {
      return JSON.stringify(t)
    }
    if (App._T.obj(t)) {
      return JSON.stringify(t)
    }
    if (t === null) {
      return 'null'
    }
    if (t === undefined) {
      return 'undefined'
    }
    return ''
  }

  App._Exec = {
    emit: (key, app, _loc) => {
      if (!App._T.str(key)) { return }
      if (!App._T.func(App.$.Action)) { return }
      if (!App._T.obj(App.$.Action.On)) { return }

      let loc = undefined
      try {
        loc = JSON.parse(_loc)
      } catch (e) {
        loc = undefined
      }

      const _closures = App.$.Action.On.getFuncs(key)
      const closures = Array.isArray(_closures) ? _closures : []
      for (const closure of closures) {
        setTimeout(_ => closure.call(null, app, loc))
      }
    },
    func: (id, param = undefined) => {
      if (!(App._T.num(id) && id > 0)) { return }
      if (!App._T.func(App.$.Action)) { return }
      if (!App._T.func(App.$.Action.Func)) { return }

      const obj = App.$.Action.Func.Map.get(id)

      if (!(obj instanceof App.$.Action.Func)) { return }
      if (obj._.id !== id) { return }

      const isOnce = App._T.bool(obj._.isOnce) ? obj._.isOnce : false

      if (isOnce) {
        App.$.Action.Func.Map.delete(id)
      }

      if (App._T.func(obj._.func)) {
        obj._.func(param)
      }
    },
  }

  App._CP = (closure, promiseFunc) => {
    if (!App._T.func(closure)) {
      return new Promise(promiseFunc)
    }

    let resolve = data => {
      if (!App._T.func(closure)) {
        return
      }
      let func = closure
      closure = null
      func(data)
    }
    let reject = error => {
      if (!App._T.func(closure)) {
        return
      }
      let func = closure
      closure = null
      func(error)
    }
    promiseFunc(resolve, reject)
  }

  App._CMD = function(name) {
    if (!(this instanceof App._CMD)) {
      return new App._CMD(name)
    }

    this._ = null

    this.$ = {
      name: App._T.str(name) ? name : undefined,
      struct: undefined,
      completion: undefined,
    }
  }
  App._CMD.prototype._vaild = function() {
    return App._T.str(this.$.name) ? null : new Error('name 必須要為字串')
  }
  App._CMD.prototype._struct = function() {
    const completion = this.$.completion instanceof App._CMD
      && App._T.func(this.$.completion._vaild)
      && this.$.completion._vaild() === null
      && App._T.func(this.$.completion._struct)
        ? this.$.completion._struct()
        : undefined

    return {
      name: this.$.name,
      struct: this.$.struct,
      completion: _vaild(completion)
    }
  }
  App._CMD.prototype.completion = function(val, ...data) {
    if (!(val instanceof App._CMD)) {
      if (App._T.func(val) && App._T.func(App.$.Action) && App._T.func(App.$.Action.Func)) {
        val = App.$.Action.Func(val, ...data)
      }

      if (App._T.str(val) && App._T.func(App.$.Action) && App._T.func(App.$.Action.Emit)) {
        val = App.$.Action.Emit(val, ...data)
      }
    }

    if (val instanceof App._CMD) {
      this.$.completion = val
    }

    return this
  }

  App._CMD.prototype.emit = function(result = undefined) {
    let str = _emitStr(this)
    str = str instanceof Error ? str : _emit(str)
    App._T.func(result) && result(str)
    return this
  }

  window.App = App
})()
