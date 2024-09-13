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

  if (T.func(App.$.Feedback) && !T.func(App.$.Feedback.Rigid)) {
    const Feedback = App.$.Feedback
    
    const Rigid = function() {
      if (this instanceof Rigid) {
        Feedback.call(this, 'rigid')
      } else {
        return new Rigid()
      }
    }
    Rigid.prototype = Object.create(Feedback.prototype)
    Feedback.Rigid = Rigid
  }

  if (T.func(App.Feedback) && T.func(App.$.Feedback.Rigid) && !T.func(App.Feedback.Rigid)) {
    App.Feedback.Rigid = _ => new Promise((resolve, reject) => App.$.Feedback.Rigid().completion(resolve).emit(error => error && reject(error)))
  }
})()
