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
  
  if (!T.func(App.$.Log)) {
    const { _CMD: CMD, _toStr: toStr } = App
    
    const Log = function (...data) {
      if (!(this instanceof Log)) {
        return new Log(...data)
      }

      CMD.call(this, 'Log')

      this.$.struct = []
      this.data(...data)
    }
    Log.prototype = Object.create(CMD.prototype)
    Log.prototype.data = function(...vals) {
      this.$.struct = T.arr(vals) ? vals.map(toStr) : []
      return this
    }
    App.$.Log = Log
  }

  if (T.func(App.$.Log) && !T.func(App.Log)) {
    App.Log = (...data) => new Promise((resolve, reject) => App.$.Log(...data).completion(resolve).emit(error => error && reject(error)))
  }
})()
