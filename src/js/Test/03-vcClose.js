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
          { key: 'C(true)', text: 'Close(true)' },
          { key: 'C(fasle)', text: 'Close(false)' },
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

      if (task.key == 'C(true)') { closure(App.VC.Close(true)) }
      if (task.key == 'C(fasle)') { closure(App.VC.Close(false)) }
    },
  },
  template: `
    Tool => :groups=groups   @click=click
      `
})
