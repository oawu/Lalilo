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

  if (_T.func(App.$.Feedback) && !_T.func(App.$.Feedback.Heavy)) {
    const Feedback = App.$.Feedback
    
    const Heavy = function() {
      if (this instanceof Heavy) {
        Feedback.call(this, 'heavy')
      } else {
        return new Heavy()
      }
    }
    Heavy.prototype = Object.create(Feedback.prototype)
    Feedback.Heavy = Heavy
  }

  if (_T.func(App.Feedback) && _T.func(App.$.Feedback.Heavy) && !_T.func(App.Feedback.Heavy)) {
    App.Feedback.Heavy = _ => new Promise((resolve, reject) => App.$.Feedback.Heavy().completion(resolve).emit(error => error && reject(error)))
  }
})()
