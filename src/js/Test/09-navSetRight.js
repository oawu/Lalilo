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
          { key: 'R()', text: 'Right()' },
        ]
      },
      {
        header: '純文字',
        items: [
          { key: 'R("")', text: 'Right("")' },
          { key: 'R("str")', text: 'Right("str")' },
        ]
      },
      {
        header: '純反應 Emit',
        items: [
          { key: 'R(A.E(str))', text: 'Right(Act.Emit(str))' },
          { key: 'R(A.E(str,any))', text: 'Right(Act.Emit(str,any))' },
          { key: 'R(A(str))', text: 'Right(Act(str))' },
          { key: 'R(A(str,any))', text: 'Right(Act(str,any))' },
        ]
      },
      {
        header: '純反應 Func',
        items: [
          { key: 'R(A.F(=>))', text: 'Right(Act.Func(=>))' },
          { key: 'R(A.F(=>,true))', text: 'Right(Act.Func(=>,true))' },
          { key: 'R(A(=>))', text: 'Right(Act(=>))' },
          { key: 'R(A(=>,true))', text: 'Right(Act(=>,true))' },
          { key: 'R(=>)', text: 'Right(=>)' },
          { key: 'R(=>,true)', text: 'Right(=>,true)' },
        ]
      },
      {
        header: '空字串＋純反應 Emit',
        items: [
          { key: 'R("",A.E(str))', text: 'Right(empty str,Act.Emit(str))' },
          { key: 'R("",A.E(str,any))', text: 'Right(empty str,Act.Emit(str,any))' },
          { key: 'R("",A(str))', text: 'Right(empty str,Act(str))' },
          { key: 'R("",A(str,any))', text: 'Right(empty str,Act(str,any))' },
        ]
      },
      {
        header: '空字串＋純反應 Func',
        items: [
          { key: 'R("",A.F(=>))', text: 'Right(empty str, Act.Func(=>))' },
          { key: 'R("",A.F(=>,true))', text: 'Right(empty str, Act.Func(=>,true))' },
          { key: 'R("",A(=>))', text: 'Right(empty str, Act(=>))' },
          { key: 'R("",A(=>,true))', text: 'Right(empty str, Act(=>,true))' },
          { key: 'R("",=>)', text: 'Right(empty str, =>)' },
          { key: 'R("",=>,true)', text: 'Right(empty str, =>,true)' },
        ]
      },
      {
        header: '字串＋純反應 Emit',
        items: [
          { key: 'R(str,A.E(str))', text: 'Right(str, Act.Emit(str))' },
          { key: 'R(str,A.E(str,any))', text: 'Right(str, Act.Emit(str,any))' },
          { key: 'R(str,A(str))', text: 'Right(str, Act(str))' },
          { key: 'R(str,A(str,any))', text: 'Right(str, Act(str,any))' },

        ]
      },
      {
        header: '字串＋純反應 Func',
        items: [
          { key: 'R(str,A.F(=>))', text: 'Right(str, Act.Func(=>))' },
          { key: 'R(str,A.F(=>,true))', text: 'Right(str, Act.Func(=>,true))' },
          { key: 'R(str,A(=>))', text: 'Right(str, Act(=>))' },
          { key: 'R(str,A(=>,true))', text: 'Right(str, Act(=>,true))' },
          { key: 'R(str,=>)', text: 'Right(str, =>)' },
          { key: 'R(str,=>,true)', text: 'Right(str, =>,true)' },
        ]
      },
      {
        header: '反應 Event',
        items: [
          { key: 'R(str,Alert)', text: 'Right(str,Alert)' },
          { key: 'R(str,Pop)', text: 'Right(str,Pop)' },
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

      if (task.key == 'R()')                 { closure(App.VC.Nav.SetRight()) }
      if (task.key == 'R("")')               { closure(App.VC.Nav.SetRight('')) }
      if (task.key == 'R("str")')            { closure(App.VC.Nav.SetRight('Left')) }

      if (task.key == 'R(A.E(str))')         { closure(App.VC.Nav.SetRight(App.Action.Emit('On_Emit'))) }
      if (task.key == 'R(A.E(str,any))')     { closure(App.VC.Nav.SetRight(App.Action.Emit('On_Emit', 'Emit'))) }
      if (task.key == 'R(A(str))')           { closure(App.VC.Nav.SetRight(App.Action('On_Emit'))) }
      if (task.key == 'R(A(str,any))')       { closure(App.VC.Nav.SetRight(App.Action('On_Emit', 'Emit'))) }
      if (task.key == 'R(A.F(=>))')          { closure(App.VC.Nav.SetRight(App.Action.Func(func1))) }
      if (task.key == 'R(A.F(=>,true))')     { closure(App.VC.Nav.SetRight(App.Action.Func(func1, true))) }
      if (task.key == 'R(A(=>))')            { closure(App.VC.Nav.SetRight(App.Action(func1))) }
      if (task.key == 'R(A(=>,true))')       { closure(App.VC.Nav.SetRight(App.Action(func1, true))) }
      if (task.key == 'R(=>)')               { closure(App.VC.Nav.SetRight(func1)) }
      if (task.key == 'R(=>,true)')          { closure(App.VC.Nav.SetRight(func1, true)) }
      
      if (task.key == 'R("",A.E(str))')      { closure(App.VC.Nav.SetRight('', App.Action.Emit('On_Emit'))) }
      if (task.key == 'R("",A.E(str,any))')  { closure(App.VC.Nav.SetRight('', App.Action.Emit('On_Emit', 'Emit'))) }
      if (task.key == 'R("",A(str))')        { closure(App.VC.Nav.SetRight('', App.Action('On_Emit'))) }
      if (task.key == 'R("",A(str,any))')    { closure(App.VC.Nav.SetRight('', App.Action('On_Emit', 'Emit'))) }
      if (task.key == 'R("",A.F(=>))')       { closure(App.VC.Nav.SetRight('', App.Action.Func(func1))) }
      if (task.key == 'R("",A.F(=>,true))')  { closure(App.VC.Nav.SetRight('', App.Action.Func(func1, true))) }
      if (task.key == 'R("",A(=>))')         { closure(App.VC.Nav.SetRight('', App.Action(func1))) }
      if (task.key == 'R("",A(=>,true))')    { closure(App.VC.Nav.SetRight('', App.Action(func1, true))) }
      if (task.key == 'R("",=>)')            { closure(App.VC.Nav.SetRight('', func1)) }
      if (task.key == 'R("",=>,true)')       { closure(App.VC.Nav.SetRight('', func1, true)) }
      
      if (task.key == 'R(str,A.E(str))')     { closure(App.VC.Nav.SetRight('str', App.Action.Emit('On_Emit'))) }
      if (task.key == 'R(str,A.E(str,any))') { closure(App.VC.Nav.SetRight('str', App.Action.Emit('On_Emit', 'Emit'))) }
      if (task.key == 'R(str,A(str))')       { closure(App.VC.Nav.SetRight('str', App.Action('On_Emit'))) }
      if (task.key == 'R(str,A(str,any))')   { closure(App.VC.Nav.SetRight('str', App.Action('On_Emit', 'Emit'))) }
      if (task.key == 'R(str,A.F(=>))')      { closure(App.VC.Nav.SetRight('str', App.Action.Func(func1))) }
      if (task.key == 'R(str,A.F(=>,true))') { closure(App.VC.Nav.SetRight('str', App.Action.Func(func1, true))) }
      if (task.key == 'R(str,A(=>))')        { closure(App.VC.Nav.SetRight('str', App.Action(func1))) }
      if (task.key == 'R(str,A(=>,true))')   { closure(App.VC.Nav.SetRight('str', App.Action(func1, true))) }
      if (task.key == 'R(str,=>)')           { closure(App.VC.Nav.SetRight('str', func1)) }
      if (task.key == 'R(str,=>,true)')      { closure(App.VC.Nav.SetRight('str', func1, true)) }
      
      if (task.key == 'R(str,Alert)')        { closure(App.VC.Nav.SetRight('str', App.Alert('title', 'message', ['Hi']), true)) }
      if (task.key == 'R(str,Pop)')        { closure(App.VC.Nav.SetRight('str', App.VC.Nav.Pop(), true)) }
    },
  },
  template: `
    Tool => :groups=groups   @click=click
      `
})
