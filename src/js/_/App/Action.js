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

  if (!T.func(App.$.Action)) {
    const Action = function(...data) {
      const v1 = data.shift()

      if (T.func(v1) && T.func(App.$.Action.Func)) {
        return App.$.Action.Func(v1, ...data)
      }

      if (T.str(v1) && T.func(App.$.Action.Emit)) {
        return App.$.Action.Emit(v1, ...data)
      }

      return null
    }

    App.$.Action = Action
  }

  if (!T.func(App.Action)) {
    const Action = function(...data) {
      const v1 = data.shift()

      if (T.str(v1) && T.func(App.Action.Emit)) {
        return App.Action.Emit !== undefined
          ? App.Action.Emit(v1, ...data)
          : null
      }

      if (T.func(App.Action.Func)) {
        return App.Action.Func !== undefined
          ? App.Action.Func(T.func(v1) ? v1 : undefined, ...data)
          : null
      }

      return null
    }

    App.Action = Action
  }

})()
