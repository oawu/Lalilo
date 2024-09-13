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

  if (T.func(App.$.Feedback) && !T.func(App.$.Feedback.Light)) {
    const Feedback = App.$.Feedback
    
    const Light = function() {
      if (this instanceof Light) {
        Feedback.call(this, 'light')
      } else {
        return new Light()
      }
    }
    Light.prototype = Object.create(Feedback.prototype)
    Feedback.Light = Light
  }

  if (T.func(App.Feedback) && T.func(App.$.Feedback.Light) && !T.func(App.Feedback.Light)) {
    App.Feedback.Light = _ => new Promise((resolve, reject) => App.$.Feedback.Light().completion(resolve).emit(error => error && reject(error)))
  }
})()
