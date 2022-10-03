
Load.Vue({
  data: {
    loading: true,
    sn: '',
    datePicker: DatePicker(),
    rows: [],
    total: 0,
    nextId: 0,
    limit: 10
  },
  mounted () {
    Param.Query({ sn: '', date: null })
    this.sn = Param.Query.sn
    this.datePicker.date = Param.Query.date
    this.more(Alert('讀取資料中…').present(null, false))
  },
  methods: {
    alertError (alert, message, title = '錯誤！') {
      alert = alert ? alert.reset('錯誤！', message) : Alert('錯誤！', message)
      return alert
        .button('確定', alert => alert.loading(_ => Redirect()))
        .present()
    },
    more (alert = null) {
      API.GET(`heartbeat/devices`, { date: this.datePicker.toString(), sn: Param.Query.sn, nextId: this.nextId, limit: this.limit })
        .done(({ nextId, total, logs }) => {
          this.nextId = nextId
          this.total = total
          this.rows.push(...logs)
          alert && alert.dismiss(_ => this.loading = false)
        })
        .fail((message, code) => this.alertError(alert, message))
        .send()
    }
  },
  template: `
    main#app => *if=!loading

      div.table.pure
        a.back => *text='回首頁'   @click=Redirect()

      div.table
        form.search => @submit.prevent=Redirect(Param.Query)
          label.condition.date
            span => *text='日期：'
            label => *text=datePicker.formally   @click=datePicker.pick(date => Param.Query.date = date)
          label.condition.input
            span => *text='序號：'
            input => type=text   placeholder=請輸入咖啡機序號搜尋…   :autofocus=true   *model.trim=sn
          button => type=submit   *text='搜尋'

      div.header => *text='目前共有 ' + numFormat(total) + ' 筆資料。'
      div.table => *if=rows.length
        div.row => *for=(row, i) in rows   :key=i
          span.title
            a => *text=row.sn   @click=Redirect('heartbeat/device', { sn: row.sn, date: datePicker.toString() })
          span.onlines
            i._i => *for=(online, j) in row.onlines   :key=j   :text=online.t   :class=['s' + online.s, 'e' + online.e]
          span.second => *text=numFormat(row.second)

      div.table.pure => *if=nextId !== null && nextId !== 0
        a.more => *text='載入更多…'   @click=more()`
})
