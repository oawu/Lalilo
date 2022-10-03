
Load.Vue({
  data: {
    loading: true,
    idx: 's8',
    mins: [],
    tip: {
      timer: null,
      top: null,
      left: null,
      text: ''
    },
    hours: [],
    minutes: [],
    dateAt: DatePicker(),
  },
  mounted () {
    Param.Query({ date: null })
    let alert = Alert('讀取資料中…').present(null, false)
    
    API.GET(`heatmap/status8139`, { date: Param.Query.date })
      .done(({ sn, date, mins, info }) => {
        this.date = date

        let max = mins.map(min => {
          min.r = { s8: 0, s1: 0, s3: 0, s9: 0 }
          min.c = { s8: min.s.filter(s => s == 8).length, s1: min.s.filter(s => s == 1).length, s3: min.s.filter(s => s == 3).length, s9: min.s.filter(s => s == 9).length }
          return min
        }).reduce((a, b) => {
          a.s8 = Math.max(a.s8, b.c.s8)
          a.s1 = Math.max(a.s1, b.c.s1)
          a.s3 = Math.max(a.s3, b.c.s3)
          a.s9 = Math.max(a.s9, b.c.s9)
          return a
        }, { s8: 0, s1: 0, s3: 0, s9: 0 })

        max.s8 = 100 / max.s8
        max.s1 = 100 / max.s1
        max.s3 = 100 / max.s3
        max.s9 = 100 / max.s9

        this.mins = mins.map(min => {
          min.r = { s8: 0, s1: 0, s3: 0, s9: 0 }
          min.r.s8 = Math.min(Math.round(min.c.s8 * max.s8), 100)
          min.r.s1 = Math.min(Math.round(min.c.s1 * max.s1), 100)
          min.r.s3 = Math.min(Math.round(min.c.s3 * max.s3), 100)
          min.r.s9 = Math.min(Math.round(min.c.s9 * max.s9), 100)
          return min
        })
        this.change(0)
        
        alert.dismiss(_ => this.loading = false)
      })
      .fail((message, code) => this.alertError(alert, message))
      .send()
  },
  methods: {
    alertError (alert, message, title = '錯誤！') {
      alert = alert ? alert.reset('錯誤！', message) : Alert('錯誤！', message)
      return alert
        .button('確定', alert => alert.loading(_ => Redirect()))
        .present()
    },
    change(i) {
      this.idx = i!=3 ? i!=2 ? i!=1 ? 's8' : 's1' : 's3' : 's9'
      this.hours = []
      this.minutes = []

      for (let i = 0; i < 24; i++) {
        let c = this.mins.slice(i * 60, (i + 1) * 60).map(({ c }) => c[this.idx]).reduce((a, b) => a + b, 0)
        this.hours.push({ i, c, r: 0 })
      }
      let max = this.hours.reduce((a, b) => Math.max(a, b.c), 0)
      max = 100 / max
      this.hours.map(hour => hour.r = Math.min(Math.round(hour.c * max), 100))

      for (let i = 0; i < 60; i++) {
        let tmps = []
        for (let j = 0; j < 24; j++) {
          tmps.push(this.mins[i + j * 60])
        }
        let c = tmps.map(({ c }) => c[this.idx]).reduce((a, b) => a + b, 0)
        this.minutes.push({ i, c, r: 0 })
      }
      max = this.minutes.reduce((a, b) => Math.max(a, b.c), 0)
      max = 100 / max
      this.minutes.map(minute => minute.r = Math.min(Math.round(minute.c * max), 100))
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
        this.tip.text = `${min.t} - ${min.c[this.idx]} 次`
      }, 10)
    }
  },
  template: `
    main#app => *if=!loading
      
      div.group.pure
        a.back => *text='回首頁'   @click=Redirect()

      segmented => :items=[['開始沖', '8'], ['第一注', '1'], ['最後注', '3'], ['結束沖', '9']]   @click=change

      div.group
        b.row => *text='過去 2 週的沖煮熱點'

        div.mins-scroll
          div.box
            div.mins-y
              span => *for=hour in hours   :key=hour.i   *text=hour.i   :class='r' + hour.r   :title=hour.c
            div.mins => @mouseleave=updatePos(null)
              span.min => *for=min in mins   :key=min.i   :class=['t' + min.p.t, 'l' + min.p.l, 'r' + min.r[idx]]   @mouseenter=updatePos(min)
              span.tip-x => *if=tip.text !== ''   :class='t' + tip.top
              span.tip-y => *if=tip.text !== ''   :class='l' + tip.left
              span.tip => *if=tip.text !== ''   *text=tip.text   :class=['t' + tip.top, 'l' + tip.left]
          div.mins-x
            span => *for=minute in minutes   :key=minute.i   *text=minute.i   :class='r' + minute.r   :title=minute.c`
})
