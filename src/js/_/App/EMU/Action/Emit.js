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

  if (T.func(App.$.EMU) && T.func(App.$.EMU.Action) && !T.func(App.$.EMU.Action.Emit)) {
    const { CMD, Delay } = App.$.EMU
    const Action = App.$.EMU.Action

    const Emit = (struct, completion, data = 'undefined') => {
      const title = 'Action.Emit'

      if (!T.obj(struct)) {
        return console.error(`🔴 ${title} 的 struct 錯誤`)
      }

      if (!T.str(struct.key)) {
        return console.error(`🔴 ${title} 的 struct.key 錯誤`)
      }

      if (T.bool(struct.each) && struct.each) {
        console.log(`⚠️ 全部頁面執行 key：${struct.key}。`)
      }

      setTimeout(_ => {
        const str = `window.App._Exec.emit("${struct.key}", ${data}, ${struct.param})`

        try {
          eval(str)
          console.log(`🎉 執行 ${str} - ok`)
        } catch(_) {
          console.log(`🎉 執行 ${str} - err - ${_}`)
        }

        T.obj(completion) && CMD(completion)
      }, Delay)
    }

    Action.Emit = Emit
  }
})()
