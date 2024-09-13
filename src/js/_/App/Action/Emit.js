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

  if (T.func(App.$.Action) && !T.func(App.$.Action.Emit)) {
    const CMD = App._CMD

    const Emit = function(key, param = undefined, each = false) {
      if (!(this instanceof Emit)) {
        return new Emit(key, param, each)
      }
      
      CMD.call(this, 'Action.Emit')
      
      this.$.struct = {
        key: null,
        param: undefined,
        each: false,
      }

      this.key(key)
      this.param(param)
      this.each(each)
    }
    Emit.prototype = Object.create(CMD.prototype)
    Emit.prototype.key = function(val) {
      if (T.str(val)) {
        this.$.struct.key = val
      }
      return this
    }
    Emit.prototype.param = function(val) {
      try {
        val = JSON.stringify(JSON.stringify(val))
      } catch (e) {
        val = undefined
      }
      this.$.struct.param = val

      return this
    }
    Emit.prototype.each = function(val) {
      if (T.bool(val)) {
        this.$.struct.each = val
      }
      return this
    }
    Emit.prototype._vaild = function() {
      const vaild = CMD.prototype._vaild.call(this)

      if (vaild instanceof Error) {
        return vaild
      }

      if (!T.str(this.$.struct.key)) {
        return new Error('key 錯誤')
      }

      return null
    }

    App.$.Action.Emit = Emit
  }

  if (T.func(App.Action) && T.func(App.$.Action.Emit) && !T.func(App.Action.Emit)) {
    App.Action.Emit = (key, param = undefined, each = false) => new Promise(
      (resolve, reject) => App.$.Action.Emit(key, param, each).completion(resolve).emit(
        error => error && reject(error)))
  }
})()
