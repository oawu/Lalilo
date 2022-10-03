const KEY = {
  cmd: 'mqtt/gui/cmds',
  page: 'mqtt/gui',
  log: '',
}
const isJson = item => {
  item = typeof item !== "string" ? JSON.stringify(item) : item

  try {
      item = JSON.parse(item)
  } catch (e) {
      return false
  }

  return typeof item == "object" && item !== null
}
const syntaxHighlight = json => {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
      let cls = 'number'
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'key'
              match = match.replace(/:$/, '')
          } else {
              cls = 'string'
          }
      } else if (/true|false/.test(match)) {
          cls = 'boolean'
      } else if (/null/.test(match)) {
          cls = 'null'
      }
      return '<span class="' + cls + '">' + match + '</span>'
  })
}

const PanelBody = function(identifier) {
  if (!(this instanceof PanelBody))
    return new PanelBody(identifier)

  this.identifier = identifier
}
PanelBody.prototype.dismiss = function() { return this }
PanelBody.prototype.present = function() { return this }
Object.defineProperty(PanelBody.prototype, 'title', { get () { return '' } })

const At = function(unix = null) {
  if (!(this instanceof At))
    return new At(unix)

  this.unix = unix ? unix : Date.now()
  const now = new Date(this.unix)
  this.date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  this.time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
}
Object.defineProperty(At.prototype, 'datetime', { get () { return this.date !== null && this.time !== null ? `${this.date} ${this.time}` : null } })

const Message = function(message) {
  if (!(this instanceof Message))
    return new Message(message)

  // if (message === null)
  //   return this.isJson = false, this.value = null, this.copy = '', this.format = ''

  this.isJson = isJson(message)
  this.value = message
  this.copy = this.isJson ? JSON.stringify(JSON.parse(message), undefined, 4) : message
  this.format = this.isJson ? syntaxHighlight(this.copy) : message
}

const Log = function(unix, type, topic, message) {
  if (!(this instanceof Log))
    return new Log(unix, type, topic, message)
  else
    PanelBody.call(this, 'panel_log')

  this.at = At(unix)

  this.type = type
  this.topic = topic
  this.message = Message(message)

  this.focus = false
  this.shine = false
  this.timer = null
  this.filter = null
  this.cmd = null
}
Log.prototype = Object.create(PanelBody.prototype)
Log.prototype.dismiss = function() { return this.focus = false, this }
Log.prototype.present = function() { return this.focus = true, this }
Log.prototype.setFilter = function(filter) { return this.filter = filter, this }
Log.prototype.setShine = function() { return this.timer = setTimeout(_ => this.shine = false, 2000, clearTimeout(this.timer, this.shine = true)), this }
Log.prototype.setCmd = function(cmd) { return this.cmd = cmd, this }
Object.defineProperty(Log.prototype, 'title', { get () { return '紀錄' } })

const Node = function(parent, key) {
  if (!(this instanceof Node))
    return new Node(parent, key)
  else
    PanelBody.call(this, 'panel_node')

  this.key = key
  this.message = null
  this.nodes = []
  
  this.parent = parent
  this.map = new Map()
  
  this.show = false
  this.shine = false
  this.timer = null
  
  this.at = null
  this.focus = false
  this.log = null
  this.cmd = null
}
Node.prototype = Object.create(PanelBody.prototype)
Node.prototype.dismiss = function() { return this.focus = false, this }
Node.prototype.present = function() { return this.focus = true, this }
Node.prototype.setAt = function(unix) { return this.at = At(unix), this }
Node.prototype.setLog = function(log) { return this.log = log, this }
Node.prototype.setShine = function() { return this.timer = setTimeout(_ => this.shine = false, 1000, clearTimeout(this.timer, this.shine = true)), this }
Node.prototype.update = function(message, unix) { return this.setAt(unix).setShine(this.message = message === null ? null : Message(message)) }
Node.prototype.setCmd = function(cmd) { return this.cmd = cmd, this }

Node.prototype.open = function(open) {
  return this.show = open, this.nodes.forEach(node => node.open(open), this) }

Node.prototype.reload = function() {
  const nodes = []
  for (var [_, node] of this.map) nodes.push(node)
  return this.nodes = nodes, this
}
Object.defineProperty(Node.prototype, 'title', { get () { return '節點' } })
Object.defineProperty(Node.prototype, 'topic', { get () {
  const topics = []
  for (let parent = this; parent; parent = parent.parent) topics.unshift(parent.key)
  return topics.join('/')
} })

const Panel = function() {
  return this instanceof Panel
    ? this.$ = new Vue({
        data: {
          panel: this,
          object: null,
          display: false,
          presented: false,
        },
        methods: {
          present (object, completion = null) {
            this.$el || this.$mount() && document.body.append(this.$el)
     
            return setTimeout(_ => setTimeout(_ => typeof completion == 'function' && completion(this.panel), 250, this.presented = true), 50,
              this.object && this.object.dismiss(),
              this.object = object instanceof PanelBody ? object.present() : null), this
          },
          dismiss(completion = null) {
            return setTimeout(_ => setTimeout(_ => {
              this.object && this.object.dismiss()
              this.object = null
              typeof completion == 'function' && completion(this.panel)
            }, 250, this.presented = false), 10), this
          },
          copy (copy) {
            const el = document.createElement('textarea')
            el.className = 'copy'
            el.value = copy
            document.body.appendChild(el)
            el.select()

            try { document.execCommand('copy'), Toastr.success('複製成功！') }
            catch (_) { Toastr.failure('複製失敗…') }

            document.body.removeChild(el)
          }
        },
        template: El3(`
          div#panel => *if=object   :class={ presented }
            div._panel
              component => :is=object.identifier   :object=object   @dismiss=dismiss   @copy=copy`).toString(),
      })
    : new Panel()
}
Panel.prototype.present = function (object, completion = null) { return this.$.present(object, completion), this }
Panel.prototype.dismiss = function (completion = null) { return this.$.dismiss(completion), this }
Object.defineProperty(Panel.prototype, 'object', { get () { return this.$.object } })

const Cmd = function(topic = '', message = '', qos = 0, retain = false, mini = false, index = null, page = 1) {
  if (!(this instanceof Cmd))
    return new Cmd(topic, message, qos, retain, mini, index, page)

  this._index = index === null ? Cmd.index++ : index
  
  this._topic = topic
  this._message = message
  this._qos = qos
  this._retain = retain
  this._mini = mini

  this._submit = null
  this._page = page
  Cmd.boxs.push(this)
}
Cmd.prototype.submit = function(submit) { return this._submit = submit, this }
Cmd.prototype.serialize = function(submit) { return { index: this._index, topic: this.topic, message: this.message, qos: this.qos, retain: this.retain, mini: this.mini, page: this.page } }

Object.defineProperty(Cmd.prototype, 'page', { get () { return this._page }, set (val) { return Cmd.update(this._page = val) } })
Object.defineProperty(Cmd.prototype, 'topic', { get () { return this._topic }, set (val) { return Cmd.update(this._topic = val) } })
Object.defineProperty(Cmd.prototype, 'message', { get () { return this._message }, set (val) { return Cmd.update(this._message = val) } })
Object.defineProperty(Cmd.prototype, 'qos', { get () { return this._qos }, set (val) { return Cmd.update(this._qos = val) } })
Object.defineProperty(Cmd.prototype, 'retain', { get () { return this._retain }, set (val) { return Cmd.update(this._retain = val) } })
Object.defineProperty(Cmd.prototype, 'mini', { get () { return this._mini }, set (val) { return Cmd.update(this._mini = val) } })

Object.defineProperty(Cmd.prototype, 'data', { get () { return { index: this._index, topic: this.topic, message: this.message, option: { qos: this.qos, retain: this.retain } } } })
Cmd.index = 1
Cmd.update = function() { return Data.set(KEY.cmd, Cmd.boxs.cmds.map(cmd => cmd.serialize())), Cmd }
Cmd.boxs = {
  _: null,
  get $() {
    if (this._ === null)
      this._ = new Vue({
        data: {
          cmds: this.cmds,
          // index: 1,
          qoss: [0, 1, 2],
          retains: [true, false]
        },
        methods: {
          present () {
            this.$el || this.$mount() && document.body.append(this.$el)
          },
          dismiss () {
          },
          remove (cmd) {
            let i = this.cmds.indexOf(cmd)
            i == -1 || this.cmds.splice(i, 1)
            Cmd.update()
          }
        },
        template: El3(`
          div#cmds => *if=cmds.length
            div.cmd => *for=(cmd, i) in cmds   :key=i   :class={ mini: cmd.mini }
              header
                label.close => @click=remove(cmd)
                label.resize => @click=cmd.mini=!cmd.mini
                b => @click=cmd.mini=false   *text='指令 ' + cmd._index

              div.bodys => :class='b' + cmd.page
                div.body.b1
                  div._group
                    div.header => *text='Topic'
                    div.box.pure
                      label.row.fix
                        input => type=text   placeholder=Topic…   *model.trim=cmd.topic
                  
                  div._group
                    div.header => *text='Message'
                    div.box.pure
                      label.row.fix.textarea
                        textarea => type=text   placeholder=Message…   *model.trim=cmd.message   ref=message

                  div._group
                    div.header => *text='其他設定'
                    div.box
                      label.row => @click=cmd.page=2
                        b => *text='QOS'
                        span => *text=cmd.qos
                        i.arrow
                      label.row => @click=cmd.page=3
                        b => *text='Retain'
                        span => *text=cmd.retain ? '是' : '否'
                        i.arrow

                  div._group
                    div.box
                      label.btn => *text='確定送出'   @click=typeof cmd._submit == 'function' ? cmd._submit(cmd.data) : Toastr.failure('無法送出指令(0)')

                div.body.b2
                  div._group
                    div.header => *text='QOS'
                    div.box
                      label.row-check => *for=(qos, i) in qoss   :key=i   :class={checked: cmd.qos == qos}   @click=cmd.qos = qos,cmd.page=1
                        i
                        span => *text=qos

                  div._group
                    div.box
                      label.btn => *text='返回'   @click=cmd.page=1

                div.body.b3
                  div._group
                    div.header => *text='Retain'
                    div.box
                      label.row-check => *for=(retain, i) in retains   :key=i   :class={checked: cmd.retain == retain}   @click=cmd.retain = retain,cmd.page=1
                        i
                        span => *text=retain ? '是' : '否'
                  
                  div._group
                    div.box
                      label.btn => *text='返回'   @click=cmd.page=1`).toString()
      })
    return this._
  },
  cmds: [],
  checked () {
    this.cmds.length
      ? this.$.present()
      : this.$.dismiss()
  },
  push(cmd) {
    this.cmds.push(cmd)
    Cmd.update()
    return this.checked()
  }
}
Cmd.unserialize = function(submit) {
  const cmds = Data.get(KEY.cmd) || []
  Cmd.index = cmds.map(({ index }) => index).reduce((a, b) => a > b ? a : b, 0) + 1
  cmds.forEach(({ topic, message, qos, retain, mini, index, page }) => Cmd(topic, message, qos, retain, mini, index, page).submit(submit))
}

Load.VueComponent('node', {
  props: { node: { type: Node, required: true }, panel: { type: Object, required: true } },
  methods: { click () { this.panel.present(this.node, this.node.show =! this.node.show) } },
  template: `
    div.node => :class={ show: node.show, shine: node.shine, sub: node.nodes.length, focus: node.focus }
      label => @click=click
        i => *if=node.nodes.length
        b => *text=node.key
        span => *if=node.message !== null   *text=node.message.value
      div.nodes => *if=node.nodes.length
        node => *for=(n, i) in node.nodes   :key=i   :node=n   :panel=panel`
})
Load.VueComponent('panel_node', {
  props: {
    object: { type: PanelBody, required: true }
  },
  methods: {
    cmd () {}
  },
  template: `
    div.node
      header._header
        b => *text=object.title
        label => *text='關閉'   @click=$emit('dismiss')

      div._group
        div.header => *text='Topic'
        div.box
          div.row
            span => *text=object.topic
            label.copy => *text='複製'   @click=$emit('copy', object.topic)

      div._group
        div.header => *text='Key'
        div.box
          div.row
            span => *text=object.key
            label.copy => *text='複製'   @click=$emit('copy', object.key)

      div._group => *if=object.at
        div.header => *text='時間'
        div.box
          div.row
            b => *text='Datetime'
            span => *text=object.at.datetime
            label.copy => *text='複製'   @click=$emit('copy', object.at.datetime)
          div.row
            b => *text='Unix Time'
            span => *text=object.at.unix
            label.copy => *text='複製'   @click=$emit('copy', object.at.unix)
      
      div._group => *if=object.nodes.length
        div.header => *text='子項目'
        div.box
          div.row => *for=(node, i) in object.nodes   :key=i
            span => *text=node.key
            label.copy => *text='複製'   @click=$emit('copy', node.key)

      div._group => *if=object.message
        div.header => *text='內容'
        div.box
          div.row
            pre => *if=object.message.isJson   *html=object.message.format
            span => *else   *html=object.message.value
            label.copy => *text='複製'   @click=$emit('copy', object.message.copy)

      div._group => *if=object.log
        div.box
          label.btn => *text='檢視此 Topic Logs'   @click=object.log(object.topic)

      div._group => *if=object.cmd
        div.box
          label.btn => *text='我要下指令'   @click=typeof object.cmd == 'function' && object.cmd(object.topic, object.message !== null ? object.message.value : '')`
})
Load.VueComponent('panel_log', {
  props: {
    object: { type: PanelBody, required: true }
  },
  methods: {
    cmd () {}
  },
  template: `
    div.log
      header._header
        b => *text=object.title
        label => *text='關閉'   @click=$emit('dismiss')

      div._group
        div.header => *text='Topic'
        div.box
          div.row
            span => *text=object.topic
            label.copy => *text='複製'   @click=$emit('copy', object.topic)

      div._group => *if=object.at
        div.header => *text='時間'
        div.box
          div.row
            b => *text='Datetime'
            span => *text=object.at.datetime
            label.copy => *text='複製'   @click=$emit('copy', object.at.datetime)
          div.row
            b => *text='Unix Time'
            span => *text=object.at.unix
            label.copy => *text='複製'   @click=$emit('copy', object.at.unix)

      div._group
        div.header => *text='內容'
        div.box
          div.row
            pre => *if=object.message.isJson   *html=object.message.format
            span => *else   *html=object.message.value
            label.copy => *text='複製'   @click=$emit('copy', object.message.copy)

      div._group => *if=object.filter
        div.box
          label.btn => *text='過濾此 Topic'   @click=object.filter(object.topic)

      div._group => *if=object.cmd
        div.box
          label.btn => *text='我要下指令'   @click=typeof object.cmd == 'function' && object.cmd(object.topic, object.message !== null ? object.message.value : '')`
})
Load.Vue({
  data: {
    socket: null,
    alert: Alert(),

    index: Data.get(KEY.page) || 1,
    map: new Map(),
    panel: Panel(),

    node: {
      items: [],
    },

    log: {
      items: [],
      model: '',
      value: '',
      timer: null,
      index: 1,
      maxCount: 500
    }
  },
  mounted () {
    this.alert = this.alert.reset('讀取資料中…').present(null, false)
    this.socket = io.connect(SOCKET, { reconnection: true, path: '/mqtt/gui/' })
    this.socket.on('status', status => status && this.alert.dismiss())
    this.socket.on('destroy', message => {
      this.socket.disconnect()
      this.socket = null
      this.alert.reset('發生錯誤！', message).button('確定', alert => alert.dismiss(_ => location.reload(true))).present()
    })
    this.socket.on('connect_error', _ => {
      this.socket = null
      this.alert.reset('發生錯誤！', 'SOCKET 連線失敗，請稍後再試！').button('確定', alert => alert.dismiss(_ => location.reload(true))).present()
    })
    this.socket.on('disconnect', _ => {
      this.socket = null
      this.alert.reset('發生錯誤！', 'SOCKET 已經斷線，請重新整理畫面試試！').button('確定', alert => alert.dismiss(_ => location.reload(true))).present()
    })
    this.socket.on('val', this.merge)
    Cmd.unserialize(this.sendCmd)
    setTimeout(_ => this.log.model = Data.get(KEY.log) || '', 100)
  },
  methods: {
    sendCmd ({ index, topic, message, option }) {
      if (topic === '')
        return Toastr.failure(`「指令 ${index}」沒有填寫 Topic`)
      if (message === '')
        return Toastr.failure(`「指令 ${index}」沒有填寫 Message`)
      
      this.socket.emit('cmd', { topic, message, option })
      Toastr.success(`「指令 ${index}」發送成功！`)
    },
    modify () {
      const nodes = []
      for (var [_, node] of this.map) nodes.push(node)
      this.node.items = nodes
    },
    merge ({ type, topic, message, unix }) {
      message = message
      
      this.log.items.unshift(Log(unix, type, topic, message)
          .setShine()
          .setFilter(topic => this.panel.dismiss(_ => this.log.model = topic, this.log.index = 1))
          .setCmd((topic, message) => Cmd(topic, message).submit(this.sendCmd)))

      if (this.log.items.length > this.log.maxCount)
        this.log.items = this.log.items.slice(0, this.log.maxCount)

      if (type != 'r')
        return

      let m = this.map
      let o = null

      for (let path of topic.split('/')) {
        let o1 = m.get(path)
        
        if (o1 === undefined) {
          o1 = Node(o, path)
            .setLog(topic => this.panel.dismiss(_ => this.log.model = topic, this.index = 2))
            .setCmd((topic, message) => Cmd(topic, message).submit(this.sendCmd))
          m.set(path, o1)
          o && o.reload()
        }

        m = o1.map
        o = o1.setShine()
      }
      o.update(message, unix)
      this.modify()
    },
    page (index) {
      this.index = index
      Data.set(KEY.page, this.index)
    }
  },
  computed: {
    logs () {
      return this.log.value == '' ? this.log.items : this.log.items.filter(({ topic }) => {
        if (this.log.index == 0) return topic == this.log.value
        let pattern = this.log.index == 2 ? new RegExp(`${this.log.value}$`, 'i') : new RegExp(`^${this.log.value}`, 'i')
        return pattern.test(topic);
      })
    }
  },
  watch: {
    'log.model' (val) {
      this.log.timer = setTimeout(_ => this.panel.dismiss(Data.set(KEY.log, this.log.model), this.log.value = this.log.model, this.log.value === '' && (this.log.index = 1)), 300, clearTimeout(this.log.timer))
    }
  },
  template: `
    main#app
      div#tabs
        div
          label => *text='首頁'   :class={focus: index == 0}   @click=panel.dismiss(),index=0,alert.reset('', '確定要離開？').button('取消', alert => alert.dismiss(_ => page(1))).button('確定', alert => alert.loading(_ => Redirect())).present()
          label => *text='樹狀'   :class={focus: index == 1}   @click=panel.dismiss(),page(1)
          label => *text='紀錄'   :class={focus: index == 2}   @click=panel.dismiss(),page(2)
          label => *text='指令'   @click=Cmd().submit(sendCmd)

      div#home => *if=index == 0

      div#tree => *if=index == 1
        div#buttons
          label => *text='全部打開'   @click=node.items.forEach(item => item.open(true))
          label => *text='全部關閉'   @click=node.items.forEach(item => item.open(false))

        div#nodes
          node => *for=(n, i) in node.items   :key=i   :node=n   :panel=panel

      div#logs => *if=index == 2
        div.filter
          segmented => *if=log.value.length   :items=['全部符合', '前綴符合', '後綴符合']   :index=log.index   @click=i=>panel.dismiss(log.index=i)
          label._text
            input => type=text   placeholder=請輸入關鍵字過濾 Topic…   :autofocus=true   *model.trim=log.model
          label._clear => *text='清除'   @click=log.model=''   :class={enable: log.value.length}
        div.logs
          label.clear => *if=log.items.length   *text='清除全部'   @click=log.items = []
          div.log => *for=(l, i) in logs   :key=i   :class={shine: l.shine, focus: l.focus}   @click=panel.present(l)
            span.type => :class=l.type
            span.time => *text=l.at.time
            div.topic
              span => *for=(k, i) in l.topic.split('/')   :key=i   *text=k
            span.val => *text=l.message.value
      div#cmd => *if=index == 3`
})