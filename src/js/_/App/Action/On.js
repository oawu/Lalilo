/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  if (typeof window.App == 'undefined') { return }

  const App = window.App
  const T = App._T

  if (T.func(App.$.Action) && !T.obj(App.$.Action.On)) {
    let _Map = new Map()
    const _Funcs = []

    const _getFuncs = key => {
      if (!T.str(key)) {
        return []
      }

      let funcs = _Map.get(key)

      return Array.isArray(funcs)
        ? funcs.filter(T.func)
        : []
    }
    const _setFuncs = function (key, funcs) {
      if (!T.str(key)) {
        return this
      }

      funcs = Array.isArray(funcs) ? funcs.filter(T.func) : []

      _Map.set(key, funcs)

      if (funcs.length) {
        _Funcs.forEach(func => T.func(func) && setTimeout(_ => func(this)))
        return this
      }

      _Map.delete(key)
      _Funcs.forEach(func => T.func(func) && setTimeout(_ => func(this)))
      return this
    }
    const _setFunc = function (key, func) {
      if (!(T.str(key) && T.func(func))) {
        return this
      }

      const funcs = _getFuncs.call(this, key)
      funcs.push(func)
      _setFuncs.call(this, key, funcs)

      return this
    }
    const _keys = _ => {
      const keys = []
      for (let [key, _] of _Map) {
        if (T.str(key)) {
          keys.push(key)
        }
      }
      return keys
    }
    const _vals = _ => _keys().map(_getFuncs).reduce((a, b) => a.concat(b), [])
    const _struct = _ => _keys().map(key => ({ key, funcs: _getFuncs(key) }))
    const _subscribe = function (func) {
      if (T.func(func)) {
        _Funcs.push(func)
      }
      return this
    }
    const _remove = function (key = undefined, func = undefined) {
      if (!T.str(key)) { // 全刪
        keys().map(key => _setFuncs.call(this, key, []))
        _Map = new Map()
        return this
      }

      if (!T.func(func)) {
        return _setFuncs.call(this, key, [])
      }

      const funcs = _getFuncs.call(this, key)
      if (funcs.includes(func)) {
        const i = funcs.indexOf(func)
        if (i != -1) {
          funcs.splice(i, 1)
        }
      }

      return _setFuncs.call(this, key, funcs)
    }

    App.$.Action.On = {
      get keys () { return _keys() },
      get vals () { return _vals() },
      get struct () { return _struct() },
      subscribe: _subscribe,
      setFunc: _setFunc,
      getFuncs: _getFuncs,
      remove: _remove,
    }
  }

  if (T.func(App.Action) && T.obj(App.$.Action.On) && !T.func(App.Action.On)) {
    App.Action.On = (key, func) => App.$.Action.On.setFunc(key, func)
  }
})()
