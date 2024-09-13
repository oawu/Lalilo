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

  if (T.func(App.$.Feedback) && !T.func(App.$.Feedback.Success)) {
    const Feedback = App.$.Feedback
    
    const Success = function() {
      if (this instanceof Success) {
        Feedback.call(this, 'success')
      } else {
        return new Success()
      }
    }
    Success.prototype = Object.create(Feedback.prototype)
    Feedback.Success = Success
  }

  if (T.func(App.Feedback) && T.func(App.$.Feedback.Success) && !T.func(App.Feedback.Success)) {
    App.Feedback.Success = _ => new Promise((resolve, reject) => App.$.Feedback.Success().completion(resolve).emit(error => error && reject(error)))
  }
})()
