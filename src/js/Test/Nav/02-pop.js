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
          { key: 'P(true)',  text: 'Pop(true)' },
          { key: 'P(fasle)', text: 'Pop(false)' },
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

      if (task.key == 'P(true)')  { closure(App.VC.Nav.Pop(true)) }
      if (task.key == 'P(fasle)') { closure(App.VC.Nav.Pop(false)) }
    },
  },
  template: `
    Tool => :groups=groups   @click=click
      `
})
