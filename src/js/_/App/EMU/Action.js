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

  if (T.func(App.$.EMU) && !T.func(App.$.EMU.Action)) {
    App.$.EMU.Action = _ => {}
  }
})()
