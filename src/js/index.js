/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    // 公開、密碼、隱藏
    // oa: `${window.baseUrl}img/oa.jpg`,
    size: 2,
    albums: [
    //   { src: `${window.baseUrl}img/album/01.JPG`, title: '2024_11_10_姿萱表哥楊上逸婚禮！', subtitle: '530 個項目' },
    //   { src: `${window.baseUrl}img/album/02.JPG`, title: '2024_04_27_歲次甲辰年_農曆三月十九日_北港迓媽祖', subtitle: '680 個項目' },
    //   { src: `${window.baseUrl}img/album/03.JPG`, title: '大頭貼照', subtitle: '50 個項目' },
    //   { src: `${window.baseUrl}img/album/04.JPG`, title: '2024_11_10_姿萱表哥楊上逸婚禮！', subtitle: '530 個項目' },
    //   { src: `${window.baseUrl}img/album/05.JPG`, title: '2024_04_27_歲次甲辰年_農曆三月十九日_北港迓媽祖', subtitle: '530 個項目' },
    //   { src: `${window.baseUrl}img/album/06.JPG`, title: '大頭貼照', subtitle: '530 個項目' },
    //   { src: `${window.baseUrl}img/album/07.JPG`, title: '2024_04_27_歲次甲辰年_農曆三月十九日_北港迓媽祖', subtitle: '530 個項目' },
    //   { src: `${window.baseUrl}img/album/08.JPG`, title: '2024_11_10_姿萱表哥楊上逸婚禮！', subtitle: '530 個項目' },
    ],
  },
  mounted () {

    Api(`${window.baseUrl}json/index.json`)
      .done(({ title, baseURL, albums }) => {
        this.title = title
        
        // const srcURL = `${baseURL}${srcPath}/`
        // const thumbURL = `${baseURL}${thumbPath}/`

        this.albums = albums.map(({ id, cover, title }) => ({
          id,
          title,
          subtitle: '',
          cover: `${baseURL}${cover}`,
        }))

        // this.pictures = pics
        

      })
      .fail(e => {
        console.error(e);
      })
      .send()
  },
  computed: {
  },
  methods: {
    click (album) {
      window.location.assign(`${window.location.protocol}//${window.location.host}/album.html?id=${album.id}`)
      throw new Error('頁面重新導向中…')
    }
  },
  template: `
  main#app => :size=size
    #nav
      .left
        b.logo => *text='PicMate'
        span.title => *if=0
      .right => *if=0
        .user
          figure
            img => :src=oa
    #ctrl
      segmented-auto => :items=['大','中','小']   *model=size

    #albums
      label.album => *for=(album, i) in albums   :key=i   @click=click(album)
        figure
          img => :src=album.cover
        b => *text=album.title
        span => *text=album.subtitle
  `
})
