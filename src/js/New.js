/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    text: 'a',
    lines: [],
  },
  mounted () {
    
    App.Action.On('aaa', (app, loc) => {
      this.text = loc
    })



    // App.Action.Func(false)
    //   .then(a => {
    //     console.error('a', a);
    //   })
    //   .catch(e => {
    //     console.error('e', e);
    //   })


    // this.click()
    //   .then(_ => {
    //     console.error('then');
    //   })
    //   .catch(_ => {
    //     console.error('catch');
    //   })
    setTimeout(_ => (new ResizeObserver((entries) => entries[0].target == this.$el && this.$el.dispatchEvent(new CustomEvent('scroll')))).observe(this.$el))

  },
  methods: {
    async click() {

      // this.text = 'b'

      // await App.Action.Emit('aaa', {a: Date.now()}, true)

      // App.Alert()
      //   .title('a')
      //   .message('b')
      //   .input('c', 'd')
      //   .button('a')
      //   .button('c')
      //   .present(false)


      this.text = 'b'

      // await window.App.Action()
      // this.text = '1'
      // window.App.$.Action(_ => this.text = '1').emit()
      
      // await window.App.Action('aaa', {a: Date.now()})
      // window.App.$.Action('aaa', {a: Date.now()}).emit()

      // let a = await window.App.Action.Func()
      // this.text = '1'
      // window.App.$.Action.Func(_ => this.text = '1').emit()

      // let a = await App.Action.Emit('aaa', {a: Date.now()})
      // App.$.Action.Emit('aaa', {a: Date.now()}).emit()

      // let a = await App.Log('aaaaa', App.Log())
      // App.$.Log('aaaaa', App.$.Log()).emit()

      // let a = await window.App.Feedback('error')
      // window.App.$.Feedback('error').emit()
      
      // let a = await window.App.Feedback.Error()
      // window.App.$.Feedback.Error().emit()

      // let a = await window.App.Feedback('heavy')
      // window.App.$.Feedback('heavy').emit()
      
      // let a = await window.App.Feedback.Heavy()
      // window.App.$.Feedback.Heavy().emit()

      // let a = await window.App.Feedback('light')
      // window.App.$.Feedback('light').emit()
      
      // let a = await window.App.Feedback.Light()
      // window.App.$.Feedback.Light().emit()

      // let a = await window.App.Feedback('medium')
      // window.App.$.Feedback('medium').emit()
      
      // let a = await window.App.Feedback.Medium()
      // window.App.$.Feedback.Medium().emit()

      // let a = await window.App.Feedback('rigid')
      // window.App.$.Feedback('rigid').emit()
      
      // let a = await window.App.Feedback.Rigid()
      // window.App.$.Feedback.Rigid().emit()

      // let a = await window.App.Feedback('soft')
      // window.App.$.Feedback('soft').emit()
      
      // let a = await window.App.Feedback.Soft()
      // window.App.$.Feedback.Soft().emit()

      // let a = await window.App.Feedback('success')
      // window.App.$.Feedback('success').emit()
      
      // let a = await window.App.Feedback.Success()
      // window.App.$.Feedback.Success().emit()

      // let a = await window.App.Feedback('warning')
      // window.App.$.Feedback('warning').emit()
      
      // let a = await window.App.Feedback.Warning()
      // window.App.$.Feedback.Warning().emit()

      await new Promise(r => setTimeout(r, 500))
      this.text = 'c'
    },
    ckuckError () { window.App.Feedback.Error().catch(_ => {}) },
    ckuckHeavy () { window.App.Feedback.Heavy().catch(_ => {}) },
    ckuckLight () { window.App.Feedback.Light().catch(_ => {}) },
    ckuckMedium () { window.App.Feedback.Medium().catch(_ => {}) },
    ckuckRigid () { window.App.Feedback.Rigid().catch(_ => {}) },
    ckuckSoft () { window.App.Feedback.Soft().catch(_ => {}) },
    ckuckSuccess () { window.App.Feedback.Success().catch(_ => {}) },
    ckuckWarning () { window.App.Feedback.Warning().catch(_ => {}) },
    scroll (e) {
      window.App.OnScroll({
        scrollTop: e.target.scrollTop,
        clientHeight: e.target.clientHeight,
        scrollHeight: e.target.scrollHeight,
      }).catch(_ => {})

      // setTimeout(_ => window.App.$.OnScroll({
      //   scrollTop: e.target.scrollTop,
      //   clientHeight: e.target.clientHeight,
      //   scrollHeight: e.target.scrollHeight,
      // }).emit())
    },
    clickAddLine () {
      this.lines.push(Date.now())
    }
  },
  computed: {
  },
  template: `
    main#app => @scroll=scroll
      div => *text=text

      label#test => *text='click'   @click=click

      label#addLine => *text='click'   @click=clickAddLine

      #lines
        .line => *for=(line, i) in lines   :key=i   *text=line

      #feedbacks
        label => *text='Error'   @click=ckuckError
        label => *text='Heavy'   @click=ckuckHeavy
        label => *text='Light'   @click=ckuckLight
        label => *text='Medium'   @click=ckuckMedium
        label => *text='Rigid'   @click=ckuckRigid
        label => *text='Soft'   @click=ckuckSoft
        label => *text='Success'   @click=ckuckSuccess
        label => *text='Warning'   @click=ckuckWarning
  `
})
