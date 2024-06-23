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
          { key: 'Push',  text: 'Push' },
          { key: 'Present', text: 'Present' },
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

      const url = `${window.baseUrl}12-emitPrev-2.html`
      const web = App.VC.View.Web(url)

      if (task.key == 'Push')  { closure(App.VC.Nav.Push(web)) }
      if (task.key == 'Present') { closure(App.VC.Present(web).isNavigation(true).isFullScreen(false)) }
    },
  },
  template: `
    Tool => :groups=groups   @click=click
      `
})
