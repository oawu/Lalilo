/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

if (typeof window.Bridge == 'undefined') {
  window.Bridge = { type: 'Web' }
} else {
  if (window.Bridge.type == 'iOS') {
    console.error = (...data) => window.webkit.messageHandlers['console.error'].postMessage(data)  
    console.log = (...data) => window.webkit.messageHandlers['console.log'].postMessage(data)  
  }
}

const App = function(type, ...completion) {
  if (!(this instanceof App)) {
    return new App(type)
  }
  this.__type = type
  this.__completion = null
  this.__feedback = null
  this.completion(...completion)
}

App._FeedbackEnum = ['light', 'heavy', 'medium', 'soft', 'rigid', 'error', 'success', 'warning']
App._ActionEmitGoalEnum = ['self', 'prev', 'each']
App._NavBarAppearance = ['show', 'auto']
App._TabBarAppearance = ['show', 'auto']

App.prototype.feedback = function(val) {
  if (!(val instanceof App.Feedback)) {
    val = App.Feedback(val)
  }
  if (val instanceof App.Feedback) {
    this.__feedback = val
  }
  return this
}
App.prototype.completion = function(val, ...data) {
  if (!(val instanceof App)) {
    val = App.Action(val, ...data)
  }

  if (val instanceof App) {
    this.__completion = val
  }

  return this
}
App.JsonKeyName = 'jsonStr'

Object.defineProperty(App.prototype, App.JsonKeyName, { get () {
  return {
    type: this.__type,
    struct: null,
    completion: this.__completion instanceof App ? this.__completion[App.JsonKeyName] : null,
    feedback: this.__feedback instanceof App.Feedback ? this.__feedback[App.JsonKeyName] : null,
    done: null
  }
} })

App.prototype.emit = function(...done) {
  App.Bridge.emit(this, ...done)
  return this
}

App.emits = (apps, ...data) => App.Bridge.emits(apps, ...data)

Object.defineProperty(App, 'isWeb', {
  get () {
    return window.Bridge.type == 'Web'
  }
})


// ======== App._D
  App._D = function(timer = null, food = undefined, watch = _ => _ === undefined) {
    if (!(this instanceof App._D)) {
      return new App._D(timer, food, watch)
    }

    this._food = food
    this._watch = t => t !== undefined
    this._timer = 0
    this._biteFunc = null

    this.watch(watch)
    this.timer(timer)
  }

  Object.defineProperty(App._D.prototype, 'eat', {
    get () {
      const that = this
      return (function (...foods) {
        that._food = foods
        return that
      }).bind(this)
    }
  })

  App._D.prototype.watch = function(watch) {
    if (typeof watch == 'function') {
      this._watch = watch
    }

    return this
  }
  App._D.prototype.timer = function(timer) {
    if (typeof timer == 'number' && !isNaN(timer) && timer !== Infinity) {
      this._timer = timer
    }

    return this
  }
  App._D.prototype.bite = function(biteFunc) {
    this._biteFunc = biteFunc

    const _wait = _ => {
      if (typeof this._watch == 'function' ? this._watch(this._food) : false) {
        return setTimeout(_wait, this._timer)
      }

      if (typeof this._biteFunc == 'function') {
        this._biteFunc(...this._food)
      }
    }

    _wait()
    return this
  }

// ======== App._T
  App._T = {
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

// ======== App.Bridge
  App.Bridge = {
    $: {
      _: new Map(),
      funcs: [],
      getFuncs (key) {
        if (!App._T.neStr(key)) {
          return []
        }
        let funcs = App.Bridge.$._.get(key)
        return Array.isArray(funcs)
          ? funcs.filter(App._T.func)
          : []
      },
      setFuncs (key, funcs) {
        if (!App._T.neStr(key)) {
          return App.Bridge.$
        }

        funcs = Array.isArray(funcs) ? funcs.filter(App._T.func) : []

        App.Bridge.$._.set(key, funcs)

        if (funcs.length) {
          App.Bridge.$.funcs.forEach(func => App._T.func(func) && func(App.Bridge))
          return App.Bridge.$
        }
        App.Bridge.$._.delete(key)
        App.Bridge.$.funcs.forEach(func => App._T.func(func) && func(App.Bridge))
        return App.Bridge.$
      },
      setFunc (key, func) {
        if (App._T.neStr(key) && App._T.func(func)) {
          const funcs = App.Bridge.$.getFuncs(key)
          funcs.push(func)
          App.Bridge.$.setFuncs(key, funcs)
        }

        return App.Bridge.$
      },
      get keys () {
        const keys = []
        for (let [key, _] of App.Bridge.$._) {
          if (App._T.neStr(key)) {
            keys.push(key)
          }
        }
        return keys
      },
      get vals () {
        return App.Bridge.$.keys.map(App.Bridge.$.getFuncs).reduce((a, b) => a.concat(b), [])
      },
      get struct () {
        return App.Bridge.$.keys.map(key => ({ key, funcs: App.Bridge.$.getFuncs(key) }))
      },
      subscribe (func) {
        if (App._T.func(func)) {
          App.Bridge.$.funcs.push(func)
        }
        return App.Bridge.$
      },
    },

    del (key = undefined, func = undefined) {
      if (!App._T.neStr(key)) { // 全刪
        App.Bridge.$.keys.map(key => App.Bridge.$.setFuncs(key, []))
        App.Bridge.$._ = new Map()
        return App.Bridge
      }

      if (!App._T.func(func)) {
        App.Bridge.$.setFuncs(key, [])
        return App.Bridge
      }

      const funcs = App.Bridge.get(key)
      if (funcs.includes(func)) {
        const i = funcs.indexOf(func)
        if (i != -1) {
          funcs.splice(i, 1)
        }
      }

      App.Bridge.$.setFuncs(key, funcs)
      return App.Bridge
    },
    get (key) {
      return App.Bridge.$.getFuncs(key)
    },
    on (key, func) {
      App.Bridge.$.setFunc(key, func)
      return App.Bridge
    },


    _emitIos (params) {
      if (params instanceof Error) {
        window.webkit.messageHandlers['logger'].postMessage(`${params.message}`)
      } else {
        window.webkit.messageHandlers['emit'].postMessage(params)  
      }
      return App.Bridge
    },
    _emitWeb (params) {
      if (params instanceof Error) {
        console.log(`${params.message}`)
      } else {

        try {
          params = JSON.parse(params)
        } catch (e) {
          params = e
        }

        if (params instanceof Error) {
          return console.error(`轉換 Json 時發生錯誤，錯誤原因：${error.message}`)
        }

        if (!App._T.obj(params)) {
          return console.error(`格是不是 Json`)
        }

        App.Emu(params)
      }
      return App.Bridge
    },
    _emit (app, done = null, ...data) {
      if (!(app instanceof App)) {
        return null
      }

      const struct = app[App.JsonKeyName]

      if (struct == null || struct === undefined) {
        return null
      }

      done = done instanceof App
        ? done
        : App.Action(done, ...data)

      struct.done = done ? done[App.JsonKeyName] : null

      let params = null
      try {
        params = JSON.stringify(struct)
      } catch (e) {
        params = e
      }

      return params
    },
    emit (app, ...done) {
      const params = App.Bridge._emit(app, ...done)
      // console.error(params);
      
      if (params === null) {
        return App.Bridge
      }
        
      if (window.Bridge === undefined) {
        return App.Bridge
      }

      if (window.Bridge.type == 'iOS') {
        return App.Bridge._emitIos(params)
      }

      if (window.Bridge.type == 'Web') {
        return App.Bridge._emitWeb(params)
      }

      return App.Bridge
    },
    emits (apps, done = null, ...data) {
      done = done instanceof App
        ? done
        : App.Action(done, ...data)

      const dog = App._D().bite(food => {
        if (food instanceof Error) {
          return console.error(food)
        }

        if (done === null) {
          return
        }

        App.Bridge.emit(done)
      })

      Promise.all((Array.isArray(apps) ? apps : [apps]).map(app => new Promise((resolve, _) => App.Bridge.emit(app, _ => resolve()))))
        .then(dog.eat)
        .catch(dog.eat)

      return App.Bridge
    },
    Exec: {
      emit: (key, params, _param) => {

        let param = undefined
        try {
          param = JSON.parse(_param)
        } catch (e) {
          param = undefined
        }

        if (!App._T.neStr(key)) { return }

        const closures = App.Bridge.$.getFuncs(key)
      
        if (!(Array.isArray(closures) && closures.length > 0)) { return }

        closures.forEach(closure => setTimeout(_ => closure.call(null, params, param)))
      },
      func: (id, params) => {
        if (!App._T.num(id)) { return }

        const obj = App.Action.Func.Map.get(id)
        if (!(obj instanceof App.Action.Func)) { return }
        if (obj._id !== id) { return }

        if (!(App._T.bool(obj._isKeep) ? obj._isKeep : false)) {
          App.Action.Func.Map.delete(id)
        }
        if (!App._T.func(obj._func)) { return }

        obj._func(params)
      },
    }
  }

// ======== App.Log
  App.Log = function (...data) {
    if (!(this instanceof App.Log)) {
      return (new App.Log(...data)).emit()
    }
    App.call(this, 'App.Log')
    this._data = []
    this.data(...data)
  }
  App.Log.prototype = Object.create(App.prototype)
  App.Log.prototype.data = function(...vals) {
    this._data = vals
    return this
  }
  Object.defineProperty(App.Log.prototype, App.JsonKeyName, { get () {
    const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)
    parent.struct = Array.isArray(this._data) ? this._data.map(t => {
      if (App._T.str(t)) {
        return `${t}`
      }
      if (App._T.num(t)) {
        return `${t}`
      }
      if (App._T.bool(t)) {
        return `${t}`
      }
      if (App._T.func(t)) {
        return '()=>{}'
      }
      if (Array.isArray(t)) {
        return '[…]'
      }
      if (App._T.obj(t)) {
        return '{…}'
      }
      if (t === null) {
        return 'null'
      }
    }) : []
    return parent
  } })
  

// ======== App.Feedback
  App.Feedback = function(style, ...completion) {
    if (!(this instanceof App.Feedback)) {
      return new App.Feedback(style, ...completion)
    }

    App.call(this, 'App.Feedback', ...completion)
    
    this._style = null
    this.style(style)
  }
  App.Feedback.prototype = Object.create(App.prototype)
  App.Feedback.prototype.style = function(val) {
    if (App._T.neStr(val) && App._FeedbackEnum.includes(val)) {
      this._style = val
    }
    return this
  }
  Object.defineProperty(App.Feedback.prototype, App.JsonKeyName, { get () {
    const style = this._style
    
    if (!(App._T.neStr(style) && App._FeedbackEnum.includes(style))) {
      return null
    }

    const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)
    parent.struct = style
    return parent
  } })

  // ======== App.Feedback.Light
    App.Feedback.Light = function(...completion) {
      if (this instanceof App.Feedback.Light) {
        App.Feedback.call(this, 'light', ...completion)
      } else {
        return new App.Feedback.Light(...completion)
      }
    }
    App.Feedback.Light.prototype = Object.create(App.Feedback.prototype)

  // ======== App.Feedback.Heavy
    App.Feedback.Heavy = function(...completion) {
      if (this instanceof App.Feedback.Heavy) {
        App.Feedback.call(this, 'heavy', ...completion)
      } else {
        return new App.Feedback.Heavy(...completion)
      }
    }
    App.Feedback.Heavy.prototype = Object.create(App.Feedback.prototype)

  // ======== App.Feedback.Medium
    App.Feedback.Medium = function(...completion) {
      if (this instanceof App.Feedback.Medium) {
        App.Feedback.call(this, 'medium', ...completion)
      } else {
        return new App.Feedback.Medium(...completion)
      }
    }
    App.Feedback.Medium.prototype = Object.create(App.Feedback.prototype)

  // ======== App.Feedback.Soft
    App.Feedback.Soft = function(...completion) {
      if (this instanceof App.Feedback.Soft) {
        App.Feedback.call(this, 'soft', ...completion)
      } else {
        return new App.Feedback.Soft(...completion)
      }
    }
    App.Feedback.Soft.prototype = Object.create(App.Feedback.prototype)

  // ======== App.Feedback.Rigid
    App.Feedback.Rigid = function(...completion) {
      if (this instanceof App.Feedback.Rigid) {
        App.Feedback.call(this, 'rigid', ...completion)
      } else {
        return new App.Feedback.Rigid(...completion)
      }
    }
    App.Feedback.Rigid.prototype = Object.create(App.Feedback.prototype)

  // ======== App.Feedback.Error
    App.Feedback.Error = function(...completion) {
      if (this instanceof App.Feedback.Error) {
        App.Feedback.call(this, 'error', ...completion)
      } else {
        return new App.Feedback.Error(...completion)
      }
    }
    App.Feedback.Error.prototype = Object.create(App.Feedback.prototype)

  // ======== App.Feedback.Success
    App.Feedback.Success = function(...completion) {
      if (this instanceof App.Feedback.Success) {
        App.Feedback.call(this, 'success', ...completion)
      } else {
        return new App.Feedback.Success(...completion)
      }
    }
    App.Feedback.Success.prototype = Object.create(App.Feedback.prototype)

  // ======== App.Feedback.Warning
    App.Feedback.Warning = function(...completion) {
      if (this instanceof App.Feedback.Warning) {
        App.Feedback.call(this, 'warning', ...completion)
      } else {
        return new App.Feedback.Warning(...completion)
      }
    }
    App.Feedback.Warning.prototype = Object.create(App.Feedback.prototype)

  // ======== App.Feedback.Light
    App.Feedback.Light = function(...completion) {
      if (this instanceof App.Feedback.Light) {
        App.Feedback.call(this, 'light', ...completion)
      } else {
        return new App.Feedback.Light(...completion)
      }
    }
    App.Feedback.Light.prototype = Object.create(App.Feedback.prototype)

  // ======== App.Feedback.Heavy
    App.Feedback.Heavy = function(...completion) {
      if (this instanceof App.Feedback.Heavy) {
        App.Feedback.call(this, 'heavy', ...completion)
      } else {
        return new App.Feedback.Heavy(...completion)
      }
    }
    App.Feedback.Heavy.prototype = Object.create(App.Feedback.prototype)

  // ======== App.Feedback.Medium
    App.Feedback.Medium = function(...completion) {
      if (this instanceof App.Feedback.Medium) {
        App.Feedback.call(this, 'medium', ...completion)
      } else {
        return new App.Feedback.Medium(...completion)
      }
    }
    App.Feedback.Medium.prototype = Object.create(App.Feedback.prototype)

  // ======== App.Feedback.Soft
    App.Feedback.Soft = function(...completion) {
      if (this instanceof App.Feedback.Soft) {
        App.Feedback.call(this, 'soft', ...completion)
      } else {
        return new App.Feedback.Soft(...completion)
      }
    }
    App.Feedback.Soft.prototype = Object.create(App.Feedback.prototype)

  // ======== App.Feedback.Rigid
    App.Feedback.Rigid = function(...completion) {
      if (this instanceof App.Feedback.Rigid) {
        App.Feedback.call(this, 'rigid', ...completion)
      } else {
        return new App.Feedback.Rigid(...completion)
      }
    }
    App.Feedback.Rigid.prototype = Object.create(App.Feedback.prototype)

  // ======== App.Feedback.Error
    App.Feedback.Error = function(...completion) {
      if (this instanceof App.Feedback.Error) {
        App.Feedback.call(this, 'error', ...completion)
      } else {
        return new App.Feedback.Error(...completion)
      }
    }
    App.Feedback.Error.prototype = Object.create(App.Feedback.prototype)

  // ======== App.Feedback.Success
    App.Feedback.Success = function(...completion) {
      if (this instanceof App.Feedback.Success) {
        App.Feedback.call(this, 'success', ...completion)
      } else {
        return new App.Feedback.Success(...completion)
      }
    }
    App.Feedback.Success.prototype = Object.create(App.Feedback.prototype)

  // ======== App.Feedback.Warning
    App.Feedback.Warning = function(...completion) {
      if (this instanceof App.Feedback.Warning) {
        App.Feedback.call(this, 'warning', ...completion)
      } else {
        return new App.Feedback.Warning(...completion)
      }
    }
    App.Feedback.Warning.prototype = Object.create(App.Feedback.prototype)


// ======== App.SqlLite
  App.SqlLite = function(table = null) {
    return new App.SqlLite.Builder(table)
  }

  // ======== App.SqlLite._where
    App.SqlLite._where = (key, ...vals) => {
      if (App._T.num(key)) {
        return { key: 'id=?', vals: [key] }
      }
      const arr = len => Array.from(Array(len).keys()).map(_ => '?').join(',')

      if (Array.isArray(key)) {
        return {
          key: `id IN (${arr(key.length)})`,
          vals: key
        }
      }

      if (!App._T.neStr(key)) {
        return null
      }

      if (vals.length == 0) {
        return {
          key,
          vals: []
        }
      }

      if (vals.length == 1) {
        if (Array.isArray(vals[0])) {
          return {
            key: `${key} IN (${arr(vals[0].length)})`,
            vals: vals[0]
          }
        }
        if (vals[0] === null) {
          return {
            key: `${key} IS NULL`,
            vals: []
          }
        }

        return {
          key: `${key}=?`,
          vals: [vals[0]]
        }
      }

      if (vals.length == 2) {
        if (Array.isArray(vals[1])) {
          return {
            key: `${key}${vals[0]}(${arr(vals[1].length)})`,
            vals: vals[1]
          }
        }

        return {
          key: `${key}${vals[0]}?`,
          vals: [vals[1]]
        }
      }

      return null
    }
  // ======== App.SqlLite._typeAndVal
    App.SqlLite._typeAndVal = (val) => {
      if (App._T.str(val)) {
        return { type: 'str', val: val }
      }
      if (App._T.num(val)) {
        return { type: Number(val) === val && val % 1 === 0 ? 'int' : 'double', val: val }
      }

      return { type: 'null' }
    }
  // ======== App.SqlLite._typeAndVal
    App.SqlLite._callback_or_promise = (obj, closure, promiseFunc) => {
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
      return obj
    }
  // ======== App.SqlLite._timeout
    App.SqlLite._timeout = (obj, closure, sqlFunc, time = 0) => {
      return App.SqlLite._callback_or_promise(this, closure, (resolve, reject) => {
        if (time <= 0) {
          const app = sqlFunc(err => {
            if (err instanceof Error) {
              reject(err)
            } else {
              resolve(err)
            }
          })

          if (!App._T.func(app._vaild)) {
            return reject(new Error(`資料格式錯誤`))
          }

          const error = app._vaild()
          if (error !== '') {
            return reject(new Error(`資料格式錯誤，${error}`))
          }

          app.emit()
          return
        }

        let isFinished = false
        let timer = null

        const app = sqlFunc(err => {
          isFinished = true

          clearTimeout(timer)
          timer = null

          if (err instanceof Error) {
            reject(err)
          } else {

            resolve(err)
          }
        })

        if (!App._T.func(app._vaild)) {
          isFinished = true

          clearTimeout(timer)
          timer = null

          return reject(new Error(`資料格式錯誤`))
        }

        const error = app._vaild()
        if (error !== '') {
          isFinished = true

          clearTimeout(timer)
          timer = null

          return reject(new Error(`資料格式錯誤，${error}`))
        }

        timer = setTimeout(_ => isFinished || reject(new Error('Timeout')), time)
        app.emit()
      })
    }
  
  // ======== App.SqlLite.TableExec
    App.SqlLite.TableExec = function(sql, vals = undefined, ...completion) {
      if (!(this instanceof App.SqlLite.TableExec)) {
        return new App.SqlLite.TableExec(sql, vals, ...completion)
      }

      App.call(this, 'App.SqlLite.TableExec', ...completion)
      this._sql = ''
      this._vals = []

      this.sql(sql)
      this.vals(vals)
    }
    App.SqlLite.TableExec.prototype = Object.create(App.prototype)
    App.SqlLite.TableExec.prototype.sql = function(val) {
      if (App._T.neStr(val)) {
        this._sql = val
      }
      return this
    }
    App.SqlLite.TableExec.prototype.vals = function(...vals) {
      this._vals = []
      return this.val(...vals)
    }
    App.SqlLite.TableExec.prototype.val = function(...vals) {
      for (const val of vals) {
        if (Array.isArray(val)) {
          this.val(...val)
        } else {
          if (App._T.num(val)) {
            this._vals.push(val)
          } else if (App._T.str(val)) {
            this._vals.push(val)
          } else if (val === null) {
            this._vals.push(null)
          }
        }
      }
      
      return this
    }
    App.SqlLite.TableExec.prototype._vaild = function() {
      const sql = this._sql

      if (!App._T.neStr(sql)) {
        return `SQL 必須為非空字串`
      }

      return ''
    }
    Object.defineProperty(App.SqlLite.TableExec.prototype, App.JsonKeyName, { get () {
      if (this._vaild() !== '') {
        return null
      }

      const sql  = this._sql
      const vals = Array.isArray(this._vals) ? this._vals.map(val => App.SqlLite._typeAndVal(val)) : []
      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

      parent.struct = {
        sql,
        vals
      }

      return parent
    } })
  // ======== App.SqlLite.TableCreate
    App.SqlLite.TableCreate = function(table, columns = {}, ...completion) {
      if (!(this instanceof App.SqlLite.TableCreate)) {
        return new App.SqlLite.TableCreate(table, columns, ...completion)
      }

      App.call(this, 'App.SqlLite.TableCreate')
      
      this._table = null
      this._ifNotExists = true
      this._columns = null

      this.table(table)
      this.ifNotExists(true)
      this.columns(columns)
    }
    App.SqlLite.TableCreate.prototype = Object.create(App.prototype)
    App.SqlLite.TableCreate.prototype.table = function(val) {
      if (App._T.neStr(val)) {
        this._table = val
      }
      return this
    }
    App.SqlLite.TableCreate.prototype.ifNotExists = function(val) {
      if (App._T.bool(val)) {
        this._ifNotExists = val
      }
      return this
    }
    App.SqlLite.TableCreate.prototype.columns = function(val) {
      if (App._T.obj(val)) {
        for (const key in val) {
          this.column(key, val[key])
        }
      }
      return this
    }
    App.SqlLite.TableCreate.prototype.column = function(key, val) {
      if (App._T.neStr(key) && App._T.neStr(val)) {
        if (!App._T.obj(this._columns)) {
          this._columns = {}
        }

        this._columns[key] = val
      }
      return this
    }
    App.SqlLite.TableCreate.prototype._vaild = function() {
      const table = this._table

      if (!App._T.neStr(table)) {
        return `Table 必須為非空字串`
      }

      const _columns = App._T.obj(this._columns) ? this._columns : {}

      const columns = []
      for (const key in _columns) {
        const val = _columns[key]
        if (App._T.neStr(key) && App._T.neStr(val)) {
          columns.push(`${key} ${val}`)
        }
      }

      if (columns.length <= 0) {
        return `至少需要欄位一個`
      }


      return ''
    }
    Object.defineProperty(App.SqlLite.TableCreate.prototype, App.JsonKeyName, { get () {
      if (this._vaild() !== '') {
        return null
      }

      const table = this._table
      const ifNotExists = App._T.bool(this._ifNotExists) ? this._ifNotExists : true
      const _columns = App._T.obj(this._columns) ? this._columns : {}

      const columns = []
      for (const key in _columns) {
        const val = _columns[key]
        if (App._T.neStr(key) && App._T.neStr(val)) {
          columns.push(`${key} ${val}`)
        }
      }

      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

      const strs = ['CREATE', 'TABLE']

      if (ifNotExists) {
        strs.push('IF NOT EXISTS')
      }

      strs.push(this._table)
      strs.push(`(${columns.join(',')})`)

      parent.struct = {
        sql: `${strs.join(' ')};`,
        vals: []
      }

      return parent
    } })
  // ======== App.SqlLite.TableList
    App.SqlLite.TableList = function(...completion) {
      if (this instanceof App.SqlLite.TableList) {
        App.call(this, 'App.SqlLite.TableList', ...completion)
      } else {
        return new App.SqlLite.TableList(...completion)
      }
    }
    App.SqlLite.TableList.prototype = Object.create(App.prototype)
    App.SqlLite.TableList.prototype._vaild = function() {
      return ''
    }

  // ======== App.SqlLite.TableDrop
    App.SqlLite.TableDrop = function(table, ...completion) {
      if (!(this instanceof App.SqlLite.TableDrop)) {
        return new App.SqlLite.TableDrop(table, ...completion)
      }

      App.call(this, 'App.SqlLite.TableDrop', ...completion)
      this._table = null
      this.table(table)
    }
    App.SqlLite.TableDrop.prototype = Object.create(App.prototype)
    App.SqlLite.TableDrop.prototype.table = function(val) {
      if (App._T.neStr(val)) {
        this._table = val
      }
      return this
    }
    App.SqlLite.TableDrop.prototype._vaild = function() {
      const table = this._table

      if (!App._T.neStr(table)) {
        return `Table 必須為非空字串`
      }

      return ''
    }
    Object.defineProperty(App.SqlLite.TableDrop.prototype, App.JsonKeyName, { get () {
      if (this._vaild() !== '') {
        return null
      }

      const table = this._table

      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)
      
      const strs = ['DROP', 'TABLE', 'IF EXISTS', table]
      parent.struct = {
        sql: `${strs.join(' ')};`,
        vals: []
      }

      return parent
    } })
  // ======== App.SqlLite.TableClear
    App.SqlLite.TableClear = function(table, ...completion) {
      if (!(this instanceof App.SqlLite.TableClear)) {
        return new App.SqlLite.TableClear(table, ...completion)
      }

      App.call(this, 'App.SqlLite.TableClear', ...completion)
      this._table = null
      this.table(table)
    }
    App.SqlLite.TableClear.prototype = Object.create(App.prototype)
    App.SqlLite.TableClear.prototype.table = function(val) {
      if (App._T.neStr(val)) {
        this._table = val
      }
      return this
    }
    App.SqlLite.TableClear.prototype._vaild = function() {
      const table = this._table

      if (!App._T.neStr(table)) {
        return `Table 必須為非空字串`
      }

      return ''
    }
    Object.defineProperty(App.SqlLite.TableClear.prototype, App.JsonKeyName, { get () {
      if (this._vaild() !== '') {
        return null
      }

      const table = this._table
      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)
      parent.struct = {
        table
      }

      return parent
    } })

  // ======== App.SqlLite.TableInsert
    App.SqlLite.TableInsert = function(table, param, ...completion) {
      if (!(this instanceof App.SqlLite.TableInsert)) {
        return new App.SqlLite.TableInsert(table, param, ...completion)
      }

      App.call(this, 'App.SqlLite.TableInsert', ...completion)
      this._table = null
      this._param = null
      this.table(table)
      this.param(param)
    }
    App.SqlLite.TableInsert.prototype = Object.create(App.prototype)
    App.SqlLite.TableInsert.prototype.table = function(val) {
      if (App._T.neStr(val)) {
        this._table = val
      }
      return this
    }
    App.SqlLite.TableInsert.prototype.param = function(val) {
      if (App._T.obj(val)) {
        this._param = val
      }
      return this
    }
    App.SqlLite.TableInsert.prototype._vaild = function() {
      const table = this._table

      if (!App._T.neStr(table)) {
        return `Table 必須為非空字串`
      }

      return ''
    }
    Object.defineProperty(App.SqlLite.TableInsert.prototype, App.JsonKeyName, { get () {
      if (this._vaild() !== '') {
        return null
      }

      const table = this._table
      const param = this._param

      const keys = []
      const ques = []
      const vals = []
      for (const key in param) {
        keys.push(key)
        ques.push('?')
        vals.push(App.SqlLite._typeAndVal(param[key]))
      }

      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)
      parent.struct = {
        sql: keys.length
          ? `INSERT INTO ${table} (id, ${keys.join(',')}) VALUES (NULL, ${ques.join(',')});`
          : `INSERT INTO ${table} (id) VALUES (NULL);`,
        vals: keys.length ? vals : []
      }

      return parent
    } })
  // ======== App.SqlLite.TableSelectAll
    App.SqlLite.TableSelectAll = function(table, ...completion) {
      if (!(this instanceof App.SqlLite.TableSelectAll)) {
        return new App.SqlLite.TableSelectAll(table, ...completion)
      }

      App.call(this, 'App.SqlLite.TableSelectAll', ...completion)
      this._table = null
      this._wheres = []
      this._select = '*'
      this._order = null
      this._limit = null
      this._offset = null

      this.table(table)
    }
    App.SqlLite.TableSelectAll.prototype = Object.create(App.prototype)

    App.SqlLite.TableSelectAll.prototype.table = function(val) {
      if (App._T.neStr(val)) {
        this._table = val
      }
      return this
    }
    App.SqlLite.TableSelectAll.prototype.where = function(key, ...vals) {
      const where = App.SqlLite._where(key, ...vals)
      if (where !== null) {
        this._wheres.push(where)
      }
      return this
    }
    App.SqlLite.TableSelectAll.prototype.select = function(...vals) {
      if (Array.isArray(vals)) {
        this._select = vals.filter(val => App._T.neStr(val)).join(',')
      }
      return this
    }
    App.SqlLite.TableSelectAll.prototype.order = function(val) {
      if (App._T.neStr(val)) {
        this._order = val
      }
      return this
    }
    App.SqlLite.TableSelectAll.prototype.limit = function(val) {
      if (App._T.num(val)) {
        this._limit = val
      }
      return this
    }
    App.SqlLite.TableSelectAll.prototype.offset = function(val) {
      if (App._T.num(val)) {
        this._offset = val
      }
      return this
    }
    App.SqlLite.TableSelectAll.prototype._vaild = function() {
      const table = this._table

      if (!App._T.neStr(table)) {
        return `Table 必須為非空字串`
      }

      return ''
    }
    Object.defineProperty(App.SqlLite.TableSelectAll.prototype, App.JsonKeyName, { get () {
      if (this._vaild() !== '') {
        return null
      }

      const table  = this._table
      const wheres = Array.isArray(this._wheres) ? this._wheres : []
      const select = App._T.neStr(this._select) ? this._select : '*'
      const order  = App._T.neStr(this._order) ? this._order : null
      const limit  = App._T.num(this._limit) ? this._limit : null
      const offset = App._T.num(this._offset) ? this._offset : null

      const whereKeys = []
      const vals = []
      for (const where of wheres) {
        whereKeys.push(where.key)
        vals.push(...where.vals.map(val => App.SqlLite._typeAndVal(val)))
      }

      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

      const strs = ['SELECT', this._select, 'FROM', this._table]

      if (whereKeys.length) {
        strs.push('WHERE')
        strs.push(whereKeys.join(' AND '))
      }

      if (order !== null) {
        strs.push('ORDER BY')
        strs.push(order)
      }

      if (limit !== null && offset !== null) {
        strs.push('LIMIT')
        strs.push(`${offset}, ${limit}`)
      } else if (limit !== null && offset === null) {
        strs.push('LIMIT')
        strs.push(`${limit}`)
      }

      parent.struct = {
        sql: `${strs.join(' ')};`,
        vals
      }

      return parent
    } })
  // ======== App.SqlLite.TableSelectOne
    App.SqlLite.TableSelectOne = function(table, ...completion) {
      if (!(this instanceof App.SqlLite.TableSelectOne)) {
        return new App.SqlLite.TableSelectOne(table, ...completion)
      }

      App.call(this, 'App.SqlLite.TableSelectOne', ...completion)
      this._table = null
      this._wheres = []
      this._select = '*'
      this._order = null

      this.table(table)
    }
    App.SqlLite.TableSelectOne.prototype = Object.create(App.prototype)
    App.SqlLite.TableSelectOne.prototype.table = function(val) {
      if (App._T.neStr(val)) {
        this._table = val
      }
      return this
    }
    App.SqlLite.TableSelectOne.prototype.where = function(key, ...vals) {
      const where = App.SqlLite._where(key, ...vals)
      if (where !== null) {
        this._wheres.push(where)
      }
      return this
    }
    App.SqlLite.TableSelectOne.prototype.select = function(...vals) {
      if (Array.isArray(vals)) {
        this._select = vals.filter(val => App._T.neStr(val)).join(',')
      }
      return this
    }
    App.SqlLite.TableSelectOne.prototype.order = function(val) {
      if (App._T.neStr(val)) {
        this._order = val
      }
      return this
    }
    App.SqlLite.TableSelectOne.prototype._vaild = function() {
      const table = this._table

      if (!App._T.neStr(table)) {
        return `Table 必須為非空字串`
      }

      return ''
    }
    Object.defineProperty(App.SqlLite.TableSelectOne.prototype, App.JsonKeyName, { get () {
      if (this._vaild() !== '') {
        return null
      }

      const table  = this._table
      const wheres = Array.isArray(this._wheres) ? this._wheres : []
      const select = App._T.neStr(this._select) ? this._select : '*'
      const order  = App._T.neStr(this._order) ? this._order : null

      const whereKeys = []
      const vals = []
      for (const where of wheres) {
        whereKeys.push(where.key)
        vals.push(...where.vals.map(val => App.SqlLite._typeAndVal(val)))
      }

      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

      const strs = ['SELECT', this._select, 'FROM', this._table]

      if (whereKeys.length) {
        strs.push('WHERE')
        strs.push(whereKeys.join(' AND '))
      }

      if (order !== null) {
        strs.push('ORDER BY')
        strs.push(order)
      }

      strs.push('LIMIT')
      strs.push(`0, 1`)

      parent.struct = {
        sql: `${strs.join(' ')};`,
        vals
      }

      return parent
    } })
  // ======== App.SqlLite.TableUpdate
    App.SqlLite.TableUpdate = function(table, param, ...completion) {
      if (!(this instanceof App.SqlLite.TableUpdate)) {
        return new App.SqlLite.TableUpdate(table, param, ...completion)
      }

      App.call(this, 'App.SqlLite.TableUpdate', ...completion)
      this._table = null
      this._param = null
      this._wheres = []

      this._order = null
      this._limit = null
      this._offset = null

      this.table(table)
      this.param(param)
    }
    App.SqlLite.TableUpdate.prototype = Object.create(App.prototype)
    App.SqlLite.TableUpdate._typeAndVal = (val) => {
      if (App._T.str(val)) {
        return { type: 'str', val: val }
      }
      if (App._T.num(val)) {
        return { type: Number(val) === val && val % 1 === 0 ? 'int' : 'double', val: val }
      }

      return { type: 'null' }
    }
    App.SqlLite.TableUpdate.prototype.table = function(val) {
      if (App._T.neStr(val)) {
        this._table = val
      }
      return this
    }
    App.SqlLite.TableUpdate.prototype.param = function(val) {
      if (App._T.obj(val)) {
        this._param = val
      }
      return this
    }
    App.SqlLite.TableUpdate.prototype.where = function(key, ...vals) {
      const where = App.SqlLite._where(key, ...vals)
      if (where !== null) {
        this._wheres.push(where)
      }
      return this
    }
    App.SqlLite.TableUpdate.prototype.order = function(val) {
      if (App._T.neStr(val)) {
        this._order = val
      }
      return this
    }
    App.SqlLite.TableUpdate.prototype.limit = function(val) {
      if (App._T.num(val)) {
        this._limit = val
      }
      return this
    }
    App.SqlLite.TableUpdate.prototype.offset = function(val) {
      if (App._T.num(val)) {
        this._offset = val
      }
      return this
    }
    App.SqlLite.TableUpdate.prototype._vaild = function() {
      const table = this._table

      if (!App._T.neStr(table)) {
        return `Table 必須為非空字串`
      }

      return ''
    }
    Object.defineProperty(App.SqlLite.TableUpdate.prototype, App.JsonKeyName, { get () {
      if (this._vaild() !== '') {
        return null
      }

      const table = this._table
      const param = this._param
      const wheres = Array.isArray(this._wheres) ? this._wheres : []
      const order  = App._T.neStr(this._order) ? this._order : null
      const limit  = App._T.num(this._limit) ? this._limit : null
      const offset = App._T.num(this._offset) ? this._offset : null

      if (!(App._T.neStr(table) && App._T.obj(param))) {
        return null
      }

      const vals = []

      const paramKeys = []
      for (const key in param) {
        paramKeys.push(`${key}=?`)
        vals.push(App.SqlLite._typeAndVal(param[key]))
      }

      const whereKeys = []
      for (const where of wheres) {
        whereKeys.push(where.key)
        vals.push(...where.vals.map(val => App.SqlLite._typeAndVal(val)))
      }

      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

      const strs = ['UPDATE', this._table, 'SET']

      if (paramKeys.length) {
        strs.push(paramKeys.join(','))
      }
      if (whereKeys.length) {
        strs.push('WHERE')
        strs.push(whereKeys.join(' AND '))
      }
      if (order !== null) {
        strs.push('ORDER BY')
        strs.push(order)
      }
      if (limit !== null && offset !== null) {
        strs.push('LIMIT')
        strs.push(`${offset}, ${limit}`)
      } else if (limit !== null && offset === null) {
        strs.push('LIMIT')
        strs.push(`${limit}`)
      }

      parent.struct = {
        sql: `${strs.join(' ')};`,
        vals
      }

      return parent
    } })
  // ======== App.SqlLite.TableDelete
    App.SqlLite.TableDelete = function(table, ...completion) {
      if (!(this instanceof App.SqlLite.TableDelete)) {
        return new App.SqlLite.TableDelete(table, ...completion)
      }

      App.call(this, 'App.SqlLite.TableDelete', ...completion)
      this._table = null
      this._wheres = []
      this._order = null
      this._limit = null
      this._offset = null

      this.table(table)
    }
    App.SqlLite.TableDelete.prototype = Object.create(App.prototype)
    App.SqlLite.TableDelete._typeAndVal = (val) => {
      if (App._T.str(val)) {
        return { type: 'str', val: val }
      }
      if (App._T.num(val)) {
        return { type: Number(val) === val && val % 1 === 0 ? 'int' : 'double', val: val }
      }

      return { type: 'null' }
    }
    App.SqlLite.TableDelete.prototype.table = function(val) {
      if (App._T.neStr(val)) {
        this._table = val
      }
      return this
    }
    App.SqlLite.TableDelete.prototype.where = function(key, ...vals) {
      const where = App.SqlLite._where(key, ...vals)
      if (where !== null) {
        this._wheres.push(where)
      }
      return this
    }
    App.SqlLite.TableDelete.prototype.order = function(val) {
      if (App._T.neStr(val)) {
        this._order = val
      }
      return this
    }
    App.SqlLite.TableDelete.prototype.limit = function(val) {
      if (App._T.num(val)) {
        this._limit = val
      }
      return this
    }
    App.SqlLite.TableDelete.prototype.offset = function(val) {
      if (App._T.num(val)) {
        this._offset = val
      }
      return this
    }
    App.SqlLite.TableDelete.prototype._vaild = function() {
      const table = this._table

      if (!App._T.neStr(table)) {
        return `Table 必須為非空字串`
      }

      return ''
    }
    Object.defineProperty(App.SqlLite.TableDelete.prototype, App.JsonKeyName, { get () {
      if (this._vaild() !== '') {
        return null
      }

      const table = this._table
      const wheres = Array.isArray(this._wheres) ? this._wheres : []
      const order  = App._T.neStr(this._order) ? this._order : null
      const limit  = App._T.num(this._limit) ? this._limit : null
      const offset = App._T.num(this._offset) ? this._offset : null

      const vals = []

      const whereKeys = []
      for (const where of wheres) {
        whereKeys.push(where.key)
        vals.push(...where.vals.map(val => App.SqlLite._typeAndVal(val)))
      }

      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

      const strs = ['DELETE', 'FROM', this._table]

      if (whereKeys.length) {
        strs.push('WHERE')
        strs.push(whereKeys.join(' AND '))
      }
      if (order !== null) {
        strs.push('ORDER BY')
        strs.push(order)
      }
      if (limit !== null && offset !== null) {
        strs.push('LIMIT')
        strs.push(`${offset}, ${limit}`)
      } else if (limit !== null && offset === null) {
        strs.push('LIMIT')
        strs.push(`${limit}`)
      }

      parent.struct = {
        sql: `${strs.join(' ')};`,
        vals
      }

      return parent
    } })
  // ======== App.SqlLite.TableCount
    App.SqlLite.TableCount = function(table, ...completion) {
      if (!(this instanceof App.SqlLite.TableCount)) {
        return new App.SqlLite.TableCount(table, ...completion)
      }

      App.call(this, 'App.SqlLite.TableCount', ...completion)
      this._table = null
      this._wheres = []
      this._order = null
      this._limit = null
      this._offset = null

      this.table(table)
    }
    App.SqlLite.TableCount.prototype = Object.create(App.prototype)
    App.SqlLite.TableCount.prototype.table = function(val) {
      if (App._T.neStr(val)) {
        this._table = val
      }
      return this
    }
    App.SqlLite.TableCount.prototype.where = function(key, ...vals) {
      const where = App.SqlLite._where(key, ...vals)
      if (where !== null) {
        this._wheres.push(where)
      }
      return this
    }
    App.SqlLite.TableCount.prototype.order = function(val) {
      if (App._T.neStr(val)) {
        this._order = val
      }
      return this
    }
    App.SqlLite.TableCount.prototype.limit = function(val) {
      if (App._T.num(val)) {
        this._limit = val
      }
      return this
    }
    App.SqlLite.TableCount.prototype.offset = function(val) {
      if (App._T.num(val)) {
        this._offset = val
      }
      return this
    }
    App.SqlLite.TableCount.prototype._vaild = function() {
      const table = this._table

      if (!App._T.neStr(table)) {
        return `Table 必須為非空字串`
      }

      return ''
    }
    Object.defineProperty(App.SqlLite.TableCount.prototype, App.JsonKeyName, { get () {
      if (this._vaild() !== '') {
        return null
      }

      const table  = this._table
      const wheres = Array.isArray(this._wheres) ? this._wheres : []
      const order  = App._T.neStr(this._order) ? this._order : null
      const limit  = App._T.num(this._limit) ? this._limit : null
      const offset = App._T.num(this._offset) ? this._offset : null

      const vals = []
      
      const whereKeys = []
      for (const where of wheres) {
        whereKeys.push(where.key)
        vals.push(...where.vals.map(val => App.SqlLite._typeAndVal(val)))
      }

      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

      const strs = ['SELECT', "COUNT(*) as cnt", 'FROM', this._table]

      if (whereKeys.length) {
        strs.push('WHERE')
        strs.push(whereKeys.join(' AND '))
      }

      if (order !== null) {
        strs.push('ORDER BY')
        strs.push(order)
      }

      if (limit !== null && offset !== null) {
        strs.push('LIMIT')
        strs.push(`${offset}, ${limit}`)
      } else if (limit !== null && offset === null) {
        strs.push('LIMIT')
        strs.push(`${limit}`)
      }

      parent.struct = {
        sql: `${strs.join(' ')};`,
        vals
      }

      return parent
    } })

  
  // ======== App.SqlLite.Builder
    App.SqlLite.Builder = function(table = null) {
      if (!(this instanceof App.SqlLite.Builder)) {
        return new App.SqlLite.Builder(table)
      }

      this._table       = null
      this._select      = '*'
      this._param       = null
      this._wheres      = []
      this._order       = null
      this._limit       = null
      this._offset      = null
      this._ifNotExists = true
      this._columns     = null
      this._sql         = ''
      this._vals        = []

      this.table(table)
    }
    
    App.SqlLite.Builder.prototype.table       = function(val) {
      if (App._T.neStr(val)) {
        this._table = val
      }
      return this
    }
    App.SqlLite.Builder.prototype.select      = function(...vals) {
      if (Array.isArray(vals)) {
        this._select = vals.filter(val => App._T.neStr(val)).join(',')
      }
      return this
    }
    App.SqlLite.Builder.prototype.param       = function(val) {
      if (App._T.obj(val)) {
        this._param = val
      }
      return this
    }
    App.SqlLite.Builder.prototype.where       = function(key, ...vals) {
      const where = App.SqlLite._where(key, ...vals)
      if (where !== null) {
        this._wheres.push(where)
      }
      return this
    }
    App.SqlLite.Builder.prototype.order       = function(val) {
      if (App._T.neStr(val)) {
        this._order = val
      }
      return this
    }
    App.SqlLite.Builder.prototype.limit       = function(val) {
      if (App._T.num(val)) {
        this._limit = val
      }
      return this
    }
    App.SqlLite.Builder.prototype.offset      = function(val) {
      if (App._T.num(val)) {
        this._offset = val
      }
      return this
    }
    App.SqlLite.Builder.prototype.ifNotExists = function(val) {
      if (App._T.bool(val)) {
        this._ifNotExists = val
      }
      return this
    }
    App.SqlLite.Builder.prototype.columns     = function(val) {
      if (App._T.obj(val)) {
        for (const key in val) {
          this.column(key, val[key])
        }
      }
      return this
    }
    App.SqlLite.Builder.prototype.column      = function(key, val) {
      if (App._T.neStr(key) && App._T.neStr(val)) {
        if (!App._T.obj(this._columns)) {
          this._columns = {}
        }

        this._columns[key] = val
      }
      return this
    }
    App.SqlLite.Builder.prototype.sql = function(val) {
      if (App._T.neStr(val)) {
        this._sql = val
      }
      return this
    }
    App.SqlLite.Builder.prototype.vals = function(...vals) {
      this._vals = []
      return this.val(...vals)
    }
    App.SqlLite.Builder.prototype.val = function(...vals) {
      for (const val of vals) {
        if (Array.isArray(val)) {
          this.val(...val)
        } else {
          if (App._T.num(val)) {
            this._vals.push(val)
          } else if (App._T.str(val)) {
            this._vals.push(val)
          } else if (val === null) {
            this._vals.push(null)
          }
        }
      }
      
      return this
    }

    App.SqlLite.Builder.prototype.insert = function(closure = undefined) {
      return App.SqlLite._timeout(this, closure, completion => {
        const app = App.SqlLite.TableInsert(this._table, this._param)

        app._table = this._table
        app._param = this._param
        
        app.completion(id => completion(id <= 0 ? new Error('新增失敗') : id))
        return app
      })
    }
    App.SqlLite.Builder.prototype.update = function(closure = undefined) {
      return App.SqlLite._timeout(this, closure, completion => {

        const app = App.SqlLite.TableUpdate(this._table, this._param)
        app._table  = this._table
        app._param  = this._param
        app._wheres = this._wheres
        app._order  = this._order
        app._limit  = this._limit
        app._offset = this._offset
        
        app.completion(result => {
          completion(App._T.bool(result) ? result : new Error('更新失敗'))
        })

        return app
      })
    }
    App.SqlLite.Builder.prototype.all    = function(closure = undefined) {
      return App.SqlLite._timeout(this, closure, completion => {

        const app = App.SqlLite.TableSelectAll(this._table)
        app._table  = this._table
        app._wheres = this._wheres
        app._select = this._select
        app._order  = this._order
        app._limit  = this._limit
        app._offset = this._offset
        
        app.completion(result => {
          completion(Array.isArray(result) ? result : new Error('查詢失敗'))
        })

        return app
      })
    }
    App.SqlLite.Builder.prototype.one    = function(closure = undefined) {
      return App.SqlLite._timeout(this, closure, completion => {

        const app = App.SqlLite.TableSelectOne(this._table)
        app._table  = this._table
        app._wheres = this._wheres
        app._select = this._select
        app._order  = this._order

        app.completion(result => {
          completion(App._T.obj(result) ? result : null)
        })

        return app
      })
    }
    App.SqlLite.Builder.prototype.delete = function(closure = undefined) {
      return App.SqlLite._timeout(this, closure, completion => {

        const app = App.SqlLite.TableDelete(this._table)
        app._table  = this._table
        app._wheres = this._wheres
        app._order  = this._order
        app._limit  = this._limit
        app._offset = this._offset
        app.completion(result => {
          completion(App._T.bool(result) ? result : new Error('刪除失敗'))
        })

        return app
      })
    }
    App.SqlLite.Builder.prototype.count  = function(closure = undefined) {
      return App.SqlLite._timeout(this, closure, completion => {

        const app = App.SqlLite.TableCount(this._table)
        app._table  = this._table
        app._wheres = this._wheres
        app._order  = this._order
        app._limit  = this._limit
        app._offset = this._offset
        app.completion(result => {
          completion(App._T.num(result) ? result : new Error('查詢失敗'))
        })

        return app
      })
    }
    App.SqlLite.Builder.prototype.clear  = function(closure = undefined) {
      return App.SqlLite._timeout(this, closure, completion => {

        const app = App.SqlLite.TableClear(this._table)
        app._table  = this._table
        app.completion(result => {
          completion(App._T.bool(result) ? result : new Error('查詢失敗'))
        })

        return app
      })
    }
    App.SqlLite.Builder.prototype.exec   = function(closure = undefined) {
      return App.SqlLite._timeout(this, closure, completion => {
        const app = App.SqlLite.TableExec()
        app._sql  = this._sql
        app._vals = this._vals
        app.completion(result => {
          completion(App._T.bool(result) ? result : new Error('執行失敗'))
        })

        return app
      })
    }
    
    App.SqlLite.Builder.prototype.drop   = function(closure = undefined) {
      return App.SqlLite._timeout(this, closure, completion => {

        const app = App.SqlLite.TableDrop(this._table)
        app._table  = this._table
        app.completion(result => {
          completion(App._T.bool(result) ? result : new Error('移除失敗'))
        })

        return app
      })
    }
    App.SqlLite.Builder.prototype.create = function(closure = undefined) {
      return App.SqlLite._timeout(this, closure, completion => {

        const app = App.SqlLite.TableCreate(this._table)
        app._table       = this._table
        app._ifNotExists = this._ifNotExists
        app._columns     = this._columns
        app.completion(result => {
          completion(App._T.bool(result) ? result : new Error('建立失敗'))
        })

        return app
      })
    }
    App.SqlLite.Builder.prototype.tables = function(closure = undefined) {
      return App.SqlLite._timeout(this, closure, completion => {

        const app = App.SqlLite.TableList()
        app.completion(result => {
          completion(Array.isArray(result) ? result : new Error('查詢失敗'))
        })

        return app
      })
    }
  
  // ======== App.SqlLite.Model
    App.SqlLite.Model = function(table) {
      const _model = App.SqlLite.Model._instances.get(table)
      if (_model !== undefined) {
        return _model
      }

      const Model = function(id, column = undefined) {
        if (!(this instanceof Model)) {
          return new Model(id, column)
        }

        if (App._T.obj(id)) {
          column = id
          id = 0
        }

        this._table = table
        this._id = id
        this._column = {}

        for (const k in column) {
          if (!['id', 'save', 'delete', '_dirties', '_column', '_id', '_table', 'create'].includes(k)) {
            this._column[k] = column[k]

            Object.defineProperty(this, k, {
              get () { return this._column[k] },
              set (val) {
                this._dirties.push(k)
                return this._column[k] = val
              },
            })
          }
        }

        Object.defineProperty(this, 'id', {
          get () { return this._id },
        })

        this._dirties = []
      }
      
      Model.prototype.save = function(closure) {
        return App.SqlLite._callback_or_promise(this, closure, (resolve, reject) => {
          if (!(App._T.num(this.id) && this.id > 0)) {
            return reject(new Error('沒有主鍵'))
          }

          if (this._dirties.length <= 0) {
            this._dirties = []
            return resolve(this)
          }

          const param = {}
          for (let dirty of this._dirties) {
            if (this._column[dirty] !== undefined) {
              param[dirty] = this._column[dirty]
            }
          }

          App.SqlLite(this._table).param(param).where(this.id).update()
            .then(result => {
              if (result) {
                this._dirties = []
                resolve(this)
              } else {
                reject(new Error('更新失敗'))
              }
            })
            .catch(reject)
        })
      }
      Model.prototype.delete = function(closure) {
        return App.SqlLite._callback_or_promise(this, closure, (resolve, reject) => {
          if (!(App._T.num(this.id) && this.id > 0)) {
            return reject(new Error('沒有主鍵'))
          }

          App.SqlLite(this._table).where(this.id).delete()
            .then(result => {
              if (result) {
                this._id = 0
                resolve(this)
              } else {
                reject(new Error('刪除失敗'))
              }
            })
            .catch(reject)
        })
      }

      Model.Builder = function(model, table) {
        if (!(this instanceof Model.Builder)) {
          return new Model.Builder(model, table)
        }

        this._model = model
        this._table = table

        this._select      = '*'
        this._wheres      = []
        this._order       = null
        this._limit       = null
        this._offset      = null
      }
      Model.Builder.prototype.where  = function(key, ...vals) {
        const where = App.SqlLite._where(key, ...vals)
        if (where !== null) {
          this._wheres.push(where)
        }
        return this
      }
      Model.Builder.prototype.select = function(...vals) {
        if (Array.isArray(vals)) {
          this._select = vals.filter(val => App._T.neStr(val)).join(',')
        }
        return this
      }
      Model.Builder.prototype.order  = function(val) {
        if (App._T.neStr(val)) {
          this._order = val
        }
        return this
      }
      Model.Builder.prototype.limit  = function(val) {
        if (App._T.num(val)) {
          this._limit = val
        }
        return this
      }
      Model.Builder.prototype.offset = function(val) {
        if (App._T.num(val)) {
          this._offset = val
        }
        return this
      }

      Model.Builder.prototype.create = function(param, closure = undefined) {
        return App.SqlLite._callback_or_promise(this._model, closure, (resolve, reject) => {
          
          let func = async (sqlLite, sqlLiteOne) => {
            let id = await sqlLite.insert()
            let column = await sqlLiteOne.where(id).one()

            if (App._T.obj(column)) {
              resolve(this._model(id, column))
            } else {
              reject(new Error('新增失敗'))
            }
          }

          const sqlLite = App.SqlLite(this._table).param(param)
          const sqlLiteOne = App.SqlLite(this._table)

          func(sqlLite, sqlLiteOne)
            .then(resolve)
            .catch(_ => resolve(null))
        })
      }
      Model.Builder.prototype.all    = function(closure = undefined) {
        return App.SqlLite._callback_or_promise(this._model, closure, (resolve, reject) => {
          
          let func = async sqlLite => {
            let rows = await sqlLite.all()

            resolve(rows.map(row => {
              if (!App._T.obj(row)) {
                return null
              }

              let id = App._T.num(row.id) ? row.id : 0
              let column = {}

              for (const k in row) {
                if (k !== 'id') {
                  column[k] = row[k]
                }
              }

              return this._model(id, column)
            }).filter(t => t instanceof Model))
          }

          const sqlLite = App.SqlLite(this._table)
          sqlLite._wheres = this._wheres
          sqlLite._select = this._select
          sqlLite._order  = this._order
          sqlLite._limit  = this._limit
          sqlLite._offset = this._offset

          func(sqlLite)
            .then(resolve)
            .catch(reject)
        })
      }
      Model.Builder.prototype.count  = function(closure = undefined) {
        return App.SqlLite._callback_or_promise(this._model, closure, (resolve, reject) => {
          
          let func = async sqlLite => {
            let count = await sqlLite.count()
            resolve(count)
          }

          const sqlLite = App.SqlLite(this._table)
          sqlLite._wheres = this._wheres
          sqlLite._order  = this._order
          sqlLite._limit  = this._limit
          sqlLite._offset = this._offset

          func(sqlLite)
            .then(resolve)
            .catch(reject)
        })
      }
      Model.Builder.prototype.clear  = function(closure = undefined) {
        return App.SqlLite._callback_or_promise(this._model, closure, (resolve, reject) => {
          App.SqlLite(this._table).clear()
            .then(resolve)
            .catch(reject)
        })
      }
      Model.Builder.prototype.one    = function(closure = undefined) {
        return App.SqlLite._callback_or_promise(this._model, closure, (resolve, reject) => {
          
          let func = async sqlLite => {
            let row = await sqlLite.one()

            if (row === null) {
              return resolve(null)
            }

            let id = App._T.num(row.id) ? row.id : 0

            let column = {}

            for (const k in row) {
              if (k !== 'id') {
                column[k] = row[k]
              }
            }

            resolve(this._model(id, column))
          }

          const sqlLite = App.SqlLite(this._table)
          sqlLite._wheres = this._wheres
          sqlLite._select = this._select
          sqlLite._order  = this._order

          func(sqlLite)
            .then(resolve)
            .catch(reject)
        })
      }

      Model.where  = (...data) => Model.Builder(Model, table).where(...data)
      Model.select = (...data) => Model.Builder(Model, table).select(...data)
      Model.order  = (...data) => Model.Builder(Model, table).order(...data)
      Model.limit  = (...data) => Model.Builder(Model, table).limit(...data)
      Model.offset = (...data) => Model.Builder(Model, table).offset(...data)

      Model.create = (...data) => Model.Builder(Model, table).create(...data)
      Model.all    = (...data) => Model.Builder(Model, table).all(...data)
      Model.count  = (...data) => Model.Builder(Model, table).count(...data)
      Model.clear  = (...data) => Model.Builder(Model, table).clear(...data)
      Model.one    = (...data) => {
        const builder = Model.Builder(Model, table)
        if (!data.length) {
          return builder.one()
        }

        let tmp1 = data.shift()
        if (App._T.func(tmp1)) {
          return builder.one(tmp1)
        }

        let tmp2 = data.shift()
        return builder.where(tmp1).one(tmp2)
      }

      App.SqlLite.Model._instances.set(table, Model)
      return Model
    }
    App.SqlLite.Model._instances = new Map()

// ======== App.Action
  App.Action = function(data, param = undefined, ...completion) {
    if (!(this instanceof App.Action)) {
      if (App._T.func(data)) {
        return App.Action.Func(data, App._T.bool(param) && param, ...completion)
      }
      if (App._T.neStr(data)) {
        return App.Action.Emit(data, param, ...completion)
      }

      return null
    }
  }

  // ======== App.Action.Emit
    App.Action.Emit = function(key, param = undefined, ...completion) {
      if (!(this instanceof App.Action.Emit)) {
        return new App.Action.Emit(key, param, ...completion)
      }

      App.call(this, 'App.Action.Emit', ...completion)
      
      this._goal = App._ActionEmitGoalEnum[0]
      this._key = null
      this._param = undefined

      this.key(key).param(param).self()
    }
    App.Action.Emit.prototype = Object.create(App.prototype)
    App.Action.Emit.prototype.self = function() {
      return this.goal(App._ActionEmitGoalEnum[0])
    }
    App.Action.Emit.prototype.prev = function() {
      return this.goal(App._ActionEmitGoalEnum[1])
    }
    App.Action.Emit.prototype.each = function() {
      return this.goal(App._ActionEmitGoalEnum[2])
    }
    App.Action.Emit.prototype.goal = function(val) {
      if (App.Action.Emit.isGoal(val)) {
        this._goal = val
      }
      return this
    }
    App.Action.Emit.prototype.key = function(val) {
      if (App._T.neStr(val)) {
        this._key = val
      }
      return this
    }
    App.Action.Emit.prototype.param = function(val) {
      this._param = val
      return this
    }
    Object.defineProperty(App.Action.Emit.prototype, App.JsonKeyName, { get () {
      const key = this._key

      if (!App._T.neStr(key)) {
        return null
      }

      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

      const goal = App.Action.Emit.isGoal(this._goal) ? this._goal : App._ActionEmitGoalEnum[0]
      
      let param = undefined
      try {
        param = JSON.stringify(JSON.stringify(this._param))
      } catch (e) {
        param = undefined
      }

      parent.struct = {
        goal,
        key,
        param,
      }
      return parent
    } })

    
    App.Action.Emit.isGoal = val => App._T.neStr(val) && App._ActionEmitGoalEnum.includes(val)
    // App.Action.Emit.Map = new Map()

  // ======== App.Action.Func
    App.Action.Func = function(func, isKeep = false, ...completion) {
      if (!(this instanceof App.Action.Func)) {
        return new App.Action.Func(func, isKeep, ...completion)
      }

      App.call(this, 'App.Action.Func', ...completion)
      
      this._func = null
      this._isKeep = false

      this.func(func).isKeep(isKeep)

      this._id = ++App.Action.Func.Id
      App.Action.Func.Map.set(this._id, this)
    }
    App.Action.Func.prototype = Object.create(App.prototype)
    App.Action.Func.prototype.func = function(val) {
      if (App._T.func(val)) {
        this._func = val
      }
      return this
    }
    App.Action.Func.prototype.isKeep = function(val) {
      if (App._T.bool(val)) {
        this._isKeep = val
      }
      return this
    }
    Object.defineProperty(App.Action.Func.prototype, App.JsonKeyName, { get () {
      const id = this._id
      
      if (!(App._T.num(id) && App._T.func(this._func))) {
        return null
      }

      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

      parent.struct = {
        id,
      }
      return parent
    } })

    App.Action.Func.Id = 0
    App.Action.Func.Map = new Map()

// ======== App.OnScroll
  App.OnScroll = function(scrollTop, clientHeight, scrollHeight, ...completion) {
    if (!(this instanceof App.OnScroll)) {
      return new App.OnScroll(scrollTop, clientHeight, scrollHeight, ...completion)
    }

    App.call(this, 'App.OnScroll', ...completion)
    
    this._scrollTop = null
    this._clientHeight = null
    this._scrollHeight = null

    this.scrollTop(scrollTop)
    this.clientHeight(clientHeight)
    this.scrollHeight(scrollHeight)
  }
  App.OnScroll.prototype = Object.create(App.prototype)
  App.OnScroll.prototype.scrollTop = function(val) {
    if (App._T.num(val)) {
      this._scrollTop = val
    }
    return this
  }
  App.OnScroll.prototype.clientHeight = function(val) {
    if (App._T.num(val)) {
      this._clientHeight = val
    }
    return this
  }
  App.OnScroll.prototype.scrollHeight = function(val) {
    if (App._T.num(val)) {
      this._scrollHeight = val
    }
    return this
  }
  Object.defineProperty(App.OnScroll.prototype, App.JsonKeyName, { get () {
    const scrollTop = this._scrollTop
    const clientHeight = this._clientHeight
    const scrollHeight = this._scrollHeight
    
    if (!App._T.num(scrollTop) || !App._T.num(clientHeight) || !App._T.num(scrollHeight)) {
      return null
    }

    const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

    parent.struct = {
      scrollTop,
      clientHeight,
      scrollHeight,
    }
    return parent
  } })

  App.Action.Func.Id = 0
  App.Action.Func.Map = new Map()

// ======== App.Alert
  App.Alert = function(title = null, message = null, buttons = [], isAnimated = true, ...completion) {
    if (!(this instanceof App.Alert)) {
      return new App.Alert(title, message, buttons, isAnimated, ...completion)
    }

    App.call(this, 'App.Alert', ...completion)
    
    this._title = null
    this._message = null
    this._buttons = []
    this._inputs = []
    this._isAnimated = true

    if (Array.isArray(title)) {
      this.title(null).message(null).buttons(title).isAnimated(message)
    } else if (Array.isArray(message)) {
      this.title(title).message(null).buttons(message).isAnimated(buttons)
    } else {
      this.title(title).message(message).buttons(buttons).isAnimated(isAnimated)
    }
    this.feedback('medium')
  }
  App.Alert.prototype = Object.create(App.prototype)
  App.Alert.prototype.title = function(val) {
    if (val === null) {
      this._title = null
    }
    if (App._T.str(val)) {
      this._title = val
    }
    return this
  }
  App.Alert.prototype.message = function(val) {
    if (val === null) {
      this._message = null
    }
    if (App._T.str(val)) {
      this._message = val
    }
    return this
  }
  App.Alert.prototype.button = function(text, click = null, isPreferred = false, isDestructive = false) {
    if (!(text instanceof App.Alert.Button)) {
      text = App.Alert.Button(text, click, App._T.bool(isPreferred) && isPreferred, App._T.bool(isDestructive) && isDestructive)
    }

    if (text instanceof App.Alert.Button) {
      this._buttons.push(text)
    }

    return this
  }
  App.Alert.prototype.isAnimated = function(val) {
    if (App._T.bool(val)) {
      this._isAnimated = val
    }
    return this
  }
  App.Alert.prototype.buttons = function(...vals) {
    if (Array.isArray(vals)) {
      vals = vals.reduce((a, b) => a.concat(b), [])

      this._buttons = []
      for (let val of vals) {
        this.button(val)
      }
    }
    return this
  }
  App.Alert.prototype.input = function(value = '', placeholder = '') {
    if (!(value instanceof App.Alert.Input)) {
      value = App.Alert.Input(value, placeholder)
    }

    if (value instanceof App.Alert.Input) {
      this._inputs.push(value)
    }
    return this
  }
  App.Alert.prototype.inputs = function(...vals) {
    if (Array.isArray(vals)) {
      vals = vals.reduce((a, b) => a.concat(b), [])

      this._inputs = []
      for (let val of vals) {
        this.input(val)
      }
    }
    return this
  }
  
  Object.defineProperty(App.Alert.prototype, App.JsonKeyName, { get () {
    let _button = null

    const title   = App._T.str(this._title) ? this._title : null
    const message = App._T.str(this._message) ? this._message : null
    const inputs = Array.isArray(this._inputs) ? this._inputs.filter(input => input instanceof App.Alert.Input).map(input => ({
      value: App._T.str(input._value) ? input._value : '',
      placeholder: App._T.str(input._placeholder) ? input._placeholder : '',
    })) : []

    const buttons = Array.isArray(this._buttons) ? this._buttons.filter(button => button instanceof App.Alert.Button && App._T.neStr(button._text)).map(button => {
      if (button._isPreferred) {
        if (_button !== null) { _button.isPreferred(false) }
        _button = button
      }
      return button
    }).map(({
      _text: text,
      _isPreferred: isPreferred,
      _isDestructive: isDestructive,
      _click: click,
    }) => ({
      text,
      isPreferred,
      isDestructive,
      click: click instanceof App ? click[App.JsonKeyName] : null,
    })) : []

    if (title === null && message === null && buttons <= 0) {
      return null
    }

    const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

    const isAnimated = App._T.bool(this._isAnimated) && this._isAnimated

    parent.struct = {
      title,
      message,
      buttons,
      inputs,
      isAnimated,
    }
    return parent
  } })

  // ======== App.Alert.Button
    App.Alert.Button = function(text, click = null, isPreferred = false, isDestructive = false) {
      if (!(this instanceof App.Alert.Button)) {
        return new App.Alert.Button(text, click, isPreferred, isDestructive)
      }

      this._text = ''
      this._click = null
      this._isPreferred = false
      this._isDestructive = false

      this.text(text).click(click).isPreferred(isPreferred).isDestructive(isDestructive)
    }
    App.Alert.Button.prototype.text = function(val) {
      if (App._T.neStr(val)) {
        this._text = val
      }
      return this
    }
    App.Alert.Button.prototype.click = function(val, ...params) {
      if (!(val instanceof App)) {
        val = App.Action(val, ...params)
      }

      if (val instanceof App) {
        this._click = val
      }

      return this
    }
    App.Alert.Button.prototype.isPreferred = function(val) {
      if (App._T.bool(val)) {
        this._isPreferred = val
      }
      return this
    }
    App.Alert.Button.prototype.isDestructive = function(val) {
      if (App._T.bool(val)) {
        this._isDestructive = val
      }
      return this
    }

  // ======== App.Alert.Input
    App.Alert.Input = function(value = '', placeholder = '') {
      if (!(this instanceof App.Alert.Input)) {
        return new App.Alert.Input(value, placeholder)
      }

      this._value = ''
      this._placeholder = ''

      this.value(value).placeholder(placeholder)
    }
    App.Alert.Input.prototype.value = function(val) {
      if (App._T.str(val)) {
        this._value = val
      }
      return this
    }
    App.Alert.Input.prototype.placeholder = function(val) {
      if (App._T.str(val)) {
        this._placeholder = val
      }
      return this
    }

// ======== App.HUD
  App.HUD = function() {}
  App.HUD.Icons = ['loading', 'done', 'fail', 'progress']

  // ======== App.HUD.Show
    App.HUD.Show = function(icon, description = '', title = '', isAnimated = true, ...completion) {
      if (!(this instanceof App.HUD.Show)) {
        return new App.HUD.Show(icon, description, title, isAnimated, ...completion)
      }
      App.call(this, 'App.HUD.Show', ...completion)
      
      this._icon = ''
      this._title = ''
      this._description = ''
      this._isAnimated = true
      
      if (App._T.bool(description)) {
        this.icon(icon).title('').description('').isAnimated(description)
      } else if (App._T.bool(title)) {
        this.icon(icon).title('').description(description).isAnimated(title)
      } else {
        this.icon(icon).title(title).description(description).isAnimated(isAnimated)
      }
    }
    App.HUD.Show.prototype = Object.create(App.prototype)
    App.HUD.Show.prototype.icon = function(val) {
      if (App._T.neStr(val) && App.HUD.Icons.includes(val)) {
        this._icon = val
      }
      return this
    }
    App.HUD.Show.prototype.title = function(val) {
      if (App._T.str(val)) {
        this._title = val
      }
      return this
    }
    App.HUD.Show.prototype.description = function(val) {
      if (App._T.str(val)) {
        this._description = val
      }
      return this
    }
    App.HUD.Show.prototype.isAnimated = function(val) {
      if (App._T.bool(val)) {
        this._isAnimated = val
      }
      return this
    }
    Object.defineProperty(App.HUD.Show.prototype, App.JsonKeyName, { get () {
      const icon = App._T.neStr(this._icon) && App.HUD.Icons.includes(this._icon) ? this._icon : ''

      if (icon === '') {
        return null
      }

      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

      const title = App._T.str(this._title) ? this._title : ''
      const description = App._T.str(this._description) ? this._description : ''
      const isAnimated = App._T.bool(this._isAnimated) ? this._isAnimated : true

      parent.struct = {
        icon,
        title,
        description,
        isAnimated,
      }
      return parent
    } })

    // ======== App.HUD.Show.Show.Loading
      App.HUD.Show.Loading = function(description = '', title = '', isAnimated = true, ...completion) {
        if (this instanceof App.HUD.Show.Loading) {
          App.HUD.Show.call(this, 'loading', description, title, isAnimated, ...completion)
          this.feedback('light')
        } else {
          return new App.HUD.Show.Loading(description, title, isAnimated, ...completion)
        }
      }
      App.HUD.Show.Loading.prototype = Object.create(App.HUD.Show.prototype)
    // ======== App.HUD.Show.Show.Done
      App.HUD.Show.Done = function(description = '', title = '', isAnimated = true, ...completion) {
        if (this instanceof App.HUD.Show.Done) {
          App.HUD.Show.call(this, 'done', description, title, isAnimated, ...completion)
          this.feedback('success')
        } else {
          return new App.HUD.Show.Done(description, title, isAnimated, ...completion)
        }
      }
      App.HUD.Show.Done.prototype = Object.create(App.HUD.Show.prototype)
    // ======== App.HUD.Show.Show.Fail
      App.HUD.Show.Fail = function(description = '', title = '', isAnimated = true, ...completion) {
        if (this instanceof App.HUD.Show.Fail) {
          App.HUD.Show.call(this, 'fail', description, title, isAnimated, ...completion)
          this.feedback('error')
        } else {
          return new App.HUD.Show.Fail(description, title, isAnimated, ...completion)
        }
      }
      App.HUD.Show.Fail.prototype = Object.create(App.HUD.Show.prototype)
    // ======== App.HUD.Show.Show.Progress
      App.HUD.Show.Progress = function(description = '', title = '', isAnimated = true, ...completion) {
        if (this instanceof App.HUD.Show.Progress) {
          App.HUD.Show.call(this, 'progress', description, title, isAnimated, ...completion)
          this.feedback('soft')
        } else {
          return new App.HUD.Show.Progress(description, title, isAnimated, ...completion)
        }
      }
      App.HUD.Show.Progress.prototype = Object.create(App.HUD.Show.prototype)

  // ======== App.HUD.Change
    App.HUD.Change = function(icon, description = '', title = '', ...completion) {
      if (!(this instanceof App.HUD.Change)) {
        return new App.HUD.Change(icon, description, title, ...completion)
      }
      App.call(this, 'App.HUD.Change', ...completion)
      
      this._icon = ''
      this._title = ''
      this._description = ''

      this.icon(icon).title(title).description(description).feedback('soft')
    }
    App.HUD.Change.prototype = Object.create(App.prototype)
    App.HUD.Change.prototype.icon = function(val) {
      if (App._T.neStr(val) && App.HUD.Icons.includes(val)) {
        this._icon = val
      }
      return this
    }
    App.HUD.Change.prototype.title = function(val) {
      if (App._T.str(val)) {
        this._title = val
      }
      return this
    }
    App.HUD.Change.prototype.description = function(val) {
      if (App._T.str(val)) {
        this._description = val
      }
      return this
    }
    Object.defineProperty(App.HUD.Change.prototype, App.JsonKeyName, { get () {
      const icon = App._T.neStr(this._icon) && App.HUD.Icons.includes(this._icon) ? this._icon : ''
      
      if (icon === '') {
        return null
      }

      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

      const title = App._T.str(this._title) ? this._title : ''
      const description = App._T.str(this._description) ? this._description : ''

      parent.struct = {
        icon,
        title,
        description,
      }
      return parent
    } })

    // ======== App.HUD.Change.Loading
      App.HUD.Change.Loading = function(description = '', title = '', ...completion) {
        if (this instanceof App.HUD.Change.Loading) {
          App.HUD.Change.call(this, 'loading', description, title, ...completion)
        } else {
          return new App.HUD.Change.Loading(description, title, ...completion)
        }
      }
      App.HUD.Change.Loading.prototype = Object.create(App.HUD.Change.prototype)
    // ======== App.HUD.Change.Done
      App.HUD.Change.Done = function(description = '', title = '', ...completion) {
        if (this instanceof App.HUD.Change.Done) {
          App.HUD.Change.call(this, 'done', description, title, ...completion)
        } else {
          return new App.HUD.Change.Done(description, title, ...completion)
        }
      }
      App.HUD.Change.Done.prototype = Object.create(App.HUD.Change.prototype)
    // ======== App.HUD.Change.Fail
      App.HUD.Change.Fail = function(description = '', title = '', ...completion) {
        if (this instanceof App.HUD.Change.Fail) {
          App.HUD.Change.call(this, 'fail', description, title, ...completion)
        } else {
          return new App.HUD.Change.Fail(description, title, ...completion)
        }
      }
      App.HUD.Change.Fail.prototype = Object.create(App.HUD.Change.prototype)
    // ======== App.HUD.Change.Progress
      App.HUD.Change.Progress = function(description = '', title = '', ...completion) {
        if (this instanceof App.HUD.Change.Progress) {
          App.HUD.Change.call(this, 'progress', description, title, ...completion)
        } else {
          return new App.HUD.Change.Progress(description, title, ...completion)
        }
      }
      App.HUD.Change.Progress.prototype = Object.create(App.HUD.Change.prototype)

  // ======== App.HUD.Hide
    App.HUD.Hide = function(delay = 0, isAnimated = true, ...completion) {
      if (!(this instanceof App.HUD.Hide)) {
        return new App.HUD.Hide(delay, isAnimated, ...completion)
      }
      App.call(this, 'App.HUD.Hide', ...completion)

      this._delay = 0
      this._isAnimated = true
      
      if (App._T.bool(delay)) {
        this.delay(0).isAnimated(delay)
      } else {
        this.delay(delay).isAnimated(isAnimated)
      }
    }
    App.HUD.Hide.prototype = Object.create(App.prototype)
    App.HUD.Hide.prototype.delay = function(val) {
      if (App._T.num(val) && val >= 0) {
        this._delay = val
      }
      return this
    }
    App.HUD.Hide.prototype.isAnimated = function(val) {
      if (App._T.bool(val)) {
        this._isAnimated = val
      }
      return this
    }
    Object.defineProperty(App.HUD.Hide.prototype, App.JsonKeyName, { get () {
      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

      const delay = App._T.num(this._delay) && this._delay >= 0 ? this._delay / 1000 : 0
      const isAnimated = App._T.bool(this._isAnimated) ? this._isAnimated : true

      parent.struct = {
        delay,
        isAnimated,
      }
      return parent
    } })

  // ======== App.HUD.SetProgress
    App.HUD.SetProgress = function(percent = 0, ...completion) {
      if (!(this instanceof App.HUD.SetProgress)) {
        return new App.HUD.SetProgress(percent, ...completion)
      }
      App.call(this, 'App.HUD.SetProgress', ...completion)

      this._percent = 0
      
      this.percent(percent)
    }
    App.HUD.SetProgress.prototype = Object.create(App.prototype)
    App.HUD.SetProgress.prototype.percent = function(val) {
      if (App._T.num(val) && val >= 0) {
        this._percent = val
      }
      return this
    }
    Object.defineProperty(App.HUD.SetProgress.prototype, App.JsonKeyName, { get () {
      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)
      
      const percent = App._T.num(this._percent) && this._percent >= 0 ? this._percent : 0

      parent.struct = {
        percent,
      }
      return parent
    } })

// ======== App.YoutubePlayer
  App.YoutubePlayer = function() {}

  // ======== App.YoutubePlayer.Show
    App.YoutubePlayer.Show = function(vid, ref = '', timeout = 300, ...completion) {
      if (!(this instanceof App.YoutubePlayer.Show)) {
        return new App.YoutubePlayer.Show(vid, ref, timeout, ...completion)
      }

      App.call(this, 'App.YoutubePlayer.Show', ...completion)

      this._vid = ''
      this._ref = ''
      this._timeout = 30
      this._onTimeout = null
      this._onError = null
      this._onPlay = null
      this._onClose = null

      if (App._T.num(ref)) {
        this.vid(vid).ref('').timeout(ref)
      } else {
        this.vid(vid).ref(ref).timeout(timeout)
      }
      this.feedback('light')
    }
    App.YoutubePlayer.Show.prototype = Object.create(App.prototype)

    App.YoutubePlayer.Show.prototype.vid = function(val) {
      if (App._T.str(val)) {
        this._vid = val
      }
      return this
    }
    App.YoutubePlayer.Show.prototype.ref = function(val) {
      if (App._T.str(val)) {
        this._ref = val
      }
      return this
    }
    App.YoutubePlayer.Show.prototype.timeout = function(val) {
      if (App._T.num(val) && val >= 0) {
        this._timeout = val
      }
      return this
    }
    App.YoutubePlayer.Show.prototype.onTimeout = function(val, ...params) {
      if (!(val instanceof App)) {
        val = App.Action(val, ...params)
      }

      if (val instanceof App) {
        this._onTimeout = val
      }
      return this
    }
    App.YoutubePlayer.Show.prototype.onError = function(val, ...params) {
      if (!(val instanceof App)) {
        val = App.Action(val, ...params)
      }

      if (val instanceof App) {
        this._onError = val
      }
      return this
    }
    App.YoutubePlayer.Show.prototype.onPlay = function(val, ...params) {
      if (!(val instanceof App)) {
        val = App.Action(val, ...params)
      }

      if (val instanceof App) {
        this._onPlay = val
      }
      return this
    }
    App.YoutubePlayer.Show.prototype.onClose = function(val, ...params) {
      if (!(val instanceof App)) {
        val = App.Action(val, ...params)
      }

      if (val instanceof App) {
        this._onClose = val
      }
      return this
    }
    Object.defineProperty(App.YoutubePlayer.Show.prototype, App.JsonKeyName, { get () {
      const vid = App._T.str(this._vid) ? this._vid : ''
      
      if (vid === '') {
        return null
      }

      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

      const ref = App._T.str(this._ref) ? this._ref : ''
      const timeout = App._T.num(this._timeout) && this._timeout >= 0 ? this._timeout : 30

      parent.struct = {
        vid,
        ref,
        timeout,

        on: {
          timeout: this._onTimeout instanceof App ? this._onTimeout[App.JsonKeyName] : null,
          error: this._onError instanceof App ? this._onError[App.JsonKeyName] : null,
          play: this._onPlay instanceof App ? this._onPlay[App.JsonKeyName] : null,
          close: this._onClose instanceof App ? this._onClose[App.JsonKeyName] : null
        }
      }

      return parent
    } })

  // ======== App.YoutubePlayer.Close
    App.YoutubePlayer.Close = function(...completion) {
      if (!(this instanceof App.YoutubePlayer.Close)) {
        return new App.YoutubePlayer.Close(...completion)
      }

      App.call(this, 'App.YoutubePlayer.Close', ...completion)
    }
    App.YoutubePlayer.Close.prototype = Object.create(App.prototype)
    Object.defineProperty(App.YoutubePlayer.Close.prototype, App.JsonKeyName, { get () {
      return  Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)
    } })

// ======== App.VC
  App.VC = function() {}

  // ======== App.VC.View
    App.VC.View = function(data = null) {
      if (App._T.url(data)) {
        return App.VC.View.Web(data)
      }

      this._navBarHidden = null
      this._navBarAppearance = null
      this._navBarTitle = null
      this._navBarLeft = null
      this._navBarRight = null
      
      this._tabBarAppearance = null
      this._tabBarTitle = null

      this.navBarHidden(false)
        .navBarAppearance(App._NavBarAppearance[0])
        .navBarTitle('')
        .navBarLeft('')
        .navBarRight('')
        .tabBarAppearance(App._TabBarAppearance[0])
        .tabBarTitle(null)

      return null
    }

    App.VC.View.prototype.navBarHidden = function(val) {
      if (!(val instanceof App.VC.Nav.Bar.Hidden)) {
        val = App.VC.Nav.Bar.Hidden(val)
      }
      if (val instanceof App.VC.Nav.Bar.Hidden) {
        this._navBarHidden = val
      }
      return this
    }
    App.VC.View.prototype.navBarAppearance = function(val) {
      if (!(val instanceof App.VC.Nav.Bar.Appearance)) {
        val = App.VC.Nav.Bar.Appearance(val)
      }
      if (val instanceof App.VC.Nav.Bar.Appearance) {
        this._navBarAppearance = val
      }
      return this
    }
    App.VC.View.prototype.navBarTitle = function(val) {
      if (!(val instanceof App.VC.Nav.Bar.Title)) {
        val = App.VC.Nav.Bar.Title(val)
      }
      if (val instanceof App.VC.Nav.Bar.Title) {
        this._navBarTitle = val
      }
      return this
    }
    App.VC.View.prototype.navBarLeft = function(text, ...data) {
      if (!(text instanceof App.VC.Nav.Bar.Button.Left)) {
        text = App.VC.Nav.Bar.Button.Left(text, ...data)
      }
      if (text instanceof App.VC.Nav.Bar.Button.Left) {
        this._navBarLeft = text
      }

      return this
    }
    App.VC.View.prototype.navBarRight = function(text, ...data) {
      if (!(text instanceof App.VC.Nav.Bar.Button.Right)) {
        text = App.VC.Nav.Bar.Button.Right(text, ...data)
      }
      if (text instanceof App.VC.Nav.Bar.Button.Right) {
        this._navBarRight = text
      }
      return this
    }
    App.VC.View.prototype.tabBarAppearance = function(val) {
      if (!(val instanceof App.VC.Tab.Bar.Appearance)) {
        val = App.VC.Tab.Bar.Appearance(val)
      }
      if (val instanceof App.VC.Tab.Bar.Appearance) {
        this._tabBarAppearance = val
      }
      return this
    }
    App.VC.View.prototype.tabBarTitle = function(val) {
      if (!(val instanceof App.VC.Tab.Bar.Title)) {
        val = App.VC.Tab.Bar.Title(val)
      }
      if (val instanceof App.VC.Tab.Bar.Title) {
        this._tabBarTitle = val
      }
      return this
    }
    Object.defineProperty(App.VC.View.prototype, 'nav', { get () {
        let navBarHidden     = this._navBarHidden     instanceof App.VC.Nav.Bar.Hidden       ? this._navBarHidden     : App.VC.Nav.Bar.Hidden(false)
        let navBarAppearance = this._navBarAppearance instanceof App.VC.Nav.Bar.Appearance   ? this._navBarAppearance : App.VC.Nav.Bar.Appearance(App._NavBarAppearance[0])
        let navBarTitle      = this._navBarTitle      instanceof App.VC.Nav.Bar.Title        ? this._navBarTitle      : App.VC.Nav.Bar.Title('')
        let navBarLeft       = this._navBarLeft       instanceof App.VC.Nav.Bar.Button.Left  ? this._navBarLeft       : App.VC.Nav.Bar.Button.Left()
        let navBarRight      = this._navBarRight      instanceof App.VC.Nav.Bar.Button.Right ? this._navBarRight      : App.VC.Nav.Bar.Button.Right()

        navBarHidden         = navBarHidden[App.JsonKeyName]
        navBarAppearance     = navBarAppearance[App.JsonKeyName]
        navBarTitle          = navBarTitle[App.JsonKeyName]
        navBarLeft           = navBarLeft[App.JsonKeyName]
        navBarRight          = navBarRight[App.JsonKeyName]

        if (
          navBarHidden === null
          || navBarAppearance === null
          || navBarTitle === null
          || navBarLeft === null
          || navBarRight === null) {
          return null
        }

        return {
          barHidden    : navBarHidden.struct.isHidden,
          barAppearance: navBarAppearance.struct.style,
          barTitle     : navBarTitle.struct.text,
          barLeft      : navBarLeft.struct,
          barRight     : navBarRight.struct,
        }
    } })
    Object.defineProperty(App.VC.View.prototype, 'tab', { get () {
        let tabBarAppearance = this._tabBarAppearance instanceof App.VC.Tab.Bar.Appearance   ? this._tabBarAppearance : App.VC.Tab.Bar.Appearance(App._TabBarAppearance[0])
        let tabBarTitle      = this._tabBarTitle      instanceof App.VC.Tab.Bar.Title        ? this._tabBarTitle      : App.VC.Tab.Bar.Title('')

        tabBarAppearance     = tabBarAppearance[App.JsonKeyName]
        tabBarTitle          = tabBarTitle[App.JsonKeyName]

        if (tabBarAppearance === null
          || tabBarTitle === null) {
          
          return null
        }

        return {
          barAppearance: tabBarAppearance.struct.style,
          barTitle     : tabBarTitle.struct.text,
        }
    } })


    // ======== App.VC.View.Web
      App.VC.View.Web = function(url = null) {
        if (!(this instanceof App.VC.View.Web)) {
          return new App.VC.View.Web(url)
        }

        App.VC.View.call(this)

        this._url = null
        this.url(url)
      }
      App.VC.View.Web.prototype = Object.create(App.VC.View.prototype)
      App.VC.View.Web.prototype.url = function(val) {
        if (App._T.url(val)) {
          this._url = val
        }
        return this
      }

  // ======== App.VC.Present
    App.VC.Present = function(view = null, isAnimated = true, isNavigation = false, isFullScreen = false, ...completion) {
      if (!(this instanceof App.VC.Present)) {
        return new App.VC.Present(view, isAnimated, isNavigation, isFullScreen, ...completion)
      }

      App.call(this, 'App.VC.Present', ...completion)

      this._view = null

      this._isAnimated = true
      this._isNavigation = false
      this._isFullScreen = false

      this.view(view).isAnimated(isAnimated).isNavigation(isNavigation).isFullScreen(isFullScreen).feedback('light')
    }
    App.VC.Present.prototype = Object.create(App.prototype)
    App.VC.Present.prototype.view = function(val, ...data) {
      if (!(val instanceof App.VC.View)) {
        val = App.VC.View(val, ...data)
      }
      if (val instanceof App.VC.View) {
        this._view = val
      }
      return this
    }
    App.VC.Present.prototype.isAnimated = function(val) {
      if (App._T.bool(val)) {
        this._isAnimated = val
      }
      return this
    }
    App.VC.Present.prototype.isNavigation = function(val) {
      if (App._T.bool(val)) {
        this._isNavigation = val
      }
      return this
    }
    App.VC.Present.prototype.isFullScreen = function(val) {
      if (App._T.bool(val)) {
        this._isFullScreen = val
      }
      return this
    }
    Object.defineProperty(App.VC.Present.prototype, App.JsonKeyName, { get () {
      
      if (!(this._view instanceof App.VC.View)) {
        return null
      }

      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)
      
      const isNavigation = App._T.bool(this._isNavigation) ? this._isNavigation : false

      const nav = isNavigation ? this._view.nav : null
      const tab = this._view.tab

      const isAnimated = App._T.bool(this._isAnimated) ? this._isAnimated : true
      const isFullScreen = App._T.bool(this._isFullScreen) ? this._isFullScreen : false

      if (this._view instanceof App.VC.View.Web && App._T.url(this._view._url)) {

        parent.struct = {
          type: 'webView',
          url: this._view._url,

          nav,
          tab,

          isAnimated,
          isFullScreen,
        }
        return parent
      }

      return null
    } })

  // ======== App.VC.Dismiss
    App.VC.Dismiss = function(isAnimated = true, ...completion) {
      if (!(this instanceof App.VC.Dismiss)) {
        return new App.VC.Dismiss(isAnimated, ...completion)
      }
      App.call(this, 'App.VC.Dismiss', ...completion)
      this._isAnimated = null
      this.isAnimated(isAnimated).feedback('light')
    }
    App.VC.Dismiss.prototype = Object.create(App.prototype)
    App.VC.Dismiss.prototype.isAnimated = function(val) {
      if (App._T.bool(val)) {
        this._isAnimated = val
      }
      return this
    }
    Object.defineProperty(App.VC.Dismiss.prototype, App.JsonKeyName, { get () {
      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

      const isAnimated = App._T.bool(this._isAnimated) && this._isAnimated

      parent.struct = {
        isAnimated,
      }
      return parent
    } })

  // ======== App.VC.Close
    App.VC.Close = function(isAnimated = true, ...completion) {
      if (!(this instanceof App.VC.Close)) {
        return new App.VC.Close(isAnimated, ...completion)
      }
      App.call(this, 'App.VC.Close', ...completion)
      this._isAnimated = true
      this.isAnimated(isAnimated).feedback('light')
    }
    App.VC.Close.prototype = Object.create(App.prototype)
    App.VC.Close.prototype.isAnimated = function(val) {
      if (App._T.bool(val)) {
        this._isAnimated = val
      }
      return this
    }
    Object.defineProperty(App.VC.Close.prototype, App.JsonKeyName, { get () {
      const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

      const isAnimated = App._T.bool(this._isAnimated) && this._isAnimated

      parent.struct = {
        isAnimated,
      }
      return parent
    } })

  // ======== App.VC.Mounted
    App.VC.Mounted = function(...completion) {
      if (!(this instanceof App.VC.Mounted)) {
        return new App.VC.Mounted(...completion)
      }
      App.call(this, 'App.VC.Mounted', ...completion)
    }
    App.VC.Mounted.prototype = Object.create(App.prototype)
    Object.defineProperty(App.VC.Mounted.prototype, App.JsonKeyName, { get () {
      return Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)
    } })

  // ======== App.VC.Nav
    App.VC.Nav = function() {}

    // ======== App.VC.Nav.Push
      App.VC.Nav.Push = function(view = null, isAnimated = true, ...completion) {
        if (!(this instanceof App.VC.Nav.Push)) {
          return new App.VC.Nav.Push(view, isAnimated, ...completion)
        }

        App.call(this, 'App.VC.Nav.Push', ...completion)

        this._view = null
        this._isAnimated = true
        this.view(view).isAnimated(isAnimated).feedback('light')
      }
      App.VC.Nav.Push.prototype = Object.create(App.prototype)
      App.VC.Nav.Push.prototype.view = function(val, ...data) {
        if (!(val instanceof App.VC.View)) {
          val = App.VC.View(val, ...data)
        }
        if (val instanceof App.VC.View) {
          this._view = val
        }
        return this
      }
      App.VC.Nav.Push.prototype.isAnimated = function(val) {
        if (App._T.bool(val)) {
          this._isAnimated = val
        }
        return this
      }
      Object.defineProperty(App.VC.Nav.Push.prototype, App.JsonKeyName, { get () {
        if (!(this._view instanceof App.VC.View)) {
          return null
        }

        const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)
        const nav = this._view.nav
        const tab = this._view.tab
        const isAnimated = App._T.bool(this._isAnimated) ? this._isAnimated : true

        if (this._view instanceof App.VC.View.Web && App._T.url(this._view._url)) {
          parent.struct = {
            type: 'webView',
            url: this._view._url,
            nav,
            tab,
            isAnimated,
          }
          return parent
        }

        return null
      } })

    // ======== App.VC.Nav.Pop
      App.VC.Nav.Pop = function(isAnimated = true, ...completion) {
        if (!(this instanceof App.VC.Nav.Pop)) {
          return new App.VC.Nav.Pop(isAnimated, ...completion)
        }
        App.call(this, 'App.VC.Nav.Pop', ...completion)
        this._isAnimated = true
        this.isAnimated(isAnimated).feedback('light')
      }
      App.VC.Nav.Pop.prototype = Object.create(App.prototype)
      App.VC.Nav.Pop.prototype.isAnimated = function(val) {
        if (App._T.bool(val)) {
          this._isAnimated = val
        }
        return this
      }
      Object.defineProperty(App.VC.Nav.Pop.prototype, App.JsonKeyName, { get () {
        const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)
        
        const isAnimated = App._T.bool(this._isAnimated) ? this._isAnimated : true
        
        parent.struct = {
          isAnimated,
        }
        return parent
      } })

    // ======== App.VC.Nav.Bar
      App.VC.Nav.Bar = function() {}

      // ======== App.VC.Nav.Bar.Hidden
        App.VC.Nav.Bar.Hidden = function(isHidden = true, isAnimated = true, ...completion) {
          if (!(this instanceof App.VC.Nav.Bar.Hidden)) {
            return new App.VC.Nav.Bar.Hidden(isHidden, isAnimated, ...completion)
          }

          App.call(this, 'App.VC.Nav.Bar.Hidden', ...completion)
          this._isHidden = true
          this._isAnimated = true
          this.isHidden(isHidden).isAnimated(isAnimated)
        }
        App.VC.Nav.Bar.Hidden.prototype = Object.create(App.prototype)
        App.VC.Nav.Bar.Hidden.prototype.isHidden = function(val) {
          if (App._T.bool(val)) {
            this._isHidden = val
          }
          return this
        }
        App.VC.Nav.Bar.Hidden.prototype.isAnimated = function(val) {
          if (App._T.bool(val)) {
            this._isAnimated = val
          }
          return this
        }
        Object.defineProperty(App.VC.Nav.Bar.Hidden.prototype, App.JsonKeyName, { get () {
          const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)
          
          const isHidden = App._T.bool(this._isHidden) ? this._isHidden : true
          const isAnimated = App._T.bool(this._isAnimated) ? this._isAnimated : true

          parent.struct = {
            isHidden,
            isAnimated,
          }
          return parent
        } })

      // ======== App.VC.Nav.Bar.Appearance
        App.VC.Nav.Bar.Appearance = function(style = true, ...completion) {
          if (!(this instanceof App.VC.Nav.Bar.Appearance)) {
            return new App.VC.Nav.Bar.Appearance(style, ...completion)
          }

          App.call(this, 'App.VC.Nav.Bar.Appearance', ...completion)
          this._style = true
          this.style(style)
        }
        App.VC.Nav.Bar.Appearance.prototype = Object.create(App.prototype)
        App.VC.Nav.Bar.Appearance.prototype.style = function(style) {
          if (App._T.neStr(style) && App._NavBarAppearance.includes(style)) {
            this._style = style
          }
          return this
        }
        Object.defineProperty(App.VC.Nav.Bar.Appearance.prototype, App.JsonKeyName, { get () {
          const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)
          const style = App._T.neStr(this._style) && App._NavBarAppearance.includes(this._style) ? this._style : App._NavBarAppearance[0]
          parent.struct = { style }
          return parent
        } })

      // ======== App.VC.Nav.Bar.Title
        App.VC.Nav.Bar.Title = function(text = null, ...completion) {
          if (!(this instanceof App.VC.Nav.Bar.Title)) {
            return new App.VC.Nav.Bar.Title(text, ...completion)
          }

          App.call(this, 'App.VC.Nav.Bar.Title', ...completion)
          this._text = ''
          this.text(text)
        }
        App.VC.Nav.Bar.Title.prototype = Object.create(App.prototype)
        App.VC.Nav.Bar.Title.prototype.text = function(val) {
          if (App._T.str(val)) {
            this._text = val
          }
          return this
        }
        Object.defineProperty(App.VC.Nav.Bar.Title.prototype, App.JsonKeyName, { get () {
          const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

          const text = App._T.str(this._text) ? this._text : ''

          parent.struct = {
            text,
          }
          return parent
        } })

      // ======== App.VC.Nav.Bar.Button
        App.VC.Nav.Bar.Button = function(key, text, ...data) {
          if (!(this instanceof App.VC.Nav.Bar.Button)) {
            return new App.VC.Nav.Bar.Button(key, text, ...data)
          }

          App.call(this, key)

          this._text = ''
          this._click = null

          if (App._T.str(text)) {
            this.text(text)
            this.click(...data)
          } else {
            this.text('')
            this.click(text, ...data)
          }
        }
        App.VC.Nav.Bar.Button.prototype = Object.create(App.prototype)
        App.VC.Nav.Bar.Button.prototype.text = function(val) {
          if (App._T.str(val)) {
            this._text = val
          }
          return this
        }
        App.VC.Nav.Bar.Button.prototype.click = function(val, ...params) {
          if (!(val instanceof App)) {
            val = App.Action(val, ...params)
          }

          if (val instanceof App) {
            this._click = val
          }
          return this
        }
        Object.defineProperty(App.VC.Nav.Bar.Button.prototype, App.JsonKeyName, { get () {
          const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

          const text = App._T.str(this._text) ? this._text : ''
          const click = this._click instanceof App ? this._click[App.JsonKeyName] : null

          parent.struct = {
            text,
            click,
          }
          return parent
        } })

        // ======== App.VC.Nav.Bar.Button.Left
          App.VC.Nav.Bar.Button.Left = function(...data) {
            if (this instanceof App.VC.Nav.Bar.Button.Left) {
              App.VC.Nav.Bar.Button.call(this, 'App.VC.Nav.Bar.Button.Left', ...data)
            } else {
              return new App.VC.Nav.Bar.Button.Left(...data)
            }
          }
          App.VC.Nav.Bar.Button.Left.prototype = Object.create(App.VC.Nav.Bar.Button.prototype)
          
        // ======== App.VC.Nav.Bar.Button.Right
          App.VC.Nav.Bar.Button.Right = function(...data) {
            if (this instanceof App.VC.Nav.Bar.Button.Right) {
              App.VC.Nav.Bar.Button.call(this, 'App.VC.Nav.Bar.Button.Right', ...data)
            } else {
              return new App.VC.Nav.Bar.Button.Right(...data)
            }
          }
          App.VC.Nav.Bar.Button.Right.prototype = Object.create(App.VC.Nav.Bar.Button.prototype)
       
  // ======== App.VC.Tab
    App.VC.Tab = function() {}

    // ======== App.VC.Tab.Bar
      App.VC.Tab.Bar = function() {}

      // ======== App.VC.Tab.Bar.Appearance
        App.VC.Tab.Bar.Appearance = function(style = true, ...completion) {
          if (!(this instanceof App.VC.Tab.Bar.Appearance)) {
            return new App.VC.Tab.Bar.Appearance(style, ...completion)
          }

          App.call(this, 'App.VC.Tab.Bar.Appearance', ...completion)
          this._style = true
          this.style(style)
        }
        App.VC.Tab.Bar.Appearance.prototype = Object.create(App.prototype)
        App.VC.Tab.Bar.Appearance.prototype.style = function(style) {
          if (App._T.neStr(style) && App._TabBarAppearance.includes(style)) {
            this._style = style
          }
          return this
        }
        Object.defineProperty(App.VC.Tab.Bar.Appearance.prototype, App.JsonKeyName, { get () {
          const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)
          const style = App._T.neStr(this._style) && App._TabBarAppearance.includes(this._style) ? this._style : App._TabBarAppearance[0]
          parent.struct = { style }
          return parent
        } })
   
      // ======== App.VC.Tab.Bar.Title
        App.VC.Tab.Bar.Title = function(text = null, ...completion) {
          if (!(this instanceof App.VC.Tab.Bar.Title)) {
            return new App.VC.Tab.Bar.Title(text, ...completion)
          }

          App.call(this, 'App.VC.Tab.Bar.Title', ...completion)
          this._text = null
          this.text(text)
        }
        App.VC.Tab.Bar.Title.prototype = Object.create(App.prototype)
        App.VC.Tab.Bar.Title.prototype.text = function(val) {
          if (App._T.str(val)) {
            this._text = val
          }
          return this
        }
        Object.defineProperty(App.VC.Tab.Bar.Title.prototype, App.JsonKeyName, { get () {
          const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

          const text = App._T.str(this._text) ? this._text : null

          parent.struct = {
            text,
          }
          return parent
        } })

  // ======== App.VC.Test
    App.VC.Test = function(text, click = null) {
      if (!(this instanceof App.VC.Test)) {
        return new App.VC.Test(text, click)
      }
    }

    App.VC.Test.prototype = Object.create(App.prototype)
    Object.defineProperty(App.VC.Test.prototype, App.JsonKeyName, { get () {
      return {
        title: null,
      }
    } })

// ======== App.GPS
  App.GPS = function(key, ...completion) {
    if (!(this instanceof App.GPS)) {
      return new App.GPS(key, ...completion)
    }

    App.call(this, key, ...completion)

  }
  App.GPS.prototype = Object.create(App.prototype)

  Object.defineProperty(App.GPS.prototype, App.JsonKeyName, { get () {
    return Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)
  } })
  
  // ======== App.GPS.Start
    App.GPS.Start = function(...data) {
      if (!(this instanceof App.GPS.Start)) {
        return new App.GPS.Start(...data)
      }

      App.GPS.call(this, 'App.GPS.Start', ...data)
    }
    App.GPS.Start.prototype = Object.create(App.GPS.prototype)

  // ======== App.GPS.Stop
    App.GPS.Stop = function(...data) {
      if (!(this instanceof App.GPS.Stop)) {
        return new App.GPS.Stop(...data)
      }

      App.GPS.call(this, 'App.GPS.Stop', ...data)
    }
    App.GPS.Stop.prototype = Object.create(App.GPS.prototype)


  // ======== App.GPS.Require
    App.GPS.Require = function() {}

    // ======== App.GPS.Require.WhenInUse
      App.GPS.Require.WhenInUse = function(...data) {
        if (!(this instanceof App.GPS.Require.WhenInUse)) {
          return new App.GPS.Require.WhenInUse(...data)
        }

        App.GPS.call(this, 'App.GPS.Require.WhenInUse', ...data)
      }
      App.GPS.Require.WhenInUse.prototype = Object.create(App.GPS.prototype)

    // ======== App.GPS.Require.Always
      App.GPS.Require.Always = function(...data) {
        if (!(this instanceof App.GPS.Require.Always)) {
          return new App.GPS.Require.Always(...data)
        }

        App.GPS.call(this, 'App.GPS.Require.Always', ...data)
      }
      App.GPS.Require.Always.prototype = Object.create(App.GPS.prototype)

  // ======== App.GPS.Refresh
    App.GPS.Refresh = function() {}

    // ======== App.GPS.Refresh.Status
      App.GPS.Refresh.Status = function(...data) {
        if (!(this instanceof App.GPS.Refresh.Status)) {
          return new App.GPS.Refresh.Status(...data)
        }

        App.GPS.call(this, 'App.GPS.Refresh.Status', ...data)
      }
      App.GPS.Refresh.Status.prototype = Object.create(App.GPS.prototype)

    // ======== App.GPS.Refresh.Location
      App.GPS.Refresh.Location = function(...data) {
        if (!(this instanceof App.GPS.Refresh.Location)) {
          return new App.GPS.Refresh.Location(...data)
        }

        App.GPS.call(this, 'App.GPS.Refresh.Location', ...data)
      }
      App.GPS.Refresh.Location.prototype = Object.create(App.GPS.prototype)

    // ======== App.GPS.Refresh.isRunning
      App.GPS.Refresh.isRunning = function(...data) {
        if (!(this instanceof App.GPS.Refresh.isRunning)) {
          return new App.GPS.Refresh.isRunning(...data)
        }

        App.GPS.call(this, 'App.GPS.Refresh.isRunning', ...data)
      }
      App.GPS.Refresh.isRunning.prototype = Object.create(App.GPS.prototype)

  // ======== App.GPS.Get
    App.GPS.Get = function() {}

    // ======== App.GPS.Get.Status
      App.GPS.Get.Status = function(...data) {
        if (!(this instanceof App.GPS.Get.Status)) {
          return new App.GPS.Get.Status(...data)
        }

        App.GPS.call(this, 'App.GPS.Get.Status', ...data)
      }
      
      App.GPS.Get.Status.prototype = Object.create(App.GPS.prototype)
      
    // ======== App.GPS.Get.Location
      App.GPS.Get.Location = function(...data) {
        if (!(this instanceof App.GPS.Get.Location)) {
          return new App.GPS.Get.Location(...data)
        }

        App.GPS.call(this, 'App.GPS.Get.Location', ...data)
      }
      
      App.GPS.Get.Location.prototype = Object.create(App.GPS.prototype)
      
    // ======== App.GPS.Get.isRunning
      App.GPS.Get.isRunning = function(...data) {
        if (!(this instanceof App.GPS.Get.isRunning)) {
          return new App.GPS.Get.isRunning(...data)
        }

        App.GPS.call(this, 'App.GPS.Get.isRunning', ...data)
      }
      
      App.GPS.Get.isRunning.prototype = Object.create(App.GPS.prototype)
      