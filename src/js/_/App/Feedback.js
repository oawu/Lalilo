/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

void (_ => {
  if (typeof window.App == 'undefined') { return }
  
  const App = window.App
  const _T = App._T
  
  if (!_T.func(App.$.Feedback)) {
    const CMD = App._CMD

    const Feedback = function(style) {
      if (!(this instanceof Feedback)) {
        return new Feedback(style)
      }
      
      CMD.call(this, 'Feedback')
      this.$.struct = null
      this.style(style)
    }
    Feedback.prototype = Object.create(CMD.prototype)
    Feedback.prototype.style = function(style) {
      if (_T.str(style)) {
        this.$.struct = style
      }
      return this
    }
    Feedback.prototype._vaild = function(style) {
      const vaild = CMD.prototype._vaild.call(this)
      if (vaild instanceof Error) {
        return vaild
      }
      
      if (!(_T.str(this.$.struct) && ['light', 'heavy', 'medium', 'soft', 'rigid', 'error', 'success', 'warning'].includes(this.$.struct))) {
        return new Error('style 錯誤')
      }

      return null
    }

    App.$.Feedback = Feedback
  }

  if (_T.func(App.$.Feedback) && !_T.func(App.Feedback)) {
    App.Feedback = function(style) {
      return new Promise(
        (resolve, reject) => App.$.Feedback(style).completion(resolve).emit(
          error => error && reject(error)))
    }
  }
})()
