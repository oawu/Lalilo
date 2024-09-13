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

  if (T.func(App.$.EMU) && !T.func(App.$.EMU.OnScroll)) {

    const { CMD, Delay } = App.$.EMU

    const OnScroll = (struct, completion, data = 'undefined') => {
      const title = 'OnScroll'

      if (!T.obj(struct)) {
        return console.error(`🔴 ${title} 的 struct 錯誤`)
      }
      if (!T.num(struct.scrollTop)) {
        return console.error(`🔴 ${title} 的 struct.scrollTop 錯誤`)
      }
      if (!T.num(struct.clientHeight)) {
        return console.error(`🔴 ${title} 的 struct.clientHeight 錯誤`)
      }
      if (!T.num(struct.scrollHeight)) {
        return console.error(`🔴 ${title} 的 struct.scrollHeight 錯誤`)
      }

      setTimeout(_ => {
        console.log(`OnScroll, scrollTop：${struct.scrollTop}, clientHeight：${struct.clientHeight}, scrollHeight：${struct.scrollHeight}`);
        T.obj(completion) && CMD(completion)
      }, Delay)
    }

    App.$.EMU.OnScroll = OnScroll
  }
})()
