/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.VueComponent('Error', {
  props: {
    error: { type: String, default: '', required: true },
  },
  template: `
    #socket-error => *if=error !== ''
      div => *text=error
      label => @click=location.reload(true)   *text='重新整理'`
})

Load.VueComponent('Loading', {
  props: {
    error: { type: String, default: '', required: true },
    socket: { type: Object, default: null, required: true },
    hook: { type: Object, default: null, required: true },
    logs: { type: Array, default: null, required: [] },
  },
  template: `#loading => *if=error === '' && (socket === null || hook === null || !Array.isArray(logs))`
})

Load.VueComponent('Info', {
  props: {
    error: { type: String, default: '', required: true },
    socket: { type: Object, default: null, required: true },
    hook: { type: Object, default: null, required: true },
    logs: { type: Array, default: null, required: [] },
  },
  template: `
    #info => *if=error === '' && socket !== null && hook !== null && Array.isArray(logs)
      h1#h1
        span#status => :class=hook.status
        span#fname => *text=hook.name
        span#id => *text='#' + hook.id
      
      #error => *if=hook.error
        pre => *text=hook.error

      #result
        .rows
          .row
            span.k => *text='分支'
            span.v => *text=hook.branch
          .row
            span.k => *text='提交者'
            span.v => *text=hook.author
          .row
            span.k => *text='時間'
            span.v => *text=hook.date
          .row
            span.k => *text='耗時'
            span.v => *text=hook.time.d !== null ? hook.time.d + ' 秒' : '?'

      #logs
        .log => *for=log in logs   :key=log.id
          .info
            span.result => *if=log.status != 'ing'   :class=log.status
            span.ing => *else
              i.__i0
              i.__i1
              i.__i2
              i.__i3
              i.__i4
              i.__i5
              i.__i6
              i.__i7

            span.id => *text=log.id
            span.name => *text=log.title
            span.sec => *if=log.time.d !== null   *text=log.time.d
            span.time => *text=log.at.create
            
          .output => *if=log.output
            pre => *text=log.output

  `
})

Load.Vue({
  data: {
    socket: null,
    error: '',
    hook: null,
    logs: null,
  },
  mounted () {
    this.socket = io.connect(window.socketUrl, {
      reconnection: true,
      path: '/hook-ui/',
      extraHeaders: { token: window.token }
    })

    this.socket.on('log', log => {
      if (!Array.isArray(this.logs)) {
        return
      }
      if (typeof log != 'object' || log == null || Array.isArray(log)) {
        return
      }

      let idx = this.logs.findIndex(({ id }) => log.id == id)

      idx != -1
        ? this.logs.splice(idx, 1, log) 
        : this.logs.unshift(log)
    })

    this.socket.on('logs', logs => this.logs = logs)
    this.socket.on('hook', hook => this.hook = hook)

    this.socket.on('connect', _ => {
      this.error = ''
      this.socket.emit('hook')
      this.socket.emit('logs')
    })

    this.socket.on('destroy', _ => {
      this.socket.disconnect()
      this.error = '發生錯誤(1)！'
    })
    this.socket.on('connect_error', _ => {
      this.error = '發生錯誤(2)！'
    })
    this.socket.on('disconnect', _ => {
      this.error = '發生錯誤(3)！SOCKET 已經斷線，請重新整理畫面試試！'
    })
    this.socket.on('db-error', data => {
      this.socket.disconnect()
      this.error = `發生錯誤(4)！錯誤原因：${data}`
    })
  },
  computed: {
  },
  methods: {
  },
  template: `
  main#app

    Error => :error=error

    Loading => :error=error   :socket=socket   :hook=hook   :logs=logs

    Info => :error=error   :socket=socket   :hook=hook   :logs=logs
  `
})
