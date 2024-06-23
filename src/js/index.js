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
          { title: '控制前頁', subtitle: 'Emit 上一個頁面 func', href: `${window.baseUrl}12-emitPrev-1.html` },
          { title: 'HUD', subtitle: '抬頭顯示器', href: `${window.baseUrl}13-hud.html` },
          { title: 'Youtube Player', subtitle: 'Youtube 播放器', href: `${window.baseUrl}14-youtubePlayer.html` },
          { title: 'GPS', subtitle: '定位功能', href: `${window.baseUrl}15-gps-1.html` },
          { title: 'Feedback', subtitle: '觸感回應', href: `${window.baseUrl}16-feedback.html` },
        ] 
      },
      {
        header: '基本測試',
        footer: '',
        items: [
          { title: 'Action',  subtitle: '回應測試', href: `${window.baseUrl}01-action.html` },
          { title: 'Alert',   subtitle: '彈窗測試', href: `${window.baseUrl}02-alert.html` },
          { title: 'Close', subtitle: 'ViewController Close', href: `${window.baseUrl}03-vcClose.html` },

        ] 
      },
      {
        header: 'Nav 系列',
        footer: '',
        items: [
          { title: 'Push',         subtitle: 'NavigationController Push', href: `${window.baseUrl}04-navPush.html` },
          { title: 'Pop',          subtitle: 'NavigationController Pop', href: `${window.baseUrl}05-navPop.html` },
          { title: 'SetBarHidden', subtitle: '更新 Navigation Bar 是否隱藏', href: `${window.baseUrl}06-navSetBarHidden.html` },
          { title: 'SetTitle',     subtitle: '更新 Navigation title', href: `${window.baseUrl}07-navSetTitle.html` },
          { title: 'SetLeft',      subtitle: '更新 Navigation 左上按鈕', href: `${window.baseUrl}08-navSetLeft.html` },
          { title: 'SetRight',     subtitle: '更新 Navigation 右上按鈕', href: `${window.baseUrl}09-navSetRight.html` },
        ] 
      },
      {
        header: 'VC 系列',
        footer: '',
        items: [
          { title: 'Present', subtitle: 'ViewController Present', href: `${window.baseUrl}10-vcPresent.html` },
          { title: 'Dismiss', subtitle: 'ViewController Dismiss', href: `${window.baseUrl}11-vcDismiss.html` }
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

    App.Bridge.emits([
      App.VC.Nav.SetTitle("首頁"),
      App.VC.Nav.SetRight("關閉", App.VC.Close()),
    ], App.VC.Mounted())
  },
  computed: {
  },
  methods: {
    click (item) {
      if (window.Bridge.type === 'Web') {
        window.location.assign(item.href)
        return
      }
      
      const web = App.VC.View.Web(item.href).navTitle(item.title)

      if (item.title == 'NavPop') {
        web.navBarHidden(true)
      } else if (item.title == 'NavSetBarHidden') {
        web.navBarHidden(true)
      } else {
      }

      App.VC.Nav.Push(web).emit()
    },
  },
  template: `
    main#app
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
