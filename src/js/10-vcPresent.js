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
          { key: 'P(W(str))', text: 'Present(Web(url))' },
          { key: 'P(str)', text: 'Present(url)' },
          { key: 'P(W(str), false)', text: 'Present(Web(url), false)' },
          { key: 'P(str, false)', text: 'Present(url, false)' },
        ]
      },
      {
        header: 'Navigation && FullScreen',
        items: [
          { key: 'P(str).isNav(true)', text: 'Present(url).isNav(true)' },
          { key: 'P(str).isFull(true)', text: 'Present(url).isFull(true)' },
          { key: 'P(str).isNav(true).isFull(true)', text: 'Present(url).isNav(true).isFull(true)' },
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

      const url = `${window.baseUrl}index.html`
      const web = App.VC.View.Web(url)

      if (task.key == 'P(W(str))')                       { closure(App.VC.Present(web)) }
      if (task.key == 'P(str)')                          { closure(App.VC.Present(url)) }
      if (task.key == 'P(W(str), false)')                { closure(App.VC.Present(web, false)) }
      if (task.key == 'P(str, false)')                   { closure(App.VC.Present(url, false)) }
      
      if (task.key == 'P(str).isNav(true)')              { closure(App.VC.Present(web).isNavigation(true)) }
      if (task.key == 'P(str).isFull(true)')             { closure(App.VC.Present(web).isFullScreen(true)) }
      if (task.key == 'P(str).isNav(true).isFull(true)') { closure(App.VC.Present(web).isNavigation(true).isFullScreen(true)) }
    },
  },
  template: `
    Tool => :groups=groups   @click=click
      `
})
