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

  if (T.func(App.$.Feedback) && !T.func(App.$.Feedback.Warning)) {
    const Feedback = App.$.Feedback
    
    const Warning = function() {
      if (this instanceof Warning) {
        Feedback.call(this, 'warning')
      } else {
        return new Warning()
      }
    }
    Warning.prototype = Object.create(Feedback.prototype)
    Feedback.Warning = Warning
  }

  if (T.func(App.Feedback) && T.func(App.$.Feedback.Warning) && !T.func(App.Feedback.Warning)) {
    App.Feedback.Warning = _ => new Promise((resolve, reject) => App.$.Feedback.Warning().completion(resolve).emit(error => error && reject(error)))
  }
})()
