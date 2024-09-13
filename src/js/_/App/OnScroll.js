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
  
  if (!T.func(App.$.OnScroll)) {
    const CMD = App._CMD
    
    const OnScroll = function (data) {
      if (!(this instanceof OnScroll)) {
        return new OnScroll(data)
      }

      CMD.call(this, 'OnScroll')

      this.$.struct = null
      this.data(data)
    }
    OnScroll.prototype = Object.create(CMD.prototype)
    OnScroll.prototype.data = function(data) {
      if (T.obj(data) && T.num(data.scrollTop) && T.num(data.clientHeight) && T.num(data.scrollHeight)) {
        this.$.struct = data
      }
      return this
    }
    OnScroll.prototype._vaild = function(style) {
      const vaild = CMD.prototype._vaild.call(this)
      if (vaild instanceof Error) {
        return vaild
      }
      
      if (!(T.obj(this.$.struct) && T.num(this.$.struct.scrollTop) && T.num(this.$.struct.clientHeight) && T.num(this.$.struct.scrollHeight))) {
        return new Error('Struce 錯誤')
      }

      return null
    }
    App.$.OnScroll = OnScroll
  }

  if (T.func(App.$.OnScroll) && !T.func(App.OnScroll)) {
    App.OnScroll = (...data) => new Promise((resolve, reject) => App.$.OnScroll(...data).completion(resolve).emit(error => error && reject(error)))
  }
})()
