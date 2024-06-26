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
        header: '無',
        items: [
          { key: 'L()', text: 'Left()' },
        ]
      },
      {
        header: '純文字',
        items: [
          { key: 'L("")', text: 'Left("")' },
          { key: 'L("str")', text: 'Left("str")' },
        ]
      },
      {
        header: '純反應 Emit',
        items: [
          { key: 'L(A.E(str))', text: 'Left(Act.Emit(str))' },
          { key: 'L(A.E(str,any))', text: 'Left(Act.Emit(str,any))' },
          { key: 'L(A(str))', text: 'Left(Act(str))' },
          { key: 'L(A(str,any))', text: 'Left(Act(str,any))' },
        ]
      },
      {
        header: '純反應 Func',
        items: [
          { key: 'L(A.F(=>))', text: 'Left(Act.Func(=>))' },
          { key: 'L(A.F(=>,true))', text: 'Left(Act.Func(=>,true))' },
          { key: 'L(A(=>))', text: 'Left(Act(=>))' },
          { key: 'L(A(=>,true))', text: 'Left(Act(=>,true))' },
          { key: 'L(=>)', text: 'Left(=>)' },
          { key: 'L(=>,true)', text: 'Left(=>,true)' },
        ]
      },
      {
        header: '空字串＋純反應 Emit',
        items: [
          { key: 'L("",A.E(str))', text: 'Left(empty str,Act.Emit(str))' },
          { key: 'L("",A.E(str,any))', text: 'Left(empty str,Act.Emit(str,any))' },
          { key: 'L("",A(str))', text: 'Left(empty str,Act(str))' },
          { key: 'L("",A(str,any))', text: 'Left(empty str,Act(str,any))' },
        ]
      },
      {
        header: '空字串＋純反應 Func',
        items: [
          { key: 'L("",A.F(=>))', text: 'Left(empty str, Act.Func(=>))' },
          { key: 'L("",A.F(=>,true))', text: 'Left(empty str, Act.Func(=>,true))' },
          { key: 'L("",A(=>))', text: 'Left(empty str, Act(=>))' },
          { key: 'L("",A(=>,true))', text: 'Left(empty str, Act(=>,true))' },
          { key: 'L("",=>)', text: 'Left(empty str, =>)' },
          { key: 'L("",=>,true)', text: 'Left(empty str, =>,true)' },
        ]
      },
      {
        header: '字串＋純反應 Emit',
        items: [
          { key: 'L(str,A.E(str))', text: 'Left(str, Act.Emit(str))' },
          { key: 'L(str,A.E(str,any))', text: 'Left(str, Act.Emit(str,any))' },
          { key: 'L(str,A(str))', text: 'Left(str, Act(str))' },
          { key: 'L(str,A(str,any))', text: 'Left(str, Act(str,any))' },

        ]
      },
      {
        header: '字串＋純反應 Func',
        items: [
          { key: 'L(str,A.F(=>))', text: 'Left(str, Act.Func(=>))' },
          { key: 'L(str,A.F(=>,true))', text: 'Left(str, Act.Func(=>,true))' },
          { key: 'L(str,A(=>))', text: 'Left(str, Act(=>))' },
          { key: 'L(str,A(=>,true))', text: 'Left(str, Act(=>,true))' },
          { key: 'L(str,=>)', text: 'Left(str, =>)' },
          { key: 'L(str,=>,true)', text: 'Left(str, =>,true)' },
        ]
      },
      {
        header: '反應 Event',
        items: [
          { key: 'L(str,Alert)', text: 'Left(str,Alert)' },
          { key: 'L(str,Pop)', text: 'Left(str,Pop)' },
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

      if (task.key == 'L()')                 { closure(App.VC.Nav.Bar.Button.Left()) }
      if (task.key == 'L("")')               { closure(App.VC.Nav.Bar.Button.Left('')) }
      if (task.key == 'L("str")')            { closure(App.VC.Nav.Bar.Button.Left('Left')) }

      if (task.key == 'L(A.E(str))')         { closure(App.VC.Nav.Bar.Button.Left(App.Action.Emit('On_Emit'))) }
      if (task.key == 'L(A.E(str,any))')     { closure(App.VC.Nav.Bar.Button.Left(App.Action.Emit('On_Emit', 'Emit'))) }
      if (task.key == 'L(A(str))')           { closure(App.VC.Nav.Bar.Button.Left(App.Action('On_Emit'))) }
      if (task.key == 'L(A(str,any))')       { closure(App.VC.Nav.Bar.Button.Left(App.Action('On_Emit', 'Emit'))) }
      if (task.key == 'L(A.F(=>))')          { closure(App.VC.Nav.Bar.Button.Left(App.Action.Func(func1))) }
      if (task.key == 'L(A.F(=>,true))')     { closure(App.VC.Nav.Bar.Button.Left(App.Action.Func(func1, true))) }
      if (task.key == 'L(A(=>))')            { closure(App.VC.Nav.Bar.Button.Left(App.Action(func1))) }
      if (task.key == 'L(A(=>,true))')       { closure(App.VC.Nav.Bar.Button.Left(App.Action(func1, true))) }
      if (task.key == 'L(=>)')               { closure(App.VC.Nav.Bar.Button.Left(func1)) }
      if (task.key == 'L(=>,true)')          { closure(App.VC.Nav.Bar.Button.Left(func1, true)) }
      
      if (task.key == 'L("",A.E(str))')      { closure(App.VC.Nav.Bar.Button.Left('', App.Action.Emit('On_Emit'))) }
      if (task.key == 'L("",A.E(str,any))')  { closure(App.VC.Nav.Bar.Button.Left('', App.Action.Emit('On_Emit', 'Emit'))) }
      if (task.key == 'L("",A(str))')        { closure(App.VC.Nav.Bar.Button.Left('', App.Action('On_Emit'))) }
      if (task.key == 'L("",A(str,any))')    { closure(App.VC.Nav.Bar.Button.Left('', App.Action('On_Emit', 'Emit'))) }
      if (task.key == 'L("",A.F(=>))')       { closure(App.VC.Nav.Bar.Button.Left('', App.Action.Func(func1))) }
      if (task.key == 'L("",A.F(=>,true))')  { closure(App.VC.Nav.Bar.Button.Left('', App.Action.Func(func1, true))) }
      if (task.key == 'L("",A(=>))')         { closure(App.VC.Nav.Bar.Button.Left('', App.Action(func1))) }
      if (task.key == 'L("",A(=>,true))')    { closure(App.VC.Nav.Bar.Button.Left('', App.Action(func1, true))) }
      if (task.key == 'L("",=>)')            { closure(App.VC.Nav.Bar.Button.Left('', func1)) }
      if (task.key == 'L("",=>,true)')       { closure(App.VC.Nav.Bar.Button.Left('', func1, true)) }
      
      if (task.key == 'L(str,A.E(str))')     { closure(App.VC.Nav.Bar.Button.Left('str', App.Action.Emit('On_Emit'))) }
      if (task.key == 'L(str,A.E(str,any))') { closure(App.VC.Nav.Bar.Button.Left('str', App.Action.Emit('On_Emit', 'Emit'))) }
      if (task.key == 'L(str,A(str))')       { closure(App.VC.Nav.Bar.Button.Left('str', App.Action('On_Emit'))) }
      if (task.key == 'L(str,A(str,any))')   { closure(App.VC.Nav.Bar.Button.Left('str', App.Action('On_Emit', 'Emit'))) }
      if (task.key == 'L(str,A.F(=>))')      { closure(App.VC.Nav.Bar.Button.Left('str', App.Action.Func(func1))) }
      if (task.key == 'L(str,A.F(=>,true))') { closure(App.VC.Nav.Bar.Button.Left('str', App.Action.Func(func1, true))) }
      if (task.key == 'L(str,A(=>))')        { closure(App.VC.Nav.Bar.Button.Left('str', App.Action(func1))) }
      if (task.key == 'L(str,A(=>,true))')   { closure(App.VC.Nav.Bar.Button.Left('str', App.Action(func1, true))) }
      if (task.key == 'L(str,=>)')           { closure(App.VC.Nav.Bar.Button.Left('str', func1)) }
      if (task.key == 'L(str,=>,true)')      { closure(App.VC.Nav.Bar.Button.Left('str', func1, true)) }
      
      if (task.key == 'L(str,Alert)')        { closure(App.VC.Nav.Bar.Button.Left('str', App.Alert('title', 'message', ['Hi']), true)) }
      if (task.key == 'L(str,Pop)')        { closure(App.VC.Nav.Bar.Button.Left('str', App.VC.Nav.Pop(), true)) }
    },
  },
  template: `
    Tool => :groups=groups   @click=click
      `
})
