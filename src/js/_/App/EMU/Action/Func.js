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

  if (T.func(App.$.EMU) && T.func(App.$.EMU.Action) && !T.func(App.$.EMU.Action.Func)) {

    const { CMD, Delay } = App.$.EMU
    const Action = App.$.EMU.Action

    const Func = (struct, completion, data = 'undefined') => {
      const title = 'Action.Func'

      if (!T.obj(struct)) {
        return console.error(`🔴 ${title} 的 struct 錯誤`)
      }

      if (!T.num(struct.id) && struct.id > 0) {
        return console.error(`🔴 ${title} 的 struct.id 錯誤`)
      }

      setTimeout(_ => {
        const str = `window.App._Exec.func(${struct.id}, ${data})`
        
        try {
          eval(str)
          console.log(`🎉 執行 ${str} - ok`)
        } catch(_) {
          console.log(`🎉 執行 ${str} - err - ${_}`)
        }

        T.obj(completion) && CMD(completion)
      }, Delay)
    }

    Action.Func = Func
  }
})()
