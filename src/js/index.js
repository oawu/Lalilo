/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

window.x = 0

Load.Vue({
  data: {
    map: null,
    p0: '',
    p1: '',
    p2: '',
    p3: '',
    cy: null,
    cys: [],
    x: 0,
    tt: '',
    tts: {},
    ts: [],
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

      $.get('/b.json', a => {
        let tps = []
        let lat = null
        let lng = null

        for (let b of a) {
          if (lat === b[1] && lng === b[2]) {

          } else {
            if (b[1] > 30 && b[3] < 50) {
              tps.push({ lat: b[1], lng: b[2] })
              lat = b[1]
              lng = b[2]
            }
          }
        }

        let ps = []
        let c = 0
        lat = null
        lng = null
        for (let p of tps) {

          if (lat === null || lng === null) {
              ps.push(p)
              lat = p.lat
              lng = p.lng
              c = 0
          } else if (lat !== null && lng !== null) {
            let len = this.len(lat, lng, p.lat, p.lng)
            if (len > 10) {
              ps.push(p)
              lat = p.lat
              lng = p.lng
              c = 0
            } else {
              c = c + 1
              if (c > 10) {
                ps.push(p)
                lat = p.lat
                lng = p.lng
                c = 0
              }
            }
          }
        }

        L.polyline.antPath(ps, {
            weight: 4,
            delay: 2000,
            dashArray: [6, 12],
            pulseColor: 'red',
            color: 'rgba(252, 108, 181, 1.00)',
            paused: false,
            // reverse: true,
            hardwareAccelerated: true
        }).addTo(this.map)


        setInterval(_ => {
          if (window.x != this.x) {
            this.po(window.x)
            this.x = window.x
          }
        }, 100)

        this.po(0)

      })


    }, 750)

  },
  computed: {
  },
  methods: {
    clp() {
      if (this.cy !== null) {
        this.map.removeLayer(this.cy)
        this.cy = null
      }
      if (this.cys.length) {
        for (let c of this.cys) {
          this.map.removeLayer(c)
        }
        this.cys = []
      }
      this.ts = []
      this.tts = {}
      this.tt = ''
      this.p0 = ''
      this.p1 = ''
      this.p2 = ''
      this.p3 = ''

    },
    po(x) {
      i = 0

      if (x == i++) {
        this.clp()
        this.tts = {'--bottom': '32px', '--right': '52px'}

        this.map.flyToBounds(L.latLngBounds([
          [50.359480346298696, 8.041992187500002],
          [46.4605655457854, 18.533935546875004]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '❤️ 奧捷 12 天蜜月之旅'
          this.ts = ['旅行社：華友旅行社', '目的地：歐洲奧捷', '行程長度：12 天']
          this.p1 = '/img/IMG_5038.JPG'
          this.p2 = '/img/IMG_5071.JPG'
        }, 1000)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '32px', '--right': '52px'}
        this.cy = L.circle([50.1051665428782, 14.26780700683594], 1500).addTo(this.map);

        this.map.flyToBounds(L.latLngBounds([
          [50.1297126065294, 14.149875640869142],
          [50.07190472514058, 14.313125610351564]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/18 🛩️ 抵達布拉格'
          this.ts = ['瓦茨拉夫·哈維爾機場']
          this.p1 = '/img/IMG_5088.JPG'
          this.p2 = '/img/IMG_5103.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--top': '64px', '--right': '40px'}
        this.cy = L.circle([50.226123744371364, 12.886962890625002], 6000).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [50.99992885585966, 10.393066406250002],
          [49.127813961593255, 15.633544921875002]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/18 ♨️ 卡羅維瓦利'

          this.p1 = '/img/IMG_5123.JPG'
          this.p2 = '/img/IMG_5319.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--top': '44px', '--right': '40px'}
        this.map.flyToBounds(L.latLngBounds([
          [50.22768868175128, 12.857823371887209],
          [50.21297075034992, 12.898893356323244]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/18 ♨️ 卡羅維瓦利'
          this.ts = ['溫泉小鎮', '驚艷好吃的午餐', '可以喝的溫泉水']

          this.p1 = '/img/IMG_5185.JPG'
          this.p2 = '/img/IMG_5326.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '16px', '--right': '24px'}
        this.cy = L.circle([50.084683518129665, 14.405479431152346], 100).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [50.09558686320052, 14.357414245605469],
          [50.06600990995991, 14.43955421447754],
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/18 😴 布拉格'
          this.ts = ['文華東方酒店', '驚喜連連的房間']
          this.p1 = '/img/IMG_5433.JPG'
          this.p2 = '/img/IMG_5493.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '64px', '--right': '40px'}
        this.cy = L.circle([50.090761888323954, 14.400640726089478], 300).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [50.097458905220584, 14.360074996948242],
          [50.0677178281599, 14.44255828857422]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/19 ⛪️ 布拉格'
          this.ts = ['聖維特主教堂', '布拉格城堡', '舊皇宮', '聖喬治大殿']
          this.p1 = '/img/IMG_5655.JPG'
          this.p2 = '/img/IMG_5703.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '64px', '--right': '40px'}
        this.cy = L.circle([50.09196645679979, 14.404073953628542], 70).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [50.09337748421954, 14.396488666534426],
          [50.08969495953111, 14.406756162643434]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/19 🏘️ 黃金小巷'
          this.p1 = '/img/IMG_5814.JPG'
          this.p2 = '/img/IMG_5842.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '64px', '--right': '40px'}
        this.cy = L.circle([50.09083760494851, 14.409502744674684], 50).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [50.09357708962188, 14.396038055419924],
          [50.08629439572572, 14.416422843933107]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/19 🚂 古董電車'
          this.p1 = '/img/IMG_5928.JPG'
          this.p2 = '/img/IMG_5973.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '44px', '--right': '40px'}
        this.cy = L.circle([49.96358913672145, 15.281982421875002], 5000).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [50.51517303835635, 13.125915527343752],
          [49.56975910961884, 15.740661621093752],
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/20 💰 庫特納・荷拉'
          this.ts = ['銀礦小鎮']
          this.p0 = '/img/IMG_6233.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '44px', '--right': '40px'}
        this.cy = L.circle([49.948403256390435, 15.268890559673311], 80).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [49.957460139622846, 15.239367485046388],
          [49.942631366092115, 15.280480384826662],
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/20 💰 庫特納・荷拉'
          this.ts = ['製作銀幣']
          this.p1 = '/img/IMG_6277.JPG'
          this.p2 = '/img/IMG_6288.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '44px', '--right': '40px'}
        this.cy = L.circle([50.086555986123074, 14.411230087280275], 150).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [50.10164320525455, 14.362735748291016],
          [50.07190472514058, 14.444875717163088],
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/21 🌅 清晨的查理大橋'
          this.ts = ['特別早上五點半起床', '沒人的查理大橋', '獨享美景']
          this.p1 = '/img/IMG_6169.JPG'
          this.p2 = '/img/IMG_6461.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '24px', '--right': '256px'}
        this.cy = L.circle([48.81048112472012, 14.326171875000002], 5000).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [50.34896578114507, 10.217285156250002],
          [48.42920055556841, 15.474243164062502],
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/21 🏡 克倫諾夫'
          this.ts = ['童話小鎮']
          this.p1 = '/img/IMG_6888.JPG'
          this.p2 = '/img/IMG_6669.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '24px', '--right': '32px'}
        // this.cy = L.circle([48.81048112472012, 14.326171875000002], 5000).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [48.81552563394119, 14.301195144653322],
          [48.807965745620955, 14.321730136871338],
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/21 🏡 克倫諾夫'
          this.p1 = '/img/IMG_6779.JPG'
          this.p2 = '/img/IMG_6781.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '24px', '--right': '32px'}
        this.cy = L.circle([47.557993859037765, 13.650512695312502], 8000).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [49.03786794532644, 10.371093750000002],
          [47.07760411715964, 15.595092773437502],
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/22 🏞️ 哈斯塔特'
          this.ts = ['夢幻小鎮']
          this.p1 = '/img/IMG_6915.JPG'
          this.p2 = '/img/IMG_6994.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '24px', '--right': '32px'}
        this.cy = L.circle([47.56149804045244, 13.64879608154297], 300).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [47.56562456513413, 13.635513782501222],
          [47.55784905311034, 13.65602731704712],
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/22 🦢 哈斯塔特'
          this.ts = ['美麗的湖面', '漂亮的天鵝', '晴朗的天氣']
          this.p1 = '/img/IMG_7117.JPG'
          this.p2 = '/img/IMG_7241.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '24px', '--right': '32px'}
        this.cy = L.circle([47.54687159892238, 12.974853515625002], 5000).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [48.167917284047974, 11.271972656250002],
          [47.172911278266604, 13.897705078125002]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/23 ⛵️ 國王湖遊船'
          this.p0 = '/img/IMG_7476.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '24px', '--right': '32px'}
        // this.cy = L.circle([47.54687159892238, 12.974853515625002], 5000).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [47.64295479273205, 12.778816223144533],
          [47.518591896336154, 13.106002807617188]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/23 ❄️ 下雪了！'
          this.p1 = '/img/IMG_7514.JPG'
          this.p2 = '/img/IMG_7519.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '24px', '--right': '32px'}
        this.cy = L.circle([47.637721069054486, 13.017768859863283], 200).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [47.6448630919133, 12.988414764404299],
          [47.62939229528003, 13.029313087463379]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/23 🪨 鹽洞探險'
          this.ts = ['探險小車車', '超長溜滑梯', '德國豬腳吃飽飽']
          this.p1 = '/img/IMG_7508.JPG'
          this.p2 = '/img/img20240303_21410317.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '24px', '--right': '32px'}
        this.cy = L.circle([47.8094654494779, 13.049011230468752], 4000).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [48.372672242291294, 11.153869628906252],
          [47.39277144427804, 13.768615722656252]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/24 🏰 薩爾茲堡'
          this.p0 = '/img/IMG_7784.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '24px', '--right': '32px'}
        // this.cy = L.circle([47.637721069054486, 13.017768859863283], 200).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [47.811137090907344, 13.017897605895998],
          [47.79571559885682, 13.058967590332033]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/24 🏰 薩爾茲堡'
          this.ts = ['米拉貝爾花園', '景觀餐廳', '體驗火車頭等艙']
          this.p1 = '/img/IMG_7666.JPG'
          this.p2 = '/img/IMG_7709.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '24px', '--right': '32px'}
        this.cy = L.circle([48.21003212234042, 16.391601562500004], 10000).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [50.89610395554359, 7.360839843750001],
          [47.040182144806664, 17.852783203125004]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/25 🎻 維也納'
          this.p1 = '/img/IMG_7906.JPG'
          this.p2 = '/img/IMG_8466.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '24px', '--right': '32px'}
        this.cy = L.circle([48.20762976105525, 16.366066932678226], 200).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [48.21294912382582, 16.339631080627445],
          [48.197561497690806, 16.380658149719242]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/25 👸🏼 Sisi 公主博物館'
          this.ts = ['貝維德雷美術館', '霍夫堡宮']
          this.p1 = '/img/IMG_7983.JPG'
          this.p2 = '/img/IMG_8031.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '24px', '--right': '32px'}
        // this.cy = L.circle([48.20762976105525, 16.366066932678226], 200).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [48.208670083124446, 16.390635967254642],
          [48.206753872137064, 16.395758986473087]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/25 🏡 百水公寓'
          this.p1 = '/img/IMG_7988.JPG'
          this.p2 = '/img/IMG_7995.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '24px', '--right': '32px'}
        this.cy = L.circle([48.181883103480104, 16.303710937500004], 1000).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [48.21803917939912, 16.219768524169925],
          [48.157268653400116, 16.38267517089844]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/26 🐻‍❄️ 美泉宮動物園'
          this.p1 = '/img/IMG_8190.JPG'
          this.p2 = '/img/IMG_8258.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--top': '24px', '--right': '32px'}
        // this.cy = L.circle([48.181883103480104, 16.303710937500004], 1000).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [48.18679026989766, 16.290643215179447],
          [48.179150337778474, 16.311135292053226]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/26 🐻‍❄️ 美泉宮動物園'
          this.ts = ['熊貓', '獅子', '花豹', '羊群', '北極熊', '企鵝', '海獅']
          this.p1 = '/img/IMG_8228.JPG'
          this.p2 = '/img/IMG_8314.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--bottom': '24px', '--right': '32px'}
        this.cy = L.circle([48.11889235864144, 16.56875610351563], 3000).addTo(this.map);
        this.map.flyToBounds(L.latLngBounds([
          [48.254855515290764, 16.037292480468754],
          [48.00830020485931, 16.690979003906254]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/27 ✈️ 維也納國際機場'
          this.p1 = '/img/IMG_8489.JPG'
          this.p2 = '/img/IMG_8508.JPG'
        }, 1500)
      }
      if (x == i++) {
        this.clp()

        this.tts = {'--top': '24px', '--right': '32px'}
        this.cys = [
          L.circle([50.2210716662488, 12.883701324462892], 10000).addTo(this.map),
          L.circle([50.08886893382967, 14.430541992187502], 10000).addTo(this.map),
          L.circle([49.94392941126894, 15.26481628417969], 10000).addTo(this.map),
          L.circle([48.81079200551009, 14.314627647399904], 10000).addTo(this.map),
          L.circle([47.56054237785565, 13.64879608154297], 10000).addTo(this.map),
          L.circle([47.55220130978137, 12.978630065917969], 6000).addTo(this.map),
          L.circle([47.637894571059135, 13.017725944519045], 6000).addTo(this.map),
          L.circle([47.80104878217839, 13.042144775390625], 10000).addTo(this.map),
          L.circle([48.209345744901185, 16.369800567626957], 6000).addTo(this.map),
          L.circle([48.1802806616774, 16.301994323730472], 6000).addTo(this.map),
        ]
        this.map.flyToBounds(L.latLngBounds([
          [50.8822431111397, 11.447753906250002],
          [47.025206001585396, 21.895751953125]
        ]), { padding: [0, 0], duration: 1, noMoveStart: true })

        setTimeout(_ => {
          this.tt = '2/18 ~ 2/27 🎉 歐洲奧捷旅遊 成功！'
          this.ts = [
            '♨️ 溫泉小鎮 - 卡羅維瓦利',
            '⛪️ 布拉格',
            '💰 銀礦小鎮 - 庫特納・荷拉',
            '🏡 童話小鎮 - 克倫諾夫',
            '🏞️ 夢幻小鎮 - 哈斯塔特',
            '⛵️ 國王湖遊船',
            '❄️ 鹽洞探險',
            '🏰 薩爾茲堡',
            '🎻 維也納',
            '🐻‍❄️ 美泉宮動物園',
          ]
        }, 1500)
      }
    },
    po1() {
      
    },
    len (lat1, lon1, lat2, lon2) {
      let aa = lat1 * Math.PI / 180
      let bb = lon1 * Math.PI / 180
      let cc = lat2 * Math.PI / 180
      let dd = lon2 * Math.PI / 180

      return (2 * Math.asin(Math.sqrt(Math.pow(Math.sin ((aa - cc) / 2), 2) + Math.cos(aa) * Math.cos(cc) * Math.pow(Math.sin((bb - dd) / 2), 2)))) * 6378137
    },
    
  },
  template: `
    main#app
      div#map => ref=map

      div#tt   => *if=tt   :style=tts
        b => *text=tt
        div => *for=(t, i) in ts   :key=i   *text='※ ' + t

      div#p0 => *if=p0   :style={backgroundImage:'url('+ p0 + ')'}
      div#p1 => *if=p1   :style={backgroundImage:'url('+ p1 + ')'}
      div#p2 => *if=p2   :style={backgroundImage:'url('+ p2 + ')'}
      div#p3 => *if=p3   :style={backgroundImage:'url('+ p3 + ')'}

      `
})
