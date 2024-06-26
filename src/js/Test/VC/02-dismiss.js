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
          { key: 'D(true)',  text: 'Dismiss(true)' },
          { key: 'D(fasle)', text: 'Dismiss(false)' },
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

      if (task.key == 'D(true)')  { closure(App.VC.Dismiss(true)) }
      if (task.key == 'D(fasle)') { closure(App.VC.Dismiss(false)) }
    },
  },
  template: `
    Tool => :groups=groups   @click=click
      `
})
