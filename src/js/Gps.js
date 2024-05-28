/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    queue: Queue(),
    
    date: null,
    activity: null,
    point: null,
  },
  mounted () {
    App.Bridge.on('GPS::location', locations => this._location(locations).catch(_ => {}))

    App.VC.Nav.Bar.Title("GPS").emit()
    App.VC.Tab.Bar.Title("GPS").emit()
    App.VC.Mounted().emit()

    setTimeout(_ => (new ResizeObserver((entries) => entries[0].target == this.$el && this.$el.dispatchEvent(new CustomEvent('scroll')))).observe(this.$el))
  },
  methods: {
    async __createDate(DateModel) {
      const now   = new Date()
      const year  = now.getFullYear()
      const month = now.getMonth() + 1
      const day   = now.getDate()

      let date = App.isWeb
        ? await DateModel({ year, month, day })
        : await DateModel.where('year', year).where('month', month).where('day', day).one()

      if (date instanceof DateModel) {
        return date
      }

      date = App.isWeb
        ? await DateModel({ year, month, day })
        : await DateModel.create({ year, month, day })

      if (date instanceof DateModel) {
        return date
      }
      
      return null
    },
    async _create() {
      const DateModel = App.SqlLite.Model('Date')
      const ActivityModel = App.SqlLite.Model('Activity')
      
      if (!(this.date instanceof DateModel)) {
        this.date = await this.__createDate(DateModel)
      }

      if (!(this.date instanceof DateModel)) {
        this.date = null
        this.activity = null
        throw new Error('無法建立日期')
        return null
      }

      if (this.activity instanceof ActivityModel) {
        return this.activity
      }

      const now  = new Date()
      const hour = now.getHours()
      const min  = now.getMinutes()
      const sec  = now.getSeconds()

      this.activity = App.isWeb
        ? await ActivityModel({
          dateId: this.date.id,
          title: `${Helper.pad0(this.date.year, 4)}/${Helper.pad0(this.date.month, 2)}/${Helper.pad0(this.date.day, 2)} ${Helper.pad0(hour, 2)}:${Helper.pad0(min, 2)}:${Helper.pad0(sec, 2)}`,
          hour, min, sec, cntAccLevel0Points: 0, cntAccLevel1Points: 0, cntAccLevel2Points: 0, cntAccLevel3Points: 0, cntAccLevel4Points: 0, cntAccLevel5Points: 0, timeGps: null, timeUpload: null, timeServer: null })
        : await ActivityModel.create({
          dateId: this.date.id,
          title: `${Helper.pad0(this.date.year, 4)}/${Helper.pad0(this.date.month, 2)}/${Helper.pad0(this.date.day, 2)} ${Helper.pad0(hour, 2)}:${Helper.pad0(min, 2)}:${Helper.pad0(sec, 2)}`,
          hour, min, sec })

      if (this.activity instanceof ActivityModel) {
        return this.activity
      }

      this.date = null
      this.activity = null
      throw new Error('無法建立活動')
      return null
    },
    async _location (locations) {
      const DateModel = App.SqlLite.Model('Date')
      const ActivityModel = App.SqlLite.Model('Activity')
      const PointModel = App.SqlLite.Model('Point')
      
      if (!(this.date instanceof DateModel)) {
        throw new Error('尚未建立日期')
        return null
      }
      if (!(this.activity instanceof ActivityModel)) {
        throw new Error('尚未建立活動')
        return null
      }

      if (!locations.length) {
        return null
      }

      for (let location of locations) {
        const point = PointTool.postfromJson(this.date, this.activity, location, this.point)
        if (!point) {
          return
        }
        this.point = point

        this.queue.enqueue(next => {

          let promise = App.isWeb
            ? new Promise((resolve, reject) => resolve(PointModel(point)))
            : PointModel.create(point)
          
          promise.then(point => {

            this.activity.timeGps = point.time
            this.activity.cntAccLevel0Points += (point.accLevel >= 0 ? 1 : 0)
            this.activity.cntAccLevel1Points += (point.accLevel >= 1 ? 1 : 0)
            this.activity.cntAccLevel2Points += (point.accLevel >= 2 ? 1 : 0)
            this.activity.cntAccLevel3Points += (point.accLevel >= 3 ? 1 : 0)
            this.activity.cntAccLevel4Points += (point.accLevel >= 4 ? 1 : 0)
            this.activity.cntAccLevel5Points += (point.accLevel >= 5 ? 1 : 0)
            
            App.Action.Emit(`gps::refresh::${this.activity.id}`).each().emit()

            this.activity.save()
              .catch(_ => {})
              .finally(_ => next())
          })
          .catch(_ => {
            next()
          })
        })

      }
    
      return null
    },

    _startWab () {
      this._create()
        .then(_ => {
          App.Action.Emit('gps::start').each().emit()
          Toastr.success('已經啟動定位')
        })
        .catch(error => Toastr.failure(error.message))
    },
    start () {
      if (App.isWeb) {
        return this._startWab()
      }

      App.Alert(null, '你確定要啟動？')
        .button('取消')
        .button('確定', App.HUD.Show.Loading('開啟中，請稍後…').completion(_ => this._create()
          .then(_ => App.GPS.Start(result => {
            App.Action.Emit('gps::start').each().emit()

            result
              ? App.HUD.Show.Done('已開啟').completion(App.HUD.Hide(400)).emit()
              : App.HUD.Show.Done('無法開啟定位').completion(App.HUD.Hide(400)).emit()
          }).emit())
          .catch(error => App.HUD.Show.Fail(error.message).completion(App.HUD.Hide(400)).emit()))).emit()
    },
    stop () {
      App.Alert(null, '你確定要停止？')
        .button('取消')
        .button('確定', App.HUD.Show.Loading('關閉中，請稍後…').completion(App.GPS.Stop(result => this.queue.enqueue(next => {
          if (!result) {
            return App.HUD.Show.Done('無法關閉定位').completion(App.HUD.Hide(400).completion(next())).emit()
          }
          
          this.date = null
          this.activity = null
          this.point = null

          App.Action.Emit('gps::stop').each().emit()

          App.HUD.Show.Done('已關閉').completion(App.HUD.Hide(400).completion(next())).emit()
        })))).emit()
    },
    determine () {
      App.GPS.Require.Always().emit()
    },
    scroll (e) {
      setTimeout(_ => App.OnScroll(e.target.scrollTop, e.target.clientHeight, e.target.scrollHeight).emit())
    },
  },
  template: `
    main#app => @scroll=scroll
      .table-view-groups
        Ctrl     => :start=start   :stop=stop   :determine=determine

        Position => :location=point
        Speed    => :location=point
        Count    => :activity=activity
        Alt      => :location=point
        Timelog  => :activity=activity
        Map      => :location=point
      `
})

Load.VueComponent('Ctrl', {
  props: {
    start: { type: Function, required: true, default: null },
    stop: { type: Function, required: true, default: null },
    determine: { type: Function, required: true, default: null },
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
  },
  template: `
    .group
      .items._clear
        template => *if=App.isWeb
          .ctrl.bg
            b => *text='Web 直接開始'
            label => *text='開始紀錄'   @click=start

        template => *else
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
    lat () { return this.location ? Helper.round(this.location.lat, 10) : '' },
    lng () { return this.location ? Helper.round(this.location.lng, 10) : '' },
    accH () { return this.location ? Helper.round(this.location.accH, 1) : '' },
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
    speed1 () { return this.location ? Helper.round(this.location.speedKmh, 2) : '' },
    speed () { return this.location ? Helper.round(this.location.speedMs, 2) : '' },
    accS () { return this.location ? Helper.round(this.location.accS, 1) : '' },
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
Load.VueComponent('Count', {
  props: {
    activity: { type: Object, required: true, default: null }
  },
  data: _ => ({
  }),
  mounted () {
  },
  methods: {
  },
  computed: {
    level0 () { return this.activity ? Helper.numFormat(this.activity.cntAccLevel0Points) : '' },
    level4 () { return this.activity ? Helper.numFormat(this.activity.cntAccLevel4Points) : '' },
  },
  template: `
    .group
      .header => *text='數據'
      .items._clear
        .counts
          .unit.bg._center
            span => *text='全部次數'
            b => *text=level0
            i => *text='次'

          .unit.bg._center
            span => *text='有效次數'
            b.fail => *text=level4
            i => *text='次'
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
    alt () { return this.location ? Helper.round(this.location.alt, 2) : '' },
    accV () { return this.location ? Helper.round(this.location.accV, 1) : '' },
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
    timeGps () {
      return this.activity && this.activity.timeGps ? this.activity.timeGps : null
    },
    timeUpload () {
      return this.activity && this.activity.timeUpload ? this.activity.timeUpload : null
    },
    timeServer () {
      return this.activity && this.activity.timeServer ? this.activity.timeServer : null
    },
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
                span => *if=timeGps   *text=date(timeGps * 1000)   :after=timeago(timeGps * 1000)
                span => *else

        .item.log
          .content
            .info
              .key
                b => *text='最新上傳時間'
                span => *if=timeUpload   *text=date(timeUpload * 1000)   :after=timeago(timeUpload * 1000)
                span => *else

        .item.log
          .content
            .info
              .key
                b => *text='伺服器回應時間'
                span => *if=timeServer   *text=date(timeServer * 1000)   :after=timeago(timeServer * 1000)
                span => *else
  `
})
Load.VueComponent('Map', {
  props: {
    location: { type: Object, required: true, default: null }
  },
  data: _ => ({
    map: null,
    myLocation: null,
    observer: null,
    position: null,

  }),
  mounted () {
    this.observer = new IntersectionObserver(entries => {
      if (entries[0].target == this.$el && entries[0].isIntersecting === true) {
        this.observer.disconnect()
        setTimeout(this._initMap, 1)
      }
    })
    this.observer.observe(this.$el)
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
      
      this.myLocation = MapMyLocation(PointTool.d4)
      
      this.map.setView(PointTool.d4, PointTool.d4.zoom)
      this.myLocation.map(null)

      if (typeof this.location == 'object' && this.location !== null && !Array.isArray(this.location)) {
        this._lat(this.location.lat)
        this._lng(this.location.lng)
      }
    },
    zoom (level) {
      if (!this.map) { return this }
      this.map.setZoom(this.map.getZoom() + level)
      this.myLocation.acc()
    },
    _move() {
      if (!this.map || !this.myLocation) {
        return
      }

      if (this.position === null) {
        this.map.setView(PointTool.d4, PointTool.d4.zoom)
        return this.myLocation.map(null)
      }

      if (!(typeof this.position.lat == 'number' && !isNaN(this.position.lat) && this.position.lat !== Infinity && typeof this.position.lng == 'number' && !isNaN(this.position.lng) && this.position.lng !== Infinity)) {
        this.map.setView(PointTool.d4, PointTool.d4.zoom)
        return this.myLocation.map(null)
      }


      let latlng = [this.position.lat, this.position.lng]

      this.map.setView(latlng)
      this.myLocation.acc(this.position.acc).latlng(latlng).map(this.map)
    },
    _lat(val) {
      if (val === null) {
        return
      }
      if (this.position == null) {
        this.position = {}
      }
      this.position.lat = val
      this._move()
    },
    _lng(val) {
      if (val === null) {
        return
      }
      if (this.position == null) {
        this.position = {}
      }
      this.position.lng = val
      this._move()
    },
  },
  watch: {
    'location.lat' (val) {
      this._lat(val)
    },
    'location.lng' (val) {
      this._lng(val)
    }
  },
  template: `
    .group
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
