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
          { key: 'T()',   text: 'Title()' },
          { key: 'T("")', text: 'Title("")' },
          { key: 'T("str")', text: 'Title("str")' },
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

      if (task.key == 'T()') { closure(App.VC.Tab.Bar.Title()) }
      if (task.key == 'T("")') { closure(App.VC.Tab.Bar.Title("")) }
      if (task.key == 'T("str")') { closure(App.VC.Tab.Bar.Title("str")) }
    },
  },
  template: `
    Tool => :groups=groups   @click=click
      `
})
