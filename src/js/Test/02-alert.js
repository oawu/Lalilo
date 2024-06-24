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
        header: '文案組合',
        items: [
          { key: 'tmb',                         text: 'Title + Message + Button' },
          { key: 'tb',                          text: 'Title + Button' },
          { key: 'mb',                          text: 'Message + Button' },
          { key: 'b',                           text: 'Button' },
          { key: 'ani=false',                   text: 'isAnimated=false' },
        ]
      },
      {
        header: '輸入',
        items: [
          { key: 'input1',                           text: 'Input 1' },
          { key: 'input2',                           text: 'Input 2' },
        ]
      },
      {
        header: 'Style - .btn(Button)',
        items: [
          { key: '.b(B(1 bold))',               text: '粗體 一個' },
          { key: '.b(B(n bold))',               text: '粗體 多個' },
          { key: '.b(B(red + bold))',           text: '紅色＋粗體' },
        ]
      },
      {
        header: 'Style - .btn(...)',
        items: [
          { key: '.b(1 bold)',                  text: '粗體 一個' },
          { key: '.b(n bold)',                  text: '粗體 多個' },
          { key: '.b(red + bold)',              text: '紅色＋粗體' },
        ]
      },
      {
        header: 'Action Emit - .btn(Button)',
        items: [
          { key: '.b(B(str,B.A.E(str)))',       text: '.btn(Btn(str,Act.Emit(str)))' },
          { key: '.b(B(str,B.A.E(str,any)))',   text: '.btn(Btn(str,Act.Emit(str,any)))' },
          { key: '.b(B(str,B.A(str)))',         text: '.btn(Btn(str,Act(str)))' },
          { key: '.b(B(str,B.A(str,any)))',     text: '.btn(Btn(str,Act(str, any)))' },
          { key: '.b(B(str,B(str)))',           text: '.btn(Btn(str,str))' },
        ]
      },
      {
        header: 'Action Emit - .btn(...)',
        items: [
          { key: '.b(str,A.E(str))',            text: '.btn(str,Act.Emit(str))' },
          { key: '.b(str,A.E(str,any))',        text: '.btn(str,Act.Emit(str,any))' },
          { key: '.b(str,A(str))',              text: '.btn(str,Act(str))' },
          { key: '.b(str,A(str,any))',          text: '.btn(str,Act(str,any))' },
          { key: '.b(str,str)',                 text: '.btn(str,str)' },
        ]
      },
      {
        header: 'Action Func - .btn(Button)',
        items: [
          { key: '.b(B(str,B.A.F(=>)))',        text: '.btn(Btn(str,Act.Func(=>)))' },
          { key: '.b(B(str,B.A.F(=>,true)))',   text: '.btn(Btn(str,Act.Func(=>,true)))' },
          { key: '.b(B(str,B.A(=>)))',          text: '.btn(Btn(str,Act(=>)))' },
          { key: '.b(B(str,B.A(=>,true)))',     text: '.btn(Btn(str,Act(=>,true)))' },
          { key: '.b(B(str,B(=>)))',            text: '.btn(Btn(str,=>))' },
        ]
      },
      {
        header: 'Action Func - .btn(...)',
        items: [
          { key: '.b(str,A.F(=>))',             text: '.btn(str,Act.Func(=>))' },
          { key: '.b(str,A.F(=>,true))',        text: '.btn(str,Act.Func(=>,true))' },
          { key: '.b(str,A(=>))',               text: '.btn(str,Act(=>))' },
          { key: '.b(str,A(=>,true))',          text: '.btn(str,Act(=>,true))' },
          { key: '.b(str,=>)',                  text: '.btn(str,=>)' },
        ]
      },
      {
        header: 'Action App',
        items: [
          { key: '.b(B(str, Alert))',           text: '.btn(B(str,App))' },
          { key: '.b(str, Alert)',              text: '.btn(str,App)' },
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

      if (task.key == 'tmb')                       { closure(App.Alert('標題', '內文').button('按鈕 .button(Str)')) }
      if (task.key == 'tb')                        { closure(App.Alert('標題').button(App.Alert.Button('按鈕 .button(Button)'))) }
      if (task.key == 'mb')                        { closure(App.Alert(null, '內文').buttons(['按鈕 .buttons([Str])'])) }
      if (task.key == 'b')                         { closure(App.Alert().buttons([App.Alert.Button('按鈕 .buttons([Button])')])) }
      if (task.key == 'ani=false')                 { closure(App.Alert().buttons([App.Alert.Button('按鈕 .buttons([Button])')]).isAnimated(false)) }

      // ====================================

      if (task.key == 'input1')                    { closure(App.Alert('標題', '內文').input('value', 'placeholder').button('按鈕', App.Action.Emit('On_Emit'))) }
      if (task.key == 'input2')                    { closure(App.Alert('標題', '內文').input().input('value', 'placeholder').button('按鈕', App.Action.Emit('On_Emit'))) }

      // ====================================
      
      if (task.key == '.b(B(1 bold))')             { closure(App.Alert().button(App.Alert.Button('按鈕 1').isPreferred(true)).button('按鈕 2')) }
      if (task.key == '.b(B(n bold))')             { closure(App.Alert().button(App.Alert.Button('按鈕 1').isPreferred(true)).button(App.Alert.Button('按鈕 2').isPreferred(true)).button(App.Alert.Button('按鈕 3').isPreferred(true))) }
      if (task.key == '.b(B(red + bold))')         { closure(App.Alert().button(App.Alert.Button('按鈕 1').isDestructive(true)).button(App.Alert.Button('按鈕 2').isPreferred(true).isDestructive(true)).button(App.Alert.Button('按鈕 3').isDestructive(true))) }

      // ====================================
      
      if (task.key == '.b(1 bold)')                { closure(App.Alert().button('按鈕 1', null, true).button('按鈕 2')) }
      if (task.key == '.b(n bold)')                { closure(App.Alert().button('按鈕 1', null, true).button('按鈕 2', null, true).button('按鈕 3', null, true)) }
      if (task.key == '.b(red + bold)')            { closure(App.Alert().button('按鈕 1', null, false, true).button('按鈕 2', null, true, true).button('按鈕 3', null, false, true)) }
      
      // ====================================
      
      if (task.key == '.b(B(str,B.A.E(str)))')     { closure(App.Alert().button(App.Alert.Button(`按鈕`, App.Action.Emit('On_Emit')))) }
      if (task.key == '.b(B(str,B.A.E(str,any)))') { closure(App.Alert().button(App.Alert.Button(`按鈕`, App.Action.Emit('On_Emit', 'Emit')))) }
      if (task.key == '.b(B(str,B.A(str)))')       { closure(App.Alert().button(App.Alert.Button(`按鈕`, App.Action('On_Emit')))) }
      if (task.key == '.b(B(str,B.A(str,any)))')   { closure(App.Alert().button(App.Alert.Button(`按鈕`, App.Action('On_Emit', 'Emit')))) }
      if (task.key == '.b(B(str,B(str)))')         { closure(App.Alert().button(App.Alert.Button(`按鈕`, 'On_Emit'))) }

      // ====================================

      if (task.key == '.b(str,A.E(str))')          { closure(App.Alert().button(`按鈕`, App.Action.Emit('On_Emit'))) }
      if (task.key == '.b(str,A.E(str,any))')      { closure(App.Alert().button(`按鈕`, App.Action.Emit('On_Emit', 'Emit'))) }
      if (task.key == '.b(str,A(str))')            { closure(App.Alert().button(`按鈕`, App.Action('On_Emit'))) }
      if (task.key == '.b(str,A(str,any))')        { closure(App.Alert().button(`按鈕`, App.Action('On_Emit', 'Emit'))) }
      if (task.key == '.b(str,str)')               { closure(App.Alert().button(`按鈕`, 'On_Emit')) }
      
      // ====================================

      if (task.key == '.b(B(str,B.A.F(=>)))')      { closure(App.Alert().button(App.Alert.Button(`按鈕`, App.Action.Func(func1)))) }
      if (task.key == '.b(B(str,B.A.F(=>,true)))') { closure(App.Alert().button(App.Alert.Button(`按鈕`, App.Action.Func(func1, true)))) }
      if (task.key == '.b(B(str,B.A(=>)))')        { closure(App.Alert().button(App.Alert.Button(`按鈕`, App.Action(func1)))) }
      if (task.key == '.b(B(str,B.A(=>,true)))')   { closure(App.Alert().button(App.Alert.Button(`按鈕`, App.Action(func1, true)))) }
      if (task.key == '.b(B(str,B(=>)))')          { closure(App.Alert().button(App.Alert.Button(`按鈕`, func1))) }

      // ====================================
      
      if (task.key == '.b(str,A.F(=>))')           { closure(App.Alert().button(`按鈕`, App.Action.Func(func1))) }
      if (task.key == '.b(str,A.F(=>,true))')      { closure(App.Alert().button(`按鈕`, App.Action.Func(func1, true))) }
      if (task.key == '.b(str,A(=>))')             { closure(App.Alert().button(`按鈕`, App.Action(func1))) }
      if (task.key == '.b(str,A(=>,true))')        { closure(App.Alert().button(`按鈕`, App.Action(func1, true))) }
      if (task.key == '.b(str,=>)')                { closure(App.Alert().button(`按鈕`, func1)) }

      // ====================================

      if (task.key == '.b(B(str, Alert))')         { closure(App.Alert().button(App.Alert.Button(`按鈕`, App.Alert('Alert').button('Button')))) }
      if (task.key == '.b(str, Alert)')            { closure(App.Alert().button(`按鈕`, App.Alert('Alert').button('Button'))) }
    },
  },
  template: `
    Tool => :groups=groups   @click=click
      `
})
