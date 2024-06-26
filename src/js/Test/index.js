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
        header: '其他',
        footer: '',
        items: [
          { title: '控制前頁', subtitle: 'Emit 上一個頁面 func', href: `${window.baseUrl}Test/12-emitPrev-1.html` },
          { title: 'HUD', subtitle: '抬頭顯示器', href: `${window.baseUrl}Test/13-hud.html` },
          { title: 'Youtube Player', subtitle: 'Youtube 播放器', href: `${window.baseUrl}Test/14-youtubePlayer.html` },
          { title: 'GPS', subtitle: '定位功能', href: `${window.baseUrl}Test/15-gps-1.html` },
          { title: 'Feedback', subtitle: '觸感回應', href: `${window.baseUrl}Test/16-feedback.html` },
        ] 
      },
      {
        header: '基本測試',
        footer: '',
        items: [
          { title: 'Action',  subtitle: '回應測試', href: `${window.baseUrl}Test/01-action.html` },
          { title: 'Alert',   subtitle: '彈窗測試', href: `${window.baseUrl}Test/02-alert.html` },

        ] 
      },
      {
        header: 'Nav 系列',
        footer: '',
        items: [
          { title: 'Push',                 subtitle: 'NavigationController Push', href: `${window.baseUrl}Test/Nav/01-push.html` },
          { title: 'Pop',                  subtitle: 'NavigationController Pop', href: `${window.baseUrl}Test/Nav/02-pop.html` },
          { title: 'Bar.Hidden',           subtitle: '更新 Navigation Bar 是否隱藏', href: `${window.baseUrl}Test/Nav/03-bar.Hidden.html` },
          { title: 'Bar.Appearance',       subtitle: '更新 Navigation Bar 樣式', href: `${window.baseUrl}Test/Nav/04-bar.Appearance.html` },
          { title: 'Bar.Title',            subtitle: '更新 Navigation title', href: `${window.baseUrl}Test/Nav/05-bar.Title.html` },
          { title: 'Bar.Button.Left',      subtitle: '更新 Navigation 左上按鈕', href: `${window.baseUrl}Test/Nav/06-bar.Button.Left.html` },
          { title: 'Bar.Button.Right',     subtitle: '更新 Navigation 右上按鈕', href: `${window.baseUrl}Test/Nav/07-bar.Button.Right.html` },
        ] 
      },
      {
        header: 'Tab 系列',
        footer: '',
        items: [
          { title: 'Bar.Appearance',       subtitle: '更新 Tab Bar 樣式', href: `${window.baseUrl}Test/Tab/01-bar.Appearance.html` },
          { title: 'Bar.Title',            subtitle: '更新 Tab title', href: `${window.baseUrl}Test/Tab/02-bar.Title.html` },
        ] 
      },
      {
        header: 'VC 系列',
        footer: '',
        items: [
          { title: 'Present', subtitle: 'ViewController Present', href: `${window.baseUrl}Test/VC/01-present.html` },
          { title: 'Dismiss', subtitle: 'ViewController Dismiss', href: `${window.baseUrl}Test/VC/02-dismiss.html` },
          { title: 'Close', subtitle: 'ViewController Close', href: `${window.baseUrl}Test/VC/03-close.html` },
        ] 
      },
    ]
  },
  mounted () {
  //   App.Bridge.on('vc:loadView', _ => console.error('vc:loadView'); )
  //   App.Bridge.on('vc:viewDidLoad', _ => console.error('vc:viewDidLoad'); )
  //   App.Bridge.on('vc:viewWillAppear', _ => console.error('vc:viewWillAppear'); )
  //   App.Bridge.on('vc:viewDidAppear', _ => console.error('vc:viewDidAppear'); )
  //   App.Bridge.on('vc:viewWillDisappear', _ => console.error('vc:viewWillDisappear'); )
  //   App.Bridge.on('vc:viewDidDisappear', _ => console.error('vc:viewDidDisappear'); )
  //   App.Bridge.on('vc:viewWillLayoutSubviews', _ => console.error('vc:viewWillLayoutSubviews'); )
  //   App.Bridge.on('vc:viewDidLayoutSubviews', _ => console.error('vc:viewDidLayoutSubviews'); )
  //   App.Bridge.on('vc:webViewDidFinish', _ => console.error('vc:webViewDidFinish'); )

    setTimeout(_ => this.$el.dispatchEvent(new CustomEvent('scroll')), 1)

    App.Bridge.emits([
      App.VC.Nav.Bar.Title("首頁  1"),
      App.VC.Tab.Bar.Title("首頁  2"),
      App.VC.Nav.Bar.Button.Right("關閉", App.VC.Close()),
    ], App.VC.Mounted())
  },
  computed: {
  },
  methods: {
    click (item) {
      if (window.Bridge.type === 'Web') {
        return window.location.assign(item.href)
      }
      
      const web = App.VC.View.Web(item.href).navBarTitle(item.title)

      if (item.title == 'NavPop') {
        web.navBarHidden(true)
      } else if (item.title == 'Bar.Hidden') {
        web.navBarHidden(true)
      } else {
      }

      App.VC.Nav.Push(web).emit()
    },
    scroll (e) {
      App.OnScroll(e.target.scrollTop, e.target.clientHeight, e.target.scrollHeight).emit()
    }
  },
  template: `
    main#app => @scroll=scroll
      .groups
        .group => *for=(group, i) in groups   :key='groups_' + i
          .header => *if=typeof group.header == 'string' && group.header !== ''   *text=group.header
          .items
            label.item => *for=(item, j) in group.items   :key='items_' + j   @click=click(item)
              .img => *if=typeof item.image == 'string' && item.image !== ''
                figure

              .content
                .info
                  .key => *if=(typeof item.title == 'string' && item.title !== '') || (typeof item.subtitle == 'string' && item.subtitle !== '')
                    b => *if=typeof item.title == 'string' && item.title !== ''   *text=item.title
                    span => *if=typeof item.subtitle == 'string' && item.subtitle !== ''   *text=item.subtitle
                  .val => *if=typeof item.value == 'string' && item.value !== ''
                    b => *text=item.value
                .icon
                  .arrowUI

      `
})
