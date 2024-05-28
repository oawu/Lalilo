/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.VueComponent('Tool', {
  props: {
    groups: { type: Array, required: true, default: [] },

    // func1: { type: Function, required: true, default: null },
  },
  data: _ => ({
    taskIs: null,
    completionIs: null,

    task: { i: 0, appParam: '', jsParam: '', date: '' },
    completion: { i: 0, appParam: '', jsParam: '', date: '' },

    completions: [
      { key: 'x',            text: '無' },
      { key: 'A.F(=>)',      text: 'Act.Func(=>)' },
      { key: 'A.E(str)',     text: 'Act.Emit(str)' },
      { key: 'A.E(str,any)', text: 'Act.Emit(str,any)' },
      { key: 'A(=>)',        text: 'Act(=>)' },
      { key: 'A(str)',       text: 'Act(str)' },
      { key: 'A(str,any)',   text: 'Act(str,any)' },
      { key: '=>',           text: '=>' },
      { key: 'str',          text: 'str' },
      { key: 'str,any',      text: 'str,any' },
    ],

    func1: null,
    func2: null,

    bridgeOns: []
  }),
  mounted () {
    setTimeout(_ => this.$el.dispatchEvent(new CustomEvent('scroll')), 1)
    App.Bridge.$.subscribe(_ => this.bridgeOns = App.Bridge.$.struct)

    this.func1 = (appParam, jsParam) => {
      this.task.i = this.task.i + 1
      this.task.appParam = appParam
      this.task.jsParam = jsParam
      this.task.date = Helper.date()
    }
    this.func2 = (appParam, jsParam) => {
      this.completion.i = this.completion.i + 1
      this.completion.appParam = appParam
      this.completion.jsParam = jsParam
      this.completion.date = Helper.date()
    }

    App.Bridge.on('On_Emit', this.func1)
    App.Bridge.on('On_Completion', this.func2)

    this.completionIs = this.completions[0]
  },
  methods: {
    click() {
      if (this.taskIs === null || this.completionIs === null) {
        return
      }

      this.$emit('click', this.taskIs, this.func1, (app, completion = null) => {
        if (this.completionIs.key == 'x')            { App.Bridge.emit(app) }
        if (this.completionIs.key == 'A.F(=>)')      { App.Bridge.emit(app, App.Action.Func(this.func2)) }
        if (this.completionIs.key == 'A.E(str)')     { App.Bridge.emit(app, App.Action.Emit('On_Completion')) }
        if (this.completionIs.key == 'A.E(str,any)') { App.Bridge.emit(app, App.Action.Emit('On_Completion', 'Completion')) }
        if (this.completionIs.key == 'A(=>)')        { App.Bridge.emit(app, App.Action(this.func2)) }
        if (this.completionIs.key == 'A(str)')       { App.Bridge.emit(app, App.Action('On_Completion')) }
        if (this.completionIs.key == 'A(str,any)')   { App.Bridge.emit(app, App.Action('On_Completion', 'Completion')) }
        if (this.completionIs.key == '=>')           { App.Bridge.emit(app, this.func2) }
        if (this.completionIs.key == 'str')          { App.Bridge.emit(app, 'On_Completion') }
        if (this.completionIs.key == 'str,any')      { App.Bridge.emit(app, 'On_Completion', 'Completion') }
      })
    },
    scroll (e) {
      App.OnScroll(e.target.scrollTop, e.target.clientHeight, e.target.scrollHeight).emit()
    }
  },
  computed: {
  },
  template: `
    main#app => @scroll=scroll
      #monit
        #info
          slot

          template => *if=task !== null
            .header => *text='Action Result'
            .unit
              div
                span => *text=task.i   :before='Index'   :after='次'
                span => *text=task.appParam   :before='App'
                span => *text=task.jsParam   :before='JS'
                span => *text=task.date   :before='Time'

          template => *if=completion !== null
            .header => *text='Completion Result'
            .unit
              div
                span => *text=completion.i   :before='Index'   :after='次'
                span => *text=completion.appParam   :before='App'
                span => *text=completion.jsParam   :before='JS'
                span => *text=completion.date   :before='Time'

          .header => *text='Action Func in Map'
          .unit
            div
              span => *text=App.Action.Func.Map.size   :before='Count'   :after='個'

          .header => *text='On Emit'
          .unit
            div
              span => *for=({ key, funcs }, i) in bridgeOns   :key=i   *text=funcs.length   :before=key   :after='個'
          
          label.btn => *text='執行'   :class={enabled:taskIs && completionIs}   @click=click()

        #line-1

        #ctrl
          .group => *for=(group, i) in groups   :key=i
            header => *if=group.header !== ''   *text=group.header   :after=group.items.length
            .items
              label.set => *for=(item, j) in group.items   :key=j   :class={checked: taskIs == item}   @click=_ => {taskIs=item==taskIs ? null : item;click()}
                span => *text=item.text

          #line-3

          .group
            header => *text='Completion'   :after=completions.length
            .items
              label.set => *for=(item, i) in completions   :key=i   :class={checked: completionIs == item}   @click=_ => {completionIs=item==completionIs ? null : item;click()}
                span => *text=item.text

      template => *if=0
        #line-2

        label.btn => *text='執行'   :class={enabled:taskIs && completionIs}   @click=click()
  `
})

