/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    activeId: 0,
    albums: []
  },
  mounted () {
    Layout.shared.left.title('相簿管理')
    Layout.shared.left.data.page = 'albums'
    Layout.shared.header.left('返回', '__back', _ => Redirect('albums'))
    Layout.shared.header.title({ text: '相簿管理', href: BaseURL('albums') }, '編輯相簿')

    // Layout.shared.header.title('編輯相簿')
    // Alert.shared.loading().present(false)

    // $.get('/json/albums.json')
    //   .done(albums => Alert.shared.dismiss(_ => this.albums = albums))
    //   .fail(_ => Redirect('index', Flash.Toastr.failure('無法取得相簿列表。')))
  },
  methods: {
  },
  template: `
    layout
      template => slot=main
    `
})
