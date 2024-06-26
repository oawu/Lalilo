/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    queueSave: Queue(),
    queueCount: Queue(),
    queueUpload: Queue(),
    queueRefresh: Queue(),
    
    count: {
      gps: null,
      done: null,
      fail: null,
    },

    date: null,
    activity: null,
    point: null,
  },
  mounted () {

    setTimeout(_ => this.$el.dispatchEvent(new CustomEvent('scroll')), 1)

    App.Bridge.on('GPS::location', this._refresh)

    App.emits([
      App.VC.Nav.Bar.Title("首頁  1"),
      App.VC.Tab.Bar.Title("首頁  2"),
    ])
      
    App.VC.Mounted().emit(_ => {

      this._count()
      // this._upload()

      this._initDate(date => {
        this.date = date
      })

      // DB._clear(_ => {

      //   this._count()
      //   // this._upload()

      //   this._initDate(date => {
      //     this.date = date

      //     this._createActivity(date, activity => {
      //       this.activity = activity
      //     })
      //   })
      // })
    })

  },
  methods: {
    // _createActivity(date, closure) {
    //   if (date === null) {
    //     return closure(null)
    //   }

    //   const now    = new Date()

    //   const dateId = date.id
    //   const hour   = now.getHours()
    //   const min    = now.getMinutes()
    //   const sec    = now.getSeconds()
    //   const time   = { gps: null, upload: null, server: null }

    //   DB.Date.Activity.where('dateId', date.id).first(
    //     (error, activity) => error
    //       ? closure(null)
    //       : DB.Date.Activity.create({ dateId, hour, min, sec, time, cntPoints: 0 },
    //         (error, activity) => {
    //           if (error) {
    //             return closure(null)
    //           }

    //           date.cntActivities += 1
    //           date.save(_ => {})
    //           return closure(activity)
    //         }))
    // },
    _initDate(closure) {
      const now   = new Date()

      const year  = now.getFullYear()
      const month = now.getMonth() + 1
      const day   = now.getDate()
      
      DB.Date.where('ymd', [year, month, day]).first(
        (error, date) => error
          ? closure(null)
          : DB.Date.create({ year, month, day, cntActivities: 0 },
            (error, date) => closure(error
              ? null
              : date)))
    },
    
    _refresh (locations) {
      if (!locations.length) {
        return
      }

      for (let _location of locations) {
        const point = DB.Date.Activity.fromJson(this.date, this.activity, _location)

        if (point === null) {
          continue
        }

        this.point = point

        this.queueSave.enqueue(next => DB.Date.Activity.Point.create(point, (error, point) => {
          if (error) {
            return next()
          }

          this.activity.time.gps = point.time
          this.activity.cntPoints += 1

          this.activity.save(_ => {})

          this._count()
          next()
        }))
      }
    },
    _count () {
      this.queueCount.enqueue(next => {
        if (!(this.activity instanceof DB.Date.Activity)) {
          this.count.gps = 0
          this.count.done = 0
          this.count.fail = 0
          return next()
        }

        Promise.all([
          DB.Date.Activity.Point.where('activityId_status', [this.activity.id, 'none']).count(),
          DB.Date.Activity.Point.where('activityId_status', [this.activity.id, 'done']).count(),
          DB.Date.Activity.Point.where('activityId_status', [this.activity.id, 'fail']).count(),
        ])
        .then(([none, done, fail]) => {
          this.count.gps = none
          this.count.done = done
          this.count.fail = fail
        })
        .finally(next)
      })
    },
    _upload () {
      this.queueUpload.enqueue(next => {
        const _done = _ => {
          next()
          return setTimeout(this._upload, 100)
        }

        if (!(this.activity instanceof DB.Date.Activity)) {
          return _done()
        }


        DB.Date.Activity.Point.where('activityId_status', [this.activity.id, 'none']).first((error, point) => {
          if (error) {
            return _done()
          }

          if (!(point instanceof DB.Date.Activity.Point)) {
            return _done()
          }

          this.activity.time.upload = Date.now()

          this.activity.save((error, activity) => {
            if (error) {
              return _done()
            }

            if (!(activity instanceof DB.Date.Activity)) {
              return _done()
            }

            this.activity = activity

            const timer = Math.random() * 5
            console.error(timer);

            setTimeout(_ => { // upload
              const done = Math.random() < 0.5

              point.status = done ? 'done' : 'fail'
              this.activity.time.server = Date.now()

              Promise.all([
                this.activity.save(),
                point.save(),
              ])
              .finally(_ => {
                this._count()
                _done()
              })

            }, timer)
          })
        })
      })
    },

    scroll (e) {
      App.OnScroll(e.target.scrollTop, e.target.clientHeight, e.target.scrollHeight).emit()
    },
    updateActivity (activity) {
      this.activity = activity
      
      if (activity === null) {
        this.point = null
      }

      this._count()
    }
  },
  template: `
    main#app => @scroll=scroll
      .groups
        
        Ctrl     => :date=date   @activity=updateActivity
        Position => :location=point
        Speed    => :location=point
        Alt      => :location=point
        Count    => :count=count
        Timelog  => :activity=activity
        Map      => :location=point
      `
})

Load.VueComponent('Ctrl', {
  props: {
    date: { type: DB.Date, required: true, default: null }
  },
  data: _ => ({
    status: null,
    isRunning: false,
  }),
  mounted () {
    App.Bridge.on('GPS::isRunning', isRunning => this.isRunning = isRunning)
    App.Bridge.on('GPS::status', status => this.status = status)
    
    App.emits([
      App.GPS.Refresh.Status(),
      App.GPS.Refresh.isRunning(),
    ])
  },
  methods: {
    start () {
      App.Alert(null, '你確定要啟動？')
        .button('取消')
        .button('確定', App.HUD.Show.Loading('開啟中，請稍後…').completion(_ => this._createActivity(this.date, activity => {
            this.$emit('activity', activity)

            activity === null
              ? App.HUD.Show.Fail('無法建立活動').completion(App.HUD.Hide(400)).emit()
              : App.GPS.Start(result => result && App.HUD.Show.Done('已開啟').completion(App.HUD.Hide(400)).emit()).emit()
          }))).emit()
    },
    stop () {
      App.Alert(null, '你確定要停止？')
        .button('取消')
        .button('確定', App.HUD.Show.Loading('關閉中，請稍後…').completion(_ => {
            this.$emit('activity', null)

          setTimeout(
            _ => App.GPS.Stop(result => result && App.HUD.Show.Done('已關閉').completion(App.HUD.Hide(400)).emit()).emit(), 500)

        })).emit()
    },
    determine () {
      App.GPS.Require.Always().emit()
    },

    _createActivity(date, closure) {
      if (date === null) {
        return closure(null)
      }

      const now    = new Date()

      const dateId = date.id
      const hour   = now.getHours()
      const min    = now.getMinutes()
      const sec    = now.getSeconds()
      const time   = { gps: null, upload: null, server: null }

      DB.Date.Activity.where('dateId', date.id).first(
        (error, activity) => error
          ? closure(null)
          : DB.Date.Activity.create({ dateId, hour, min, sec, time, cntPoints: 0 },
            (error, activity) => {
              if (error) {
                return closure(null)
              }

              date.cntActivities += 1
              date.save(_ => {})
              return closure(activity)
            }))
    },
  },
  template: `
    .group => *if=date
      .items._clear
        .ctrl.bg => *if=status=='notDetermined'
          b => *text='請同意定位'
          span => *text='請點擊這裡，並且同意「APP」讀取您的裝置定位。'
          span => *text='請求會連續兩次，請先按「使用 App 期間允許」後再按「改為永遠允許」。'
          label => *text='同意'   @click=determine

        template => *else-if=status=='always'
          .ctrl.bg => *if=isRunning
            b => *text='GPS 正在紀錄'
            span => *text='目前 GPS 紀錄正常作業中！'
            label => *text='停止紀錄'   @click=stop
          
          .ctrl.bg => *else
            b => *text='GPS 尚未開始'
            span => *text='目前未開啟 GPS 紀錄，請點擊下方「開始記錄」即可開始記錄，即便在背景模式依然可以做紀錄。'
            label => *text='開始紀錄'   @click=start
        
        .ctrl.bg => *else-if=status=='inUse'
          b => *text='無法背景定位'
          span => *text='您尚未同意使用「背景定位」！'
          span => *text='請至「設定 > 隱私權 > 定位服務 > APP」勾選「永遠」。'
          label => *text='設定'
          
        .ctrl.bg => *else
          b => *text='無法取得定位狀態'
          span => *text='系統未開啟定位功能，或您拒絕了「APP」取用您的裝置定位！'
          span => *text='請至「設定 > 隱私權 > 定位服務」確認是否有開啟定位服務，或至「設定 > 隱私權 > 定位服務 > APP」勾選「永遠」。'
          label => *text='設定'
  `
})
Load.VueComponent('Position', {
  props: {
    location: { type: Object, required: true, default: null }
  },
  data: _ => ({
  }),
  mounted () {
  },
  methods: {
  },
  computed: {
    lat () { return this.location && this.location.position ? this.location.position.lat : '' },
    lng () { return this.location && this.location.position ? this.location.position.lng : '' },
    accH () { return this.location && this.location.position ? this.location.position.acc : '' },
  },
  template: `
    .group
      .header => *text='座標資料'
      .items._clear
        .position
          .latlng
            .lat.bg.unit._left
              span => *text='緯度'
              b => *text=lat
            .lng.bg.unit._left
              span => *text='經度'
              b => *text=lng
          .accH.bg.unit._center
            span => *text='誤差範圍'
            b => *text=accH
            i => *text='公尺'
  `
})
Load.VueComponent('Speed', {
  props: {
    location: { type: Object, required: true, default: null }
  },
  data: _ => ({
  }),
  mounted () {
  },
  methods: {
  },
  computed: {
    speed1 () { return this.location && this.location.speed ? this.location.speed.kmh : '' },
    speed () { return this.location && this.location.speed ? this.location.speed.ms : '' },
    accS () { return this.location && this.location.speed ? this.location.speed.acc : '' },
  },
  template: `
    .group
      .header => *text='移動速度'
      .items._clear
        .speeds
          .unit.bg._center
            span => *text='時速'
            b => *text=speed1
            i => *text='公里/小時'

          .unit.bg._center
            span => *text='秒速'
            b => *text=speed
            i => *text='公尺/秒'

          .unit.bg._center
            span => *text='誤差值'
            b => *text=accS
            i => *text='公尺/秒'
  `
})
Load.VueComponent('Alt', {
  props: {
    location: { type: Object, required: true, default: null }
  },
  data: _ => ({
  }),
  mounted () {
  },
  methods: {
  },
  computed: {
    alt () { return this.location && this.location.altitude ? this.location.altitude.val : '' },
    accV () { return this.location && this.location.altitude ? this.location.altitude.acc : '' },
  },
  template: `
    .group
      .header => *text='海拔高度'
      .items._clear
        .alts
          .unit.bg._left
            span => *text='高度'
            b => *text=alt   :after='公尺'
          .unit.bg._left
            span => *text='誤差值'
            b => *text=accV   :after='公尺'
  `
})
Load.VueComponent('Count', {
  props: {
    count: { type: Object, required: true, default: null }
  },
  data: _ => ({
  }),
  mounted () {
  },
  methods: {
  },
  template: `
    .group
      .header => *text='數據'
      .items._clear
        .counts
          .unit.bg._center
            span => *text='未上傳'
            b => *text=count.gps === null ? '' : count.gps
            i => *text='次'

          .unit.bg._center
            span => *text='上傳成功'
            b.done => *text=count.done === null ? '' : count.done
            i => *text='次'

          .unit.bg._center
            span => *text='上傳失敗'
            b.fail => *text=count.fail === null ? '' : count.fail
            i => *text='次'
  `
})
Load.VueComponent('Timelog', {
  props: {
    activity: { type: Object, required: true, default: null }
  },
  data: _ => ({
  }),
  mounted () {
  },
  methods: {
    date (unixtime) {
      return Helper.date('Y/m/d H:i:s', new Date(unixtime))
    },
    timeago (unixtime) {
      const d = (new Date().getTime() - unixtime) / 1000

      const c = [
        { b: 10, f: '現在'},
        { b: 6,  f: '不到 1 分鐘'},
        { b: 60, f: ' 分鐘前'},
        { b: 24, f: ' 小時前'},
        { b: 30, f: ' 天前'},
        { b: 12, f: ' 個月前'}
      ]

      let u = 1

      for (let i = 0, t; i < c.length; i++, u = t) {
        t = c[i].b * u
        
        if (d < t) {
          return `${i > 1 ? parseInt(d / u, 10) : ''}${c[i].f}`
        }
      }

      return `${parseInt(d / u, 10)} 年前`
    }
  },
  computed: {
    time () {
      return this.activity && this.activity.time ? this.activity.time : null
    }
  },
  template: `
    .group
      .header => *text='時間'
      .items.bg
        .item.log
          .content
            .info
              .key
                b => *text='GPS 擷取時間'
                span => *if=time && time.gps   *text=date(time.gps)   :after=timeago(time.gps)
                span => *else

        .item.log
          .content
            .info
              .key
                b => *text='最新上傳時間'
                span => *if=time && time.upload   *text=date(time.upload)   :after=timeago(time.upload)
                span => *else

        .item.log
          .content
            .info
              .key
                b => *text='伺服器回應時間'
                span => *if=time && time.server   *text=date(time.server)   :after=timeago(time.server)
                span => *else
  `
})
Load.VueComponent('Map', {
  props: {
    location: { type: Object, required: true, default: null }
  },
  data: _ => ({
    map: null,
    d4View: { latlng: [25.0475759, 121.5177779], zoom: 15 },
    myLocation: null,
    observer: null,
    position: null,
  }),
  mounted () {
    this.observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting === true) {
        this.observer.disconnect()
        setTimeout(this._initMap, 1)
      }
    })
    this.observer.observe(this.$refs.group)
  },
  methods: {
    _initMap() {
      this.map = L.map(this.$refs.el, {
        tap: false,
        dragging: false,
        zoomControl: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        attributionControl: false
      })

      L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        minZoom: 1,
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      }).addTo(this.map)

      if (this.position) {
        let latlng = [this.position.lat, this.position.lng]
        this.map.setView(latlng, this.d4View.zoom)
        this.myLocation = MapMyLocation(latlng, this.position.acc, this.map)
      } else {
        this.map.setView(this.d4View.latlng, this.d4View.zoom)
        this.myLocation = MapMyLocation(this.d4View.latlng)
      }
    },
    zoom (level) {
      if (!this.map) { return this }
      this.map.setZoom(this.map.getZoom() + level)
      this.myLocation.acc()
    },
  },
  watch: {
    'location.position' (val) {
      this.position = val

      if (!this.map || !this.myLocation) {
        return
      }

      if (!val) {
        return this.myLocation.map(null)
      }

      let latlng = [this.position.lat, this.position.lng]

      this.map.setView(latlng)
      this.myLocation.acc(this.position.acc).latlng(latlng).map(this.map)
    }
  },
  template: `
    .group => :ref='group'
      .header => *text='地圖'
      .items._clear
        .map
          .el => :ref='el'
          .zoom
            label.add => @click=zoom(+1)
            i
            label.sub => @click=zoom(-1)
  `
})



const MapMyLocation = function(latlng, acc = null, map = null) {
  if (!(this instanceof MapMyLocation)) {
    return new MapMyLocation(latlng, acc, map)
  }
  this._map = null
  this._acc = null
  this._timer = null

  this._$icon = $('<div />')
  this._marker = L.marker(latlng, { icon: L.divIcon({
    className: 'marker-my-location',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    html: this._$icon.get(0),
    zIndexOffset: 999
  }) })

  this.acc(acc).map(map)
}
MapMyLocation.prototype.map = function(map) {
  if (map) {
    if (this._map !== map) {
      this._map = map
      this._marker.addTo(map)
    }
  } else if (this._map) {
    this._map.removeLayer(this._marker)
    this._map = null
  } else {
    this._map = null
  }
  return this.acc()
}
MapMyLocation.prototype.latlng = function(latlng) {
  if (this._marker) {
    this._marker.setLatLng(latlng)
  }
  return this
}
MapMyLocation.prototype.acc = function(val = undefined) {
  if (val === null || (typeof val == 'number' && !isNaN(val) && val !== Infinity)) {
    this._acc = val
  }

  clearTimeout(this._timer)
  this._timer = setTimeout(_ => {
    if (this._acc === null) {
      return this._$icon.removeAttr('style')
    }

    if (!this._map) {
      return this._$icon.removeAttr('style')
    }

    const mapHeightInMetres = this._map.getBounds().getSouthEast().distanceTo(this._map.getBounds().getNorthEast()) // 高度多少公尺
    const mapHeightInPixels = this._map.getSize().y // 高度多少 px
    this._$icon.attr('style', `--width: ${this._acc * (mapHeightInPixels / mapHeightInMetres)}px;`)
  }, 100)
  return this
}