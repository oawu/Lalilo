/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */


Load.Vue({
  data: {
    map: null,
    points: null,
    polyline: null,
    stop: null,
    mode: 'ant',
    accH: 20,
    distance: 25,
    stopSpeed: 50,
    
    drawTimer: null,
  },
  mounted () {

    setTimeout(_ => {
      
      this.map = L.map(this.$refs.map, {tap:true, zoomControl: false, attributionControl: false }).setView([23.5678056,120.3046447], 15);

      L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { minZoom: 1, maxZoom: 20, subdomains:['mt0','mt1','mt2','mt3'] }).addTo(this.map)

      // this.map.locate({setView: true, maxZoom: 16});

      this.map.on('movestart', _ => {
      }).on('zoomend', _ => {

      }).on('click', e => {
        console.error(`[${e.latlng.lat}, ${e.latlng.lng}]`);
      })

      $.get('/2024_02_22_08_34_09_1710348546.860371.json', data => {
        this.points = data.points
        this._draw(true)

        // console.error(data);
        
        // let tps = []
        // let lat = null
        // let lng = null


        // let ps = []
        // let c = 0
        // lat = null
        // lng = null
        // for (let p of tps) {

        //   if (lat === null || lng === null) {
        //       ps.push(p)
        //       lat = p.lat
        //       lng = p.lng
        //       c = 0
        //   } else if (lat !== null && lng !== null) {
        //     let len = this.len(lat, lng, p.lat, p.lng)
        //     if (len > 10) {
        //       ps.push(p)
        //       lat = p.lat
        //       lng = p.lng
        //       c = 0
        //     } else {
        //       c = c + 1
        //       if (c > 10) {
        //         ps.push(p)
        //         lat = p.lat
        //         lng = p.lng
        //         c = 0
        //       }
        //     }
        //   }
        // }

        // L.polyline.antPath(ps, {
        //     weight: 4,
        //     delay: 2000,
        //     dashArray: [6, 12],
        //     pulseColor: 'red',
        //     color: 'rgba(252, 108, 181, 1.00)',
        //     paused: false,
        //     // reverse: true,
        //     hardwareAccelerated: true
        // }).addTo(this.map)


        // this.map.flyToBounds(L.latLngBounds(ps), { padding: [0, 0], duration: 1, noMoveStart: true })

      })


    }, 750)

  },
  computed: {
  },
  methods: {
    _draw (flyToBounds) {
      const points = []
      let last = null
      
      const stops = []
      let stopPoints = []

      for (const point of this.points) {
        if (point.accH <= this.accH) {

          if (last === null || this._len(last.lat, last.lng, point.lat, point.lng) >= this.distance) {
            points.push([point.lat, point.lng])
            last = point

            if (point.speed !== null) {
              if (point.speed <= 3) {
                stopPoints.push(point)
              } else {
                if (stopPoints.length > 0) {
                  stops.push({
                    lat: stopPoints.map(({lat}) => lat).reduce((a, b) => a + b, 0) / stopPoints.length,
                    lng: stopPoints.map(({lng}) => lng).reduce((a, b) => a + b, 0) / stopPoints.length,
                    duration: stopPoints.length > 1 ? stopPoints[stopPoints.length - 1].time - stopPoints[0].time : 0,
                    points: stopPoints})
                  stopPoints = []
                }
              }
            }
          }
        }
      }

      if (stopPoints.length > 0) {
        stops.push({
          lat: stopPoints.map(({lat}) => lat).reduce((a, b) => a + b, 0) / stopPoints.length,
          lng: stopPoints.map(({lng}) => lng).reduce((a, b) => a + b, 0) / stopPoints.length,
          duration: stopPoints.length > 1 ? stopPoints[stopPoints.length - 1].time - stopPoints[0].time : 0,
          points: stopPoints})
      }
      
      
      if (this.polyline) {
        this.map.removeLayer(this.polyline)
      }
      
      if (this.stop) {
        this.map.removeLayer(this.stop)
      }

      this.polyline = L.polyline.antPath(points, {
            weight: 4,
            delay: 2000,
            dashArray: [6, 12],
            pulseColor: 'red',
            color: 'rgba(252, 108, 181, 1.00)',
            paused: false,
            // reverse: true,
            hardwareAccelerated: true
        }).addTo(this.map)

      this.stop = L.layerGroup(stops.filter(stop => stop.duration > 60 * 3).map(stop => L.marker([stop.lat, stop.lng], { icon: L.divIcon({
        className: 'marker-stop',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        html: `<b>!</b>`
      }) }))).addTo(this.map)
      
      if (flyToBounds === true) {
        if (points.length > 2) {
          this.map.flyToBounds(L.latLngBounds(points), { paddingTopLeft: [320, 0], duration: 1, noMoveStart: true })
        } else if (points.length == 1) {
          this.map.setView(points, 16)
        }
      }
    },
    _reflash () {
    },
    _len (lat1, lon1, lat2, lon2) {
      let aa = lat1 * Math.PI / 180
      let bb = lon1 * Math.PI / 180
      let cc = lat2 * Math.PI / 180
      let dd = lon2 * Math.PI / 180

      return (2 * Math.asin(Math.sqrt(Math.pow(Math.sin ((aa - cc) / 2), 2) + Math.cos(aa) * Math.cos(cc) * Math.pow(Math.sin((bb - dd) / 2), 2)))) * 6378137
    },
  },
  watch: {
    accH () {
      clearTimeout(this.drawTimer)
      this.drawTimer = setTimeout(_ => this._draw(false), 500)
    },
    distance () {
      clearTimeout(this.drawTimer)
      this.drawTimer = setTimeout(_ => this._draw(false), 500)
    },
  },
  template: `
    main#app
      #map => ref=map
      
      #loading => *if=points===null
        b => *text='載入中…'

      template => *else
        #ctrl
          .her => *text='模式'
          .mode
            label.ant => *text='動畫模式'   :class={_selected: mode=='ant'}   @click=mode='ant'
            i
            label.speed => *text='速度模式'   :class={_selected: mode=='speed'}   @click=mode='speed'

          .her => *text='容許精準度'
          .accH
            label.add => :disabled=accH<=5   @click=accH=accH<=5 ? 5 : (accH-5)
            .val
              .v1 => *text=accH
              .v2 => *text='公尺'
            label.del => :disabled=accH>=500   @click=accH=accH>=500 ? 500 : (accH+5)
          .ftr => *text='有些點座標會因環境因素準確度較低，可以藉由設定「容許精準度」來過濾掉較差的資料。'

          .her => *text='容許距離值'
          .distance
            label.add => :disabled=distance<=5   @click=distance=distance<=5 ? 5 : (distance-5)
            .val
              .v1 => *text=distance
              .v2 => *text='公尺'
            label.del => :disabled=distance>=500   @click=distance=distance>=100 ? 100 : (distance+5)
          .ftr => *text='每次採集的訊號會有跳動的情況，可以藉由「容許距離值」來濾掉相似的位置。'

          .her => *text='停留標準'
          .stopSpeed
            label.add => :disabled=stopSpeed<=5   @click=stopSpeed=stopSpeed<=5 ? 5 : (stopSpeed-5)
            .val
              .v1 => *text=stopSpeed
              .v2 => *text='公尺/秒'
            label.del => :disabled=stopSpeed>=500   @click=stopSpeed=stopSpeed>=100 ? 100 : (stopSpeed+5)
          .ftr => *text='每次採集的訊號會有跳動的情況，可以藉由「容許距離值」來濾掉相似的位置。'


      `
})
