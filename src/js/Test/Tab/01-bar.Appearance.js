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
        header: '',
        items: [
          { key: 'A(auto)', text: 'Appearance(auto)' },
          { key: 'A(show)', text: 'Appearance(show)' },
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

      if (task.key == 'A(auto)') { closure(App.VC.Tab.Bar.Appearance('auto')) }
      if (task.key == 'A(show)') { closure(App.VC.Tab.Bar.Appearance('show')) }
    },
  },
  template: `
    Tool => :groups=groups   @click=click
      `
})
