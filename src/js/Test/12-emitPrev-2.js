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
        header: 'Action',
        items: [
          { key: 'A.E(str).prev',     text: 'Act.Emit(str).goal(prev)' },
          { key: 'A.E(str,any).prev', text: 'Act.Emit(str,any).goal(prev)' },
        ]
      },
      {
        header: 'Alert',
        items: [
          { key: 'Alert.Action(str)', text: 'Alert.Action(Act.Emit(str))' },
          { key: 'Alert.Action(str,any)', text: 'Alert.Action(Act.Emit(str,any))' },
          { key: 'Alert.Action(=>(str))&close', text: 'Alert.Action(=>Act.Emit(str)) -> Close' },
          { key: 'Alert.Action(=>(str,any))&close', text: 'Alert.Action(=>Act.Emit(str,any)) -> Close' },
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
      if (task.key == 'A.E(str).prev')     { closure(App.Action.Emit('On_Emit').goal('prev')) }
      if (task.key == 'A.E(str,any).prev') { closure(App.Action.Emit('On_Emit', 'Emit').goal('prev')) }
      
      if (task.key == 'Alert.Action(str)')     { closure(App.Alert('Title').button('btn', App.Action.Emit('On_Emit').goal('prev'))) }
      if (task.key == 'Alert.Action(str,any)') { closure(App.Alert('Title').button('btn', App.Action.Emit('On_Emit', 'Emit').goal('prev'))) }
      if (task.key == 'Alert.Action(=>(str))&close') { closure(App.Alert('Title').button('btn', _ => {
        App.Bridge.emits([
          App.Action.Emit('On_Emit').goal('prev'),
          App.VC.Close()
        ])
      })) }
      if (task.key == 'Alert.Action(=>(str,any))&close') { closure(App.Alert('Title').button('btn', _ => {
        App.Bridge.emits([
          App.Action.Emit('On_Emit', 'Emit').goal('prev'),
          App.VC.Close()
        ])
      })) }

    },
  },
  template: `
    Tool => :groups=groups   @click=click
      `
})
