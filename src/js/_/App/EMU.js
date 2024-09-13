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

  if (!T.func(App.$.EMU)) {

    const Delay = 1000

    const CMD = (cmd, data = 'undefined') => {
      if (cmd.name == 'Action.Func' && T.func(App.$.EMU) && T.func(App.$.EMU.Action) && T.func(App.$.EMU.Action.Func)) { return App.$.EMU.Action.Func(cmd.struct, cmd.completion, data) }
      if (cmd.name == 'Action.Emit' && T.func(App.$.EMU) && T.func(App.$.EMU.Action) && T.func(App.$.EMU.Action.Emit)) { return App.$.EMU.Action.Emit(cmd.struct, cmd.completion, data) }
      if (cmd.name == 'Log'         && T.func(App.$.EMU) && T.func(App.$.EMU.Log))                                     { return App.$.EMU.Log(cmd.struct, cmd.completion, data) }
      if (cmd.name == 'Feedback'    && T.func(App.$.EMU) && T.func(App.$.EMU.Feedback))                                { return App.$.EMU.Feedback(cmd.struct, cmd.completion, data) }
      if (cmd.name == 'OnScroll'    && T.func(App.$.EMU) && T.func(App.$.EMU.OnScroll))                                { return App.$.EMU.OnScroll(cmd.struct, cmd.completion, data) }
      return console.error(`🔴 EMU 沒有匹配的 name「${cmd.name}」`)
    }

    const EMU = function(param, data = undefined) {
      if (!App.isWeb) {
        return console.error(`🔴 EMU 錯誤，沒有 window.Bridge.type 必須為 Web`)
      }

      if (!T.str(param)) {
        return console.error(`🔴 EMU 錯誤，param 必須為 String`)
      }

      try {
        param = JSON.parse(param)
      } catch (e) {
        param = e
      }

      if (param instanceof Error) {
        return console.error(`🔴 EMU 錯誤，轉換 Json 失敗，錯誤原因：${error.message}`)
      }

      if (!T.obj(param)) {
        return console.error(`🔴 EMU 錯誤，格式不是 Json`)
      }

      if (!T.str(param.name)) {
        return console.error(`🔴 EMU 格式錯誤，沒有 name`)
      }

      CMD(param, data)
    }
    EMU.CMD = CMD
    EMU.Delay = Delay

    App.$.EMU = EMU
  }
})()
