/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const RightPanel = function(root) {
  if (!(this instanceof RightPanel))
    return new RightPanel(root)
}

Load.Vue({
  data () {
    return {
      albums: [
        {
          image: 'https://www.ioa.tw/img/6320c44505f9ea43773560c530f18b8a.jpg',
          title: '2019年 北港迎媽祖',
          count: 52,
          user: 'OA Wu',
          active: false,
        },
        {
          image: 'https://www.ioa.tw/img/bd6a5dda0368de75e3986a3f33accccb.jpg',
          title: '2018年 北港朝天宮 贊境 士林葫蘆寺 建廟70週年遶境境 士林葫蘆寺 建廟70週年遶境',
          count: 30,
          user: 'OA Wu',
          active: false,
        },
        {
          image: 'https://www.ioa.tw/img/680263b6418d6f0db05832cb77922d80.jpg',
          title: '2018年 北港迎媽祖',
          count: 91,
          user: 'OA Wu',
          active: false,
        },
        {
          image: 'https://www.ioa.tw/img/4401db5b29b580b8923486ad46ef5fc8.jpg',
          title: '2018年 北港朝天宮 台北世貿年貨大展',
          count: 69,
          user: 'OA Wu',
          active: false,
        },
        {
          image: 'https://www.ioa.tw/img/cefc610d54cd2fe4021e1680c510a39d.jpg',
          title: '2017年 北港迎媽祖',
          count: 115,
          user: 'OA Wu',
          active: false,
        },
        {
          image: 'https://www.ioa.tw/img/41d5adb1d70acfd5975f72a1c27408c6.jpg',
          title: '2016年 圓滿十后 媽祖無限愛台灣',
          count: 55,
          user: 'OA Wu',
          active: false,
        }
      ]
    }
  },
  mounted () {
    Layout.shared.menu.title = '相簿管理'
    Layout.shared.menu.page = 'albums'
  },
  computed: {
  },
  methods: {
    numFormat (n, d = 3) {
      const w = []
      for (let i = 0, a = ('' + n).split('').reverse(); i < a.length; i++)
        !i || (i % d) ? w.push(a[i]) : w.push(',', a[i])
      return w.reverse().join('')
    },
    click (album) {
      this.albums.forEach(album => album.active = false)
      album.active = true
      
      RightPanel.shared.push(RightPanel.View('id', {
        data: 1
      }))

    }
  },
  template: `
    layout
      template => slot=main
        div#albums
          label.album => *for=(album, i) in albums   :key=i   @click=click(album)   :class={active: album.active}
            div.box
              figure => :style={backgroundImage: 'url(' + album.image + ')'}
              div.info
                b => *text=album.title
                span => *text=album.user
              i => *text=numFormat(album.count)
    `
  })
