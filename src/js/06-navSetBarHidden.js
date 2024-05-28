/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    groups: [
      {
        header: '顯示',
        items: [
          { key: 'B(false)', text: 'BarHidden(false)' },
          { key: 'B(false, false)', text: 'BarHidden(false, false)' },
          { key: 'B(false, true)', text: 'BarHidden(false, true)' },
          
          
        ]
      },
      {
        header: '隱藏',
        items: [
          { key: 'B(true)', text: 'BarHidden(true)' },
          { key: 'B(true, false)', text: 'BarHidden(true, false)' },
          { key: 'B(true, true)', text: 'BarHidden(true, true)' },
        ]
      },
    ],
  },
  mounted () {
    App.VC.Mounted().emit()
  },
  methods: {
    click (task, func1, closure) {
      if (typeof closure != 'function') {
        return
      }

      if (task === null) {
        return closure(null)
      }

      // ====================================

      if (task.key == 'B()') { closure(App.VC.Nav.SetBarHidden()) }
      if (task.key == 'B(false)') { closure(App.VC.Nav.SetBarHidden(false)) }
      if (task.key == 'B(true)') { closure(App.VC.Nav.SetBarHidden(true)) }
      
      if (task.key == 'B(false, false)') { closure(App.VC.Nav.SetBarHidden(false, false)) }
      if (task.key == 'B(true, false)') { closure(App.VC.Nav.SetBarHidden(true, false)) }
      
      if (task.key == 'B(false, true)') { closure(App.VC.Nav.SetBarHidden(false, true)) }
      if (task.key == 'B(true, true)') { closure(App.VC.Nav.SetBarHidden(true, true)) }
    },
  },
  template: `
    Tool => :groups=groups   @click=click
      `
})
