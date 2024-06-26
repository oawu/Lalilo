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
          { key: 'P(W(str))', text: 'Push(Web(url))' },
          { key: 'P(str)', text: 'Push(url)' },
          { key: 'P(W(str), false)', text: 'Push(Web(url), false)' },
          { key: 'P(str, false)', text: 'Push(url, false)' },
        ]
      },
      {
        header: 'Bar 隱藏/顯示',
        items: [
          { key: 'W(str).barH(true)', text: 'Web(url).BarHidden(true)' },
          { key: 'W(str).barH(false)', text: 'Web(url).BarHidden(false)' },
        ]
      },
      {
        header: '標題',
        items: [
          { key: 'W(str).title(empty str)', text: 'Web(url).title(empty str)' },
          { key: 'W(str).title(str)', text: 'Web(url).title(str)' },
        ]
      },
      {
        header: 'Bar Appearance',
        items: [
          { key: 'Web(url).BarAppearance(auto)', text: 'Web(url).BarAppearance(auto)' },
          { key: 'Web(url).BarAppearance(show)', text: 'Web(url).BarAppearance(show)' },
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

      const url = `${window.baseUrl}Test/index.html`
      const web = App.VC.View.Web(url)

      if (task.key == 'P(W(str))')                       { closure(App.VC.Nav.Push(web)) }
      if (task.key == 'P(str)')                          { closure(App.VC.Nav.Push(url)) }
      if (task.key == 'P(W(str), false)')                { closure(App.VC.Nav.Push(web, false)) }
      if (task.key == 'P(str, false)')                   { closure(App.VC.Nav.Push(url, false)) }
      
      if (task.key == 'W(str).barH(true)')               { closure(App.VC.Nav.Push(web.navBarHidden(true))) }
      if (task.key == 'W(str).barH(false)')              { closure(App.VC.Nav.Push(web.navBarHidden(false))) }
      
      if (task.key == 'W(str).title(empty str)')         { closure(App.VC.Nav.Push(web.navBarTitle(''))) }
      if (task.key == 'W(str).title(str)')               { closure(App.VC.Nav.Push(web.navBarTitle('str'))) }

      if (task.key == 'Web(url).BarAppearance(auto)')    { closure(App.VC.Nav.Push(web.navBarAppearance('auto'))) }
      if (task.key == 'Web(url).BarAppearance(show)')    { closure(App.VC.Nav.Push(web.navBarAppearance('show'))) }
    },
  },
  template: `
    Tool => :groups=groups   @click=click
      `
})
