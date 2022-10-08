/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.VueComponent('album-info', {
  props: {
    nav: { type: Nav },
    album: { type: Object, default: null },
  },
  methods: {
    numFormat (n, d = 3) {
      const w = []
      for (let i = 0, a = ('' + n).split('').reverse(); i < a.length; i++)
        !i || (i % d) ? w.push(a[i]) : w.push(',', a[i])
      return w.reverse().join('')
    },
  },
  template: `
    div.album-info => *if=album
      div._tableview.__group
        div._item_kv
          div._key => *text='擁有者'
          div._val => *text=album.user
        div._item_kv
          div._key => *text='相簿數量'
          div._val => *text='共 ' + numFormat(album.pics.length) + ' 張'
        div._item_kv
          div._key => *text='建立日期'
          div._val => *text=album.date
      
      div._tableview.__group
        label._item_str.__link.__pointer.__center => *text='編輯相簿'   @click=Redirect('album', {id: album.id})

      div._tableview.__group.pics => :header='所有照片'
        a.pic => *for=(pic, i) in album.pics   :key=i   :style={backgroundImage:'url(' + pic + ')'}   target=_blank   :href=pic
  `
})

Load.Vue({
  data: {
    activeId: 0,
    albums: []
  },
  mounted () {
    Layout.shared.left.title('相簿管理')
    Layout.shared.left.data.page = 'albums'
    Layout.shared.header.title('相簿管理')

    Alert.shared.loading().present(false)

    $.get('/json/albums.json')
      .done(albums => Alert.shared.dismiss(_ => this.albums = albums))
      .fail(_ => Redirect('index', Flash.Toastr.failure('無法取得相簿列表。')))
  },
  methods: {
    numFormat (n, d = 3) {
      const w = []
      for (let i = 0, a = ('' + n).split('').reverse(); i < a.length; i++)
        !i || (i % d) ? w.push(a[i]) : w.push(',', a[i])
      return w.reverse().join('')
    },
    click (album) {
      Nav.shared.type('right').update(Nav.View('album-info').left('關閉', nav => nav.dismiss(_ => this.activeId = 0)), nav => $.get(`/json/album/${album.id}.json`).done(album => {
        this.activeId = album.id
        nav.title(album.title).props({ album }).loading(false)
      }).fail(_ => Nav.shared.dismiss(_ => {
        this.activeId = 0
        Toastr.failure(`無法讀取「${album.title}」內容。`)
      })))
    }
  },
  template: `
    layout
      template => slot=main
        div#albums
          label.album => *for=(album, i) in albums   :key=i   @click=click(album)   :class={active: activeId == album.id}
            div.box
              figure => :style={backgroundImage: 'url(' + album.image + ')'}
              div.info
                b => *text=album.title
                span => *text=album.user
              i => *text=numFormat(album.count)
    `
})


    
    // // Layout.shared.right.present(Layout.View('id')
    // //   .loading(false)
    // //   .title('1')
    // //   .right('a', (_, n) => {
    // //     n.push(Layout.View('id2')
    // //       .loading(false)
    // //       .title('2')
    // //       .right('b', (_, n) => {
    // //         n.push(Layout.View('id')
    // //           .loading(false)
    // //           .title('3')
    // //           .right('c', (_, n) => {
    // //             n.root()
    // //           }))
    // //       }))
    // //   }))

    // Layout.shared.header.left('as')
    // Layout.shared.header.right('as')
    // Layout.shared.header.title('as')

    // Nav.shared.type('right').present(Nav.View('id', {
    //   album: 1
    // }).title('a'), p => {
    //   setTimeout(_ => {
    //     p.loading(false)
    //     console.error(p.data);
    //   }, 100)
    // })


      // this.active = album
      // this.albums.forEach(album => album.active = false)
      
      
      // ====
      // Layout.shared.right.update(Layout.View('id', {
      //   album
      // }).title(album.title).left('關閉', (_, n) => {
      //   album.active = false
      //   n.dismiss()
      // }), (_, n) => {
      //   album.active = true
      //   setTimeout(_ => {
      //     n.loading(false)
      //   }, 100)
      // })
