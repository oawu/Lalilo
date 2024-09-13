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

  if (T.func(App.$.Feedback) && !T.func(App.$.Feedback.Soft)) {
    const Feedback = App.$.Feedback
    
    const Soft = function() {
      if (this instanceof Soft) {
        Feedback.call(this, 'soft')
      } else {
        return new Soft()
      }
    }
    Soft.prototype = Object.create(Feedback.prototype)
    Feedback.Soft = Soft
  }

  if (T.func(App.Feedback) && T.func(App.$.Feedback.Soft) && !T.func(App.Feedback.Soft)) {
    App.Feedback.Soft = _ => new Promise((resolve, reject) => App.$.Feedback.Soft().completion(resolve).emit(error => error && reject(error)))
  }
})()
