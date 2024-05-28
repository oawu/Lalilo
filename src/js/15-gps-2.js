/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    status: null,

    model: {
      lat: '',
      lng: '',
      alt: '',
      accH: '',
      accV: '',
      accS: '',
      accC: '',
      speed: '',
      course: '',
    },

    isRunning: false
  },
  mounted () {
    App.Bridge.on('GPS::isRunning', isRunning => {
      this.isRunning = isRunning

    })
    App.Bridge.on('GPS::status', status => {
      this.status = status
    })

    App.Bridge.on('GPS::location', locations => {
      if (!locations.length) { return }

      this.model.lat = locations[0].lat
      this.model.lng = locations[0].lng
      this.model.accH = locations[0].accH

      this.model.alt = locations[0].alt
      this.model.accV = locations[0].accV

      this.model.speed = locations[0].speed
      this.model.accS = locations[0].accS
      this.model.course = locations[0].course
      this.model.accC = locations[0].accC
    })

    App.Bridge.emits([
      App.GPS.Refresh.Status(),
      App.GPS.Refresh.isRunning(),
    ], App.VC.Mounted())
  },
  methods: {
    start () {
      App.Alert(null, '你確定要啟動？')
        .button('取消')
        .button('確定', App.HUD.Show.Loading('開啟中，請稍後…').completion(
          _ => setTimeout(
            _ => App.GPS.Start(result => result && App.HUD.Show.Done('已開啟').completion(App.HUD.Hide(900)).emit()).emit(), 500))).emit()
    },
    stop () {
      App.Alert(null, '你確定要停止？')
        .button('取消')
        .button('確定', App.HUD.Show.Loading('關閉中，請稍後…').completion(
          _ => setTimeout(
            _ => App.GPS.Stop(result => result && App.HUD.Show.Done('已關閉').completion(App.HUD.Hide(900)).emit()).emit(), 500))).emit()
    },
    determine () {
      App.GPS.Require.Always().emit()
    },
    round (val, digital, d4 = '') {
      if (!(typeof val == 'number' && !isNaN(val) && val !== Infinity)) {
        return d4
      }

      return parseFloat(val.toFixed(digital))
    },
  },
  computed: {
    lat () {
      return this.round(this.model.lat, 10)
    },
    lng () {
      return this.round(this.model.lng, 10)
    },
    accH () {
      return this.round(this.model.accH, 1)
    },
    speed1 () {
      let speed = this.speed2
      return speed === '' ? '' : this.round(speed * 3.6, 2)
    },
    speed () {
      return this.round(this.model.speed, 2)
    },
    accS () {
      return this.round(this.model.accS, 1)
    },
    alt () {
      return this.round(this.model.alt, 2)
    },
    accV () {
      return this.round(this.model.accV, 1)
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
              span.value => *text=0
              span.unit => *text='次'

            .count
              span.title => *text='上傳成功'
              span.value.done => *text=0
              span.unit => *text='次'

            .count
              span.title => *text='上傳失敗'
              span.value.fail => *text=0
              span.unit => *text='次'
          
          span.header => *text='時間'

          .cell.logs
            .log
              .title => *text='GPS 擷取時間'
              .value => *text='2024/12/12 13:12:11'   :after='(現在)'

            .log
              .title => *text='最新上傳時間'
              .value => *text=''   :after=''

            .log
              .title => *text='伺服器回應時間'
              .value => *text='2024/12/12 13:12:11'   :after='(現在)'
          

      `
})
