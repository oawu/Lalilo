/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Location = function(data) {
  if (!(this instanceof Location)) {
    return new Location(data)
  }

  const _isNum = v => typeof v == 'number' && !isNaN(v) && v !== Infinity
  const _round = (val, digital, d4 = '') => _isNum(val) ? parseFloat(val.toFixed(digital)) : d4
  const _timeago = e => {
    const d = (new Date().getTime() - e * 1000) / 1000

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

  this.position = null
  this.altitude = null
  this.speed = null
  this.course = null

  this.time = {
    gps: null,
    upload: null,
    server: null,
  }

  this.status = 'none'

  if (_isNum(data.accH) && data.accH > 0) {
    this.position = {
      acc: _round(data.accH, 1),
      lat: _round(data.lat, 10),
      lng: _round(data.lng, 10),
    }
  }
  if (_isNum(data.accV) && data.accV > 0) {
    this.altitude = {
      acc: _round(data.accV, 1),
      val: _round(data.alt, 2),
    }
  }

  if (_isNum(data.accS) && data.accS >= 0 && _isNum(data.speed) && data.speed >= 0) {
    this.speed = {
      acc: _round(data.accS, 1),
      ms: _round(data.speed, 2),
      kmh: _round(_round(data.speed, 2) * 3.6, 2),
    }
  }

  if (_isNum(data.accC) && data.accC >= 0 && _isNum(data.course) && data.course >= 0) {
    this.course = {
      acc: _round(data.accC, 1),
      val: _round(data.course, 1) }
  }

  if (_isNum(data.time) && data.time >= 0) {
    const val = Math.round(data.time * 1000)
    const text = Helper.date('Y/m/d H:i:s', new Date(val))
    const timeago = `(${_timeago(val)})`

    this.time.gps = { val, text, timeago }
  }
}


Load.Vue({
  data: {
    status: 'always',

    count: {
      gps: null,
      done: null,
      fail: null,
    },

    time: {
      gps: null,
      upload: null,
      server: null,
    },

    queueSave: Queue(),
    queueCount: Queue(),
    queueUpload: Queue(),
    location: null,

    isRunning: false
  },
  mounted () {

    App.Bridge.on('GPS::isRunning', isRunning => {
      this.isRunning = isRunning
    })

    App.Bridge.on('GPS::status', status => {
      this.status = status
    })

    App.Bridge.on('GPS::location', this._refresh)


    // DB._clear(_ => {
      App.Bridge.emits([
        App.GPS.Refresh.Status(),
        App.GPS.Refresh.isRunning(),
      ], App.VC.Mounted())

      this._count()
      this._upload()
      // setInterval(_ => this._count(), 1000)
      // setInterval(_ => this._upload(), 1000)
    // })
  },
  methods: {
    _refresh (locations) {
      if (!locations.length) {
        return
      }

      for (let location of locations) {
        const _location = Location(location)
        this.location = _location
        this.queueSave.enqueue(next => DB.Location.create(_location, _ => {
          this._count()
          this._upload()
          next()
        }))
      }
    },
    _count (next) {
      this.queueCount.enqueue(next => {
        Promise.all([
          DB.Location.index('Status', 'none').count(),
          DB.Location.index('Status', 'done').count(),
          DB.Location.index('Status', 'fail').count(),
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
      this.queueUpload.enqueue(next => DB.Location.index('Status', 'none').first((error, location) => {
        if (error) {
          return console.error(error)
        }

        if (!(typeof location == 'object' && location !== null && !Array.isArray(location))) {
          return next()
        }

        const timer = Math.random() * 5
        console.error(timer);
        

        setTimeout(_ => { // upload
          const done = Math.random() < 0.5

          location.status = done ? 'done' : 'fail'

          DB.Location.update(location.key, location, (error, location) => {
            if (error) {
              return 
            }

            this._count()
            next()
          })
        }, timer)

      }))
    },

    start () {
      App.Alert(null, '你確定要啟動？')
        .button('取消')
        .button('確定', App.HUD.Show.Loading('開啟中，請稍後…').completion(
          _ => setTimeout(
            _ => App.GPS.Start(result => result && App.HUD.Show.Done('已開啟').completion(App.HUD.Hide(400)).emit()).emit(), 500))).emit()
    },
    stop () {
      App.Alert(null, '你確定要停止？')
        .button('取消')
        .button('確定', App.HUD.Show.Loading('關閉中，請稍後…').completion(
          _ => setTimeout(
            _ => App.GPS.Stop(result => result && App.HUD.Show.Done('已關閉').completion(App.HUD.Hide(400)).emit()).emit(), 500))).emit()
    },
    determine () {
      App.GPS.Require.Always().emit()
    },
  },
  computed: {
    lat () {
      return this.location && this.location.position ? this.location.position.lat : ''
    },
    lng () {
      return this.location && this.location.position ? this.location.position.lng : ''
    },
    accH () {
      return this.location && this.location.position ? this.location.position.acc : ''
    },
    speed1 () {
      return this.location && this.location.speed ? this.location.speed.kmh : ''
    },
    speed () {
      return this.location && this.location.speed ? this.location.speed.ms : ''
    },
    accS () {
      return this.location && this.location.speed ? this.location.speed.acc : ''
    },
    alt () {
      return this.location && this.location.altitude ? this.location.altitude.val : ''
    },
    accV () {
      return this.location && this.location.altitude ? this.location.altitude.acc : ''
    },
  },
  template: `
    main#app
      template => *if=status!==null

        #status => *if=status !== 'always'   :class=status
          label.content => *if=status=='notDetermined'   @click=determine
            i
            .info
              b => *text='請同意定位'
              span => *text='請點擊這裡，並且同意「APP」讀取您的裝置定位。'

          label.content => *if=status=='other'
            i
            .info
              b => *text='無法取得定位狀態'
              span => *text='請檢查手機是否有有開啟定位功能。'
              a => *text='可至「設定 > 隱私權 > 定位服務 > APP」勾選「永遠」。'

          label.content => *if=status=='restricted'
            i
            .info
              b => *text='定位受限制'
              span => *text='無法更改此應用程序的狀態，這可能是由於存在家長控制等活動限制。'


          label.content => *if=status=='denied'
            i
            .info
              b => *text='無法定位'
              span => *text='系統未開啟定位功能，或您拒絕了「APP」取用您的裝置定位！'
              a => *text='請至「設定 > 隱私權 > 定位服務」確認是否開啟定位服務；或至「設定 > 隱私權 > 定位服務 > APP」勾選「永遠」。'


          label.content => *if=status=='inUse'
            i
            .info
              b => *text='無法背景定位'
              span => *text='您尚未同意使用背景定位！'
              a => *text='請至「設定 > 隱私權 > 定位服務 > APP」勾選「永遠」。'

        #info => *else
          .cell.ctrl => *if=isRunning
            b => *text='GPS 正在紀錄'
            span => *text='目前 GPS 紀錄正常作業中！'
            label => *text='停止紀錄'   @click=stop
          
          .cell.ctrl => *else
            b => *text='GPS 尚未開始'
            span => *text='目前未開啟 GPS 紀錄，請點擊下方「開始記錄」即可開始記錄，即便在背景模式依然可以做紀錄。'
            label => *text='開始紀錄'   @click=start

          span.header => *text='座標資料'

          .cell.lat-lng-accH
            .lat-lng
              .lat
                span.title => *text='緯度'
                span.value => *text=lat
              .lng
                span.title => *text='經度'
                span.value => *text=lng
            .accH
              span.title => *text='誤差範圍'
              span.value => *text=accH
              span.unit => *text='公尺'
          
          span.header => *text='移動速度'
          .cell.speeds
            .speed
              span.title => *text='時速'
              span.value => *text=speed1
              span.unit => *text='公里/小時'

            .speed
              span.title => *text='秒速'
              span.value => *text=speed
              span.unit => *text='公尺/秒'

            .speed
              span.title => *text='誤差值'
              span.value => *text=accS
              span.unit => *text='公尺/秒'
          
          span.header => *text='海拔高度'
          .cell.alts
            .alt
              span.title => *text='高度'
              span.value => *text=alt   :after='公尺'
            .alt
              span.title => *text='誤差值'
              span.value => *text=accV   :after='公尺'

          span.header => *text='數據'
          .cell.counts
            .count
              span.title => *text='未上傳'
              span.value => *text=count.gps === null ? '?' : count.gps
              span.unit => *text='次'

            .count
              span.title => *text='上傳成功'
              span.value.done => *text=count.done
              span.unit => *text='次'

            .count
              span.title => *text='上傳失敗'
              span.value.fail => *text=count.fail
              span.unit => *text='次'
          
          span.header => *text='時間'

          .cell.logs
            .log
              .title => *text='GPS 擷取時間'
              .value => *if=location && location.time && location.time.gps   *text=location.time.gps.text   :after=location.time.gps.timeago
              .value => *else   *text=''   :after=''

            .log
              .title => *text='最新上傳時間'
              .value => *if=1   *text=''   :after=''
              .value => *else   *text=time.upload.text   :after=time.upload.timeago

            .log
              .title => *text='伺服器回應時間'
              .value => *if=1   *text=''   :after=''
              .value => *else   *text=time.server.text   :after=time.server.timeago
          

      `
})
