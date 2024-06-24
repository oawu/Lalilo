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
App._ActionEmitGoalEnum = ['this', 'prev']

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

// ======== App._D
  App._D = function(timer = null, food = undefined, watch = _ => _ === undefined) {
    if (!(this instanceof App._D)) {
      return new App._D(timer, food, watch)
    }

    this._food = food
    this._watch = t => t !== undefined
    this._timer = 100
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
      console.error(params);
      
      
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

      this.key(key).param(param).goal(App._ActionEmitGoalEnum[0])
    }
    App.Action.Emit.prototype = Object.create(App.prototype)
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

      this._navBarHidden = false
      this._navTitle = ''

      return null
    }

    App.VC.View.prototype.navBarHidden = function(val) {
      if (App._T.bool(val)) {
        this._navBarHidden = val
      }
      return this
    }
    App.VC.View.prototype.navTitle = function(val) {
      if (App._T.str(val)) {
        this._navTitle = val
      }
      return this
    }

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

      const nav = isNavigation ? {
        barHidden: App._T.bool(this._view._navBarHidden) ? this._view._navBarHidden : false,
        title: App._T.str(this._view._navTitle) ? this._view._navTitle : '',
        left: App.VC.Nav.SetLeft(),
        right: App.VC.Nav.SetRight(),
      } : null
      const isAnimated = App._T.bool(this._isAnimated) ? this._isAnimated : true
      const isFullScreen = App._T.bool(this._isFullScreen) ? this._isFullScreen : false

      if (this._view instanceof App.VC.View.Web && App._T.url(this._view._url)) {

        parent.struct = {
          type: 'webView',
          url: this._view._url,

          nav,
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

        const nav = {
          barHidden: App._T.bool(this._view._navBarHidden) ? this._view._navBarHidden : false,
          title: App._T.str(this._view._navTitle) ? this._view._navTitle : '',
          left: App.VC.Nav.SetLeft(),
          right: App.VC.Nav.SetRight(),
        }
        const isAnimated = App._T.bool(this._isAnimated) ? this._isAnimated : true

        if (this._view instanceof App.VC.View.Web && App._T.url(this._view._url)) {
          parent.struct = {
            type: 'webView',
            url: this._view._url,
            nav,
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

    // ======== App.VC.Nav.SetBarHidden
      App.VC.Nav.SetBarHidden = function(isHidden = true, isAnimated = true, ...completion) {
        if (!(this instanceof App.VC.Nav.SetBarHidden)) {
          return new App.VC.Nav.SetBarHidden(isHidden, isAnimated, ...completion)
        }

        App.call(this, 'App.VC.Nav.SetBarHidden', ...completion)
        this._isHidden = true
        this._isAnimated = true
        this.isHidden(isHidden).isAnimated(isAnimated)
      }
      App.VC.Nav.SetBarHidden.prototype = Object.create(App.prototype)
      App.VC.Nav.SetBarHidden.prototype.isHidden = function(val) {
        if (App._T.bool(val)) {
          this._isHidden = val
        }
        return this
      }
      App.VC.Nav.SetBarHidden.prototype.isAnimated = function(val) {
        if (App._T.bool(val)) {
          this._isAnimated = val
        }
        return this
      }
      Object.defineProperty(App.VC.Nav.SetBarHidden.prototype, App.JsonKeyName, { get () {
        const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)
        
        const isHidden = App._T.bool(this._isHidden) ? this._isHidden : true
        const isAnimated = App._T.bool(this._isAnimated) ? this._isAnimated : true

        parent.struct = {
          isHidden,
          isAnimated,
        }
        return parent
      } })

    // ======== App.VC.Nav.SetTitle
      App.VC.Nav.SetTitle = function(text = null, ...completion) {
        if (!(this instanceof App.VC.Nav.SetTitle)) {
          return new App.VC.Nav.SetTitle(text, ...completion)
        }

        App.call(this, 'App.VC.Nav.SetTitle', ...completion)
        this._text = ''
        this.text(text)
      }
      App.VC.Nav.SetTitle.prototype = Object.create(App.prototype)
      App.VC.Nav.SetTitle.prototype.text = function(val) {
        if (App._T.str(val)) {
          this._text = val
        }
        return this
      }
      Object.defineProperty(App.VC.Nav.SetTitle.prototype, App.JsonKeyName, { get () {
        const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

        const text = App._T.str(this._text) ? this._text : ''

        parent.struct = {
          text,
        }
        return parent
      } })

    // ======== App.VC.Nav.SetBarButton
      App.VC.Nav.SetBarButton = function(key, text, ...data) {
        if (!(this instanceof App.VC.Nav.SetBarButton)) {
          return new App.VC.Nav.SetBarButton(key, text, ...data)
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
      App.VC.Nav.SetBarButton.prototype = Object.create(App.prototype)
      App.VC.Nav.SetBarButton.prototype.text = function(val) {
        if (App._T.str(val)) {
          this._text = val
        }
        return this
      }
      App.VC.Nav.SetBarButton.prototype.click = function(val, ...params) {
        if (!(val instanceof App)) {
          val = App.Action(val, ...params)
        }

        if (val instanceof App) {
          this._click = val
        }
        return this
      }
      Object.defineProperty(App.VC.Nav.SetBarButton.prototype, App.JsonKeyName, { get () {
        const parent = Object.getOwnPropertyDescriptor(App.prototype, App.JsonKeyName).get.call(this)

        const text = App._T.str(this._text) ? this._text : ''
        const click = this._click instanceof App ? this._click[App.JsonKeyName] : null

        parent.struct = {
          text,
          click,
        }
        return parent
      } })

    // ======== App.VC.Nav.SetLeft
      App.VC.Nav.SetLeft = function(...data) {
        if (this instanceof App.VC.Nav.SetLeft) {
          App.VC.Nav.SetBarButton.call(this, 'App.VC.Nav.SetLeft', ...data)
        } else {
          return new App.VC.Nav.SetLeft(...data)
        }
      }
      App.VC.Nav.SetLeft.prototype = Object.create(App.VC.Nav.SetBarButton.prototype)
      
    // ======== App.VC.Nav.SetRight
      App.VC.Nav.SetRight = function(...data) {
        if (this instanceof App.VC.Nav.SetRight) {
          App.VC.Nav.SetBarButton.call(this, 'App.VC.Nav.SetRight', ...data)
        } else {
          return new App.VC.Nav.SetRight(...data)
        }
      }
      App.VC.Nav.SetRight.prototype = Object.create(App.VC.Nav.SetBarButton.prototype)
      
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
      