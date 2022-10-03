
Load.Vue({
  data: {
    loading: true,
    sn: '',
    date: '',
    info: null,
    mins: [],
    tip: {
      timer: null,
      top: null,
      left: null,
      text: ''
    },
    datePicker: DatePicker(),
  },
  mounted () {
    Param.Query({ sn: null, date: null })
    if (Param.Query.sn === null)
      return this.alertError('沒有 SN 參數')
    this.datePicker.date = Param.Query.date

    let alert = Alert('讀取資料中…').present(null, false)

    API.GET(`heartbeat/device/${Param.Query.sn}`, { date: this.datePicker.toString() })
      .done(({ sn, date, mins, info }) => {
        this.sn = sn
        this.date = date
        this.mins = mins
        this.info = info
        alert.dismiss(_ => this.loading = false)
      })
      .fail((message, code) => this.alertError(alert, message))
      .send()
  },
  methods: {
    copy (copy) {
      const el = document.createElement('textarea')
      el.className = 'copy'
      el.value = copy
      document.body.appendChild(el)
      el.select()

      try { document.execCommand('copy'), Toastr.success('複製成功！') }
      catch (_) { Toastr.failure('複製失敗…') }

      document.body.removeChild(el)
    },
    alertError (alert, message, title = '錯誤！') {
      alert = alert ? alert.reset('錯誤！', message) : Alert('錯誤！', message)
      return alert
        .button('確定', alert => alert.loading(_ => Redirect()))
        .present()
    },
    updatePos(min) {
      clearTimeout(this.tip.timer)
      this.tip.timer = null

      if (min === null)
        return this.tip.timer = setTimeout(_ => {
          this.tip.top = null
          this.tip.left = null
          this.tip.text = ''
        }, 100)

      this.tip.timer = setTimeout(_ => {
        this.tip.top = min.p.t
        this.tip.left = min.p.l
        this.tip.text = min.t
      }, 10)
    }
  },
  template: `
    main#app => *if=!loading
      div.group.pure
        a.back => *text='回列表'   @click=Redirect('heartbeat/devices', {date: datePicker.toString()})
      div.group
        div.sn => :text='SN'
          label => *text=sn   @click=Alert(null, '請輸入要查詢的 SN').input('Serial Number…').button('確定', (alert, sn) => alert.loading(alert => (sn && (Param.Query.sn = sn, Redirect(Param.Query)), alert.dismiss()))).button('取消', alert => alert.dismiss()).present()
          button.cpy => *text='複製'   @click=copy(sn)
        div.row => :text='日期'
          label => *text=datePicker.formally   @click=datePicker.pick(date => (Param.Query.date = date, Redirect(Param.Query)))
      
      div.group => *if=!info   *text='⚠️ 注意！此台咖啡機不存在！'
      div.group.n2 => *else
        div.column
          div.row => :text='ID'
            span => *text=info.id
            button.cpy => *text='複製'   @click=copy(info.id)
          div.row => :text='韌體版本'
            span => *text=info.version
            button.cpy => *if=info.version   *text='複製'   @click=copy(info.version)
          div.row => :text='韌體規則'   *text=info.rule
          div.row => :text='是否為開發機'   *text=info.isDev ? '✅ 是' : '⚠️ 否'
          div.row => :text='是否為商家版本'   *text=info.isCommer ? '✅ 是' : '⚠️ 否'
          div.row => :text='是否為自動供水版本'   *text=info.isAutoWater ? '✅ 是' : '⚠️ 否'
        div.column
          div.row => :text='使用者'
            span => *text=info.user ? info.user.name : ''
            button.cpy => *if=info.user   *text='複製 NO'   @click=copy(info.user.no)
          div.row => :text='合約用戶'
            span => *text=info.owner ? info.owner.name : ''
            button.cpy => *if=info.owner   *text='複製 NO'   @click=copy(info.owner.no)
          div.row => :text='藍芽韌體版本'
            span => *text=info.bleVersion
            button.cpy => *if=info.bleVersion   *text='複製'   @click=copy(info.bleVersion)
          div.row => :text='WIFI Module 版本'
            span => *text=info.wifiVersion
            button.cpy => *if=info.wifiVersion   *text='複製'   @click=copy(info.wifiVersion)
          div.row => :text='連結基地台 SSID'
            span => *text=info.ssid
            button.cpy => *if=info.ssid   *text='複製'   @click=copy(info.ssid)
          div.row => :text='最後一次 IP'
            span => *text=info.ip
            button.cpy => *if=info.ip   *text='複製'   @click=copy(info.ip)

      div.group
        div.mins-scroll
          div.box
            div.mins-y
              span => *for=i in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]   :key=i   *text=i

            div.mins => @mouseleave=updatePos(null)
              span.min => *for=min in mins   :key=min.i   :class=['t' + min.p.t, 'l' + min.p.l, 'h' + min.h]   @mouseenter=updatePos(min)
                i => *for=s in min.s   :key=s   :class='s' + s
              span.tip-x => *if=tip.text !== ''   :class='t' + tip.top
              span.tip-y => *if=tip.text !== ''   :class='l' + tip.left
              span.tip => *if=tip.text !== ''   *text=tip.text   :class=['t' + tip.top, 'l' + tip.left]

          div.mins-x
            span => *for=i in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]   :key=i   *text=i

          div.info
            span.h0 => *text='沒有資訊'
            span.h1 => *text='HeartBeat'
            span.s8 => *text='沖煮回報 8'
            span.s1 => *text='沖煮回報 1'
            span.s3 => *text='沖煮回報 3'
            span.s9 => *text='沖煮回報 9'`
})
