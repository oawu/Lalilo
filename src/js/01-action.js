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
        header: 'Emit',
        items: [
          { key: 'A.E(str)',     text: 'Act.Emit(str)' },
          { key: 'A.E(str,any)', text: 'Act.Emit(str,any)' },
          { key: 'A(str)',       text: 'Act(str)' },
          { key: 'A(str,any)',   text: 'Act(str,any)' },
        ],
      },
      {
        header: 'Func',
        items: [
          { key: 'A.F(=>)',      text: 'Act.Func(=>)' },
          { key: 'A.F(=>,true)', text: 'Act.Func(=>,true)' },
          { key: 'A(=>)',        text: 'Act(=>)' },
          { key: 'A(=>,true)',   text: 'Act(=>,true)' },
        ]
      },
    ],
  },
  mounted () {

    // App.Bridge.on('vc:loadView', _ => {
    //   console.error('vc:loadView');
    // })
    // App.Bridge.on('vc:viewDidLoad', _ => {
    //   console.error('vc:viewDidLoad');
    // })
    // App.Bridge.on('vc:viewWillAppear', _ => {
    //   console.error('vc:viewWillAppear');
    // })
    // App.Bridge.on('vc:viewDidAppear', _ => {
    //   console.error('vc:viewDidAppear');
    // })
    // App.Bridge.on('vc:viewWillDisappear', _ => {
    //   console.error('vc:viewWillDisappear');
    // })
    // App.Bridge.on('vc:viewDidDisappear', _ => {
    //   console.error('vc:viewDidDisappear');
    // })
    // App.Bridge.on('vc:viewWillLayoutSubviews', _ => {
    //   console.error('vc:viewWillLayoutSubviews');
    // })
    // App.Bridge.on('vc:viewDidLayoutSubviews', _ => {
    //   console.error('vc:viewDidLayoutSubviews');
    // })
    // App.Bridge.on('vc:webViewDidFinish', _ => {
    //   console.error('vc:webViewDidFinish');
    // })
    
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

      if (task.key == 'A.E(str)')           { closure(App.Action.Emit('On_Emit')) }
      if (task.key == 'A.E(str,any)')       { closure(App.Action.Emit('On_Emit', 'Emit')) }
      if (task.key == 'A(str)')             { closure(App.Action('On_Emit')) }
      if (task.key == 'A(str,any)')         { closure(App.Action('On_Emit', 'Emit')) }

      // ====================================

      if (task.key == 'A.F(=>)')            { closure(App.Action.Func(func1)) }
      if (task.key == 'A.F(=>,true)')       { closure(App.Action.Func(func1, true)) }
      if (task.key == 'A(=>)')              { closure(App.Action(func1)) }
      if (task.key == 'A(=>,true)')         { closure(App.Action(func1, true)) }
    },
  },
  template: `
    Tool => :groups=groups   @click=click
      `
})
