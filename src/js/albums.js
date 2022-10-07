/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.VueComponent('id', {
  props: {
    nav: { type: Nav },
    view: { type: Nav.View },
    header: { type: Nav.View.Header },
  },
  template: '<div>123<br/>123<br/>123<br/>123<br/>123<br/>123<br/>123<br/>123<br/>123<br/>123<br/>123<br/>123<br/>123<br/>123<br/>123<br/>123<br/>123<br/>123<br/>123<br/>123<br/>123<br/></div>'
})
Load.VueComponent('id2', {
  props: {
    nav: { type: Nav },
    view: { type: Nav.View },
    header: { type: Nav.View.Header },
  },
  template: '<div>456<br/>456<br/>456<br/>456<br/>456<br/>456<br/>456<br/>456<br/>456<br/>456<br/>456<br/>456<br/>456<br/>456<br/>456<br/>456<br/>456<br/>456<br/>456<br/>456<br/>456<br/></div>'
})

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
    Layout.shared.left.title('相簿管理')
    Layout.shared.left.data.page = 'albums'
    
    // Layout.shared.right.present(Layout.View('id')
    //   .loading(false)
    //   .title('1')
    //   .right('a', (_, n) => {
    //     n.push(Layout.View('id2')
    //       .loading(false)
    //       .title('2')
    //       .right('b', (_, n) => {
    //         n.push(Layout.View('id')
    //           .loading(false)
    //           .title('3')
    //           .right('c', (_, n) => {
    //             n.root()
    //           }))
    //       }))
    //   }))

    Layout.shared.header.left('as')
    Layout.shared.header.right('as')
    Layout.shared.header.title('as')

    // Nav.shared.type('right').present(Nav.View('id', {
    //   album: 1
    // }).title('a'), p => {
    //   setTimeout(_ => {
    //     p.loading(false)
    //     console.error(p.data);
    //   }, 100)
    // })
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
      
      
      // ====
      Layout.shared.right.update(Layout.View('id', {
        album
      }).title(album.title).left('關閉', (_, n) => {
        album.active = false
        n.dismiss()
      }), (_, n) => {
        album.active = true
        setTimeout(_ => {
          n.loading(false)
        }, 100)
      })

      // Nav.shared.type('right').update(Nav.View('id', {
      //   album
      // }).left('關閉', p => {
      //   album.active = false
      //   p.dismiss()
      // }).title(album.title), p => {
      //   album.active = true

      //   setTimeout(_ => {
      //     p.loading(false)
      //     console.error(p.data);
      //   }, 100)
      // })
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
