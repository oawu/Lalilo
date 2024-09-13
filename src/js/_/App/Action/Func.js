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
  
  if (T.func(App.$.Action) && !T.func(App.$.Action.Func)) {
    const CMD = App._CMD

    let _Id = 0
    const _Map = new Map()

    const Func = function(func, isOnce = true) {
      if (!(this instanceof Func)) {
        return new Func(func, isOnce)
      }

      CMD.call(this, 'Action.Func')

      const id = ++_Id

      this._ = {
        id,
        func: null,
        isOnce: true
      }

      this.func(func)
      this.isOnce(isOnce)

      this.$.struct = { id }
      _Map.set(this.$.struct.id, this)
    }
    Func.prototype = Object.create(CMD.prototype)
    Func.prototype.func = function(val) {
      if (T.func(val)) {
        this._.func = val
      }
      return this
    }
    Func.prototype.isOnce = function(val) {
      if (T.bool(val)) {
        this._.isOnce = val
      }
      return this
    }
    Func.prototype._vaild = function() {
      const vaild = CMD.prototype._vaild.call(this)
      if (vaild instanceof Error) {
        return vaild
      }
      
      if (!(T.num(this.$.struct.id) && this.$.struct.id > 0)) {
        return new Error('id 錯誤')
      }

      if (!T.func(this._.func)) {
        return new Error('沒有設定 func')
      }

      if (_Map.get(this.$.struct.id) !== this) {
        return new Error('Func map 沒有此筆紀錄')
      }

      return null
    }
    Func.Map = _Map

    App.$.Action.Func = Func
  }

  if (T.func(App.Action) && T.func(App.$.Action.Func) && !T.func(App.Action.Func)) {
    App.Action.Func = (func = undefined, isOnce = true) => T.func(func)
      ? App.$.Action.Func(func, isOnce).emit()
      : new Promise(
        (resolve, reject) => App.$.Action.Func(resolve, true).emit(
          error => error && reject(error)))
  }
})()
