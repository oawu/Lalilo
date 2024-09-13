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

  if (T.func(App.$.Feedback) && !T.func(App.$.Feedback.Medium)) {
    const Feedback = App.$.Feedback
    
    const Medium = function() {
      if (this instanceof Medium) {
        Feedback.call(this, 'medium')
      } else {
        return new Medium()
      }
    }
    Medium.prototype = Object.create(Feedback.prototype)
    Feedback.Medium = Medium
  }

  if (T.func(App.Feedback) && T.func(App.$.Feedback.Medium) && !T.func(App.Feedback.Medium)) {
    App.Feedback.Medium = _ => new Promise((resolve, reject) => App.$.Feedback.Medium().completion(resolve).emit(error => error && reject(error)))
  }
})()
