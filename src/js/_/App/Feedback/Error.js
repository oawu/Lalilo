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

  if (T.func(App.$.Feedback) && !T.func(App.$.Feedback.Error)) {
    const Feedback = App.$.Feedback

    const Error = function() {
      if (this instanceof Error) {
        Feedback.call(this, 'error')
      } else {
        return new Error()
      }
    }
    Error.prototype = Object.create(Feedback.prototype)
    Feedback.Error = Error
  }

  if (T.func(App.Feedback) && T.func(App.$.Feedback.Error) && !T.func(App.Feedback.Error)) {
    App.Feedback.Error = _ => new Promise((resolve, reject) => App.$.Feedback.Error().completion(resolve).emit(error => error && reject(error)))
  }
})()
