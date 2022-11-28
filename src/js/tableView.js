/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Nav.Component('test01', {
  props: {
    view: { type: Nav.View },
  },
  components: TableView,
  template: `
    TableView
      Section
        Cell => :title='Header'   :arrowUI=true   @click=view.push(Nav.View('test01-1').title('Header').loading(false))
        Cell => :title='Footer'   :arrowUI=true   @click=view.push(Nav.View('test01-2').title('Footer').loading(false))
        Cell => :title='Header、Footer'   :arrowUI=true   @click=view.push(Nav.View('test01-3').title('Header、Footer').loading(false))
  `
})
  Nav.Component('test01-1', {
    components: TableView,
    template: `
      TableView
        Section => :header='123'
          Cell => :title='預設 Header'
        
        Section
          div => slot=header   *text='123'
          Cell => :title='客制化 Header 區塊 1'
        
        Section
          div => slot=header
            span => *text='123'
            a => *text='456'   :href=''
          Cell => :title='客制化 Header 區塊 2'
        
        Section
          template => slot=header
            span => *text='123'
            a => *text='456'   :href=''
          Cell => :title='客制化 Header 區塊 3'
    `
  })
  Nav.Component('test01-2', {
    components: TableView,
    template: `
      TableView
        Section => :footer='123'
          Cell => :title='預設 Footer'
        
        Section
          div => slot=footer   *text='123'
          Cell => :title='客制化 Footer 區塊 1'

        Section
          div => slot=footer
            span => *text='123'
            a => *text='456'   :href=''
          Cell => :title='客制化 Footer 區塊 2'

        Section
          template => slot=footer
            span => *text='123'
            a => *text='456'   :href=''
          Cell => :title='客制化 Footer 區塊 3'
    `
  })
  Nav.Component('test01-3', {
    components: TableView,
    template: `
      TableView
        Section => :header='123'   :footer='456'
          Cell => :title='預設 Header、Footer'
        
        Section
          div => slot=header   *text='123'
          div => slot=footer   *text='456'
          Cell => :title='客制化 Header、Footer 區塊 1'

        Section
          div => slot=header
            span => *text='abc'
            a => *text='def'   :href=''
          div => slot=footer
            span => *text='abc'
            a => *text='def'   :href=''
          Cell => :title='客制化 Header、Footer 區塊 2'
        
        Section
          template => slot=header
            span => *text='abc'
            a => *text='def'   :href=''
          template => slot=footer
            span => *text='abc'
            a => *text='def'   :href=''
          Cell => :title='客制化 Header、Footer 區塊 3'
    `
  })
Nav.Component('test02-1', {
  props: {
    view: { type: Nav.View },
  },
  components: TableView,
  template: `
    TableView
      Section
        Cell => :arrowUI=true   :title='標題'
        Cell => :arrowUI=true   :title='標題'   :subtitle='副標題'
        Cell => :arrowUI=true   :title='標題'   :subtitle='副標題'   :value='值'
      Section
        Cell => :arrowUI=true   :title='點擊測試'   @click=alert('Hi')
  `
})
Nav.Component('test02-2', {
  props: {
    view: { type: Nav.View },
  },
  data: _ => ({
    val1: false,
    val2: false,
  }),
  components: TableView,
  template: `
    TableView
      Section
        Cell => :switchUI=true   :title='標題'
        Cell => :switchUI=true   :title='標題'   :subtitle='副標題'
        Cell => :switchUI=true   :title='標題'   :subtitle='副標題'   :value='值'
      Section
        Cell => :switchUI=val1   :title='開關'   @switchUI=val1=!val1
        Cell => :switchUI=val2   :title='讀取中'   @switchUI=setTimeout(_ => val2=false, 1000, val2=null)
  `
})
Nav.Component('test02-3', {
  props: {
    view: { type: Nav.View },
  },
  data: _ => ({
    val1: false,
  }),
  components: TableView,
  template: `
    TableView
      Section
        Cell => :radioUI=true   :title='標題'
        Cell => :radioUI=true   :title='標題'   :subtitle='副標題'
        Cell => :radioUI=true   :title='標題'   :subtitle='副標題'   :value='值'
      Section
        Cell => :radioUI=val1   :title='點擊測試'   @radioUI=val1=!val1
  `
})
Nav.Component('test02-4', {
  props: {
    view: { type: Nav.View },
  },
  data: _ => ({
    val1: false,
    val2: false,
  }),
  components: TableView,
  template: `
    TableView
      Section
        Cell => :arrowUI=true   :switchUI=true   :title='標題'
        Cell => :arrowUI=true   :switchUI=true   :title='標題'   :subtitle='副標題'
        Cell => :arrowUI=true   :switchUI=true   :title='標題'   :subtitle='副標題'   :value='值'
      Section
        Cell => :arrowUI=true   :switchUI=val1   :title='開關'   @click=alert('點擊反應！')   @switchUI=val1=!val1
        Cell => :arrowUI=true   :switchUI=val2   :title='讀取中'   @click=alert('點擊反應！')   @switchUI=setTimeout(_ => val2=false, 1000, val2=null)
  `
})
Nav.Component('test02-5', {
  props: {
    view: { type: Nav.View },
  },
  data: _ => ({
    val1: false,
  }),
  components: TableView,
  template: `
    TableView
      Section
        Cell => :arrowUI=true   :radioUI=true   :title='標題'
        Cell => :arrowUI=true   :radioUI=true   :title='標題'   :subtitle='副標題'
        Cell => :arrowUI=true   :radioUI=true   :title='標題'   :subtitle='副標題'   :value='值'
      Section
        Cell => :arrowUI=true   :radioUI=val1   :title='點擊測試'   @click=alert('點擊反應！')   @radioUI=val1=!val1
  `
})
Nav.Component('test02-6', {
  props: {
    view: { type: Nav.View },
  },
  data: _ => ({
    val1: false,
    val2: false,
    val3: false,
  }),
  components: TableView,
  template: `
    TableView
      Section
        Cell => :radioUI=true   :arrowUI=true   :switchUI=true   :title='標題'
        Cell => :radioUI=true   :arrowUI=true   :switchUI=true   :title='標題'   :subtitle='副標題'
        Cell => :radioUI=true   :arrowUI=true   :switchUI=true   :title='標題'   :subtitle='副標題'   :value='值'
      Section
        Cell => :radioUI=val3   :arrowUI=true   :switchUI=val1   :title='開關'   @radioUI=val3=!val3   @click=alert('點擊反應！')   @switchUI=val1=!val1
        Cell => :radioUI=val3   :arrowUI=true   :switchUI=val2   :title='讀取中'   @radioUI=val3=!val3   @click=alert('點擊反應！')   @switchUI=setTimeout(_ => val2=false, 1000, val2=null)
  `
})
Nav.Component('test02-7', {
  props: {
    view: { type: Nav.View },
  },
  data: _ => ({
  }),
  components: TableView,
  template: `
    TableView
      Section => :header='純圖片'
        Cell => :imageUI='/img/icon.png'   :title='標題'
        Cell => :imageUI='/img/icon.png'   :title='標題'   :subtitle='副標題'
        Cell => :imageUI='/img/icon.png'   :title='標題'   :subtitle='副標題'   :value='值'
      Section => :header='寬高'
        Cell => :imageUI='/img/icon.png'   :imageUIWidth=50   :imageUIHeight=50   :title='標題'
        Cell => :imageUI='/img/icon.png'   :imageUIWidth=50   :imageUIHeight=50   :title='標題'   :subtitle='副標題'
        Cell => :imageUI='/img/icon.png'   :imageUIWidth=50   :imageUIHeight=50   :title='標題'   :subtitle='副標題'   :value='值'
      Section => :header='圓角'
        Cell => :imageUI='/img/icon.png'   :imageUIRadius='50%'   :title='標題'
        Cell => :imageUI='/img/icon.png'   :imageUIRadius='50%'   :title='標題'   :subtitle='副標題'
        Cell => :imageUI='/img/icon.png'   :imageUIRadius='50%'   :title='標題'   :subtitle='副標題'   :value='值'
  `
})
Nav.Component('test02-8', {
  props: {
    view: { type: Nav.View },
  },
  data: _ => ({
  }),
  components: TableView,
  template: `
    TableView
      Section
        Cell => :arrowUI=true   :imageUI='/img/icon.png'   :title='標題'
        Cell => :arrowUI=true   :imageUI='/img/icon.png'   :title='標題'   :subtitle='副標題'
        Cell => :arrowUI=true   :imageUI='/img/icon.png'   :title='標題'   :subtitle='副標題'   :value='值'
      Section
        Cell => :arrowUI=true   :imageUI='/img/icon.png'   :title='點擊測試'   @click=alert('Hi')
  `
})
Nav.Component('test02-9', {
  props: {
    view: { type: Nav.View },
  },
  data: _ => ({
    val1: false,
    val2: false,
    val3: false
  }),
  components: TableView,
  template: `
    TableView
      Section
        Cell => :radioUI=true   :switchUI=true   :title='標題'
        Cell => :radioUI=true   :switchUI=true   :title='標題'   :subtitle='副標題'
        Cell => :radioUI=true   :switchUI=true   :title='標題'   :subtitle='副標題'   :value='值'
      Section
        Cell => :radioUI=val3   @radioUI=val3=!val3   :switchUI=val1   :title='開關'   @switchUI=val1=!val1
        Cell => :radioUI=val3   @radioUI=val3=!val3   :switchUI=val2   :title='讀取中'   @switchUI=setTimeout(_ => val2=false, 1000, val2=null)
  `
})
Nav.Component('test02-10', {
  props: {
    view: { type: Nav.View },
  },
  data: _ => ({
    val1: false,
    val2: false,
  }),
  components: TableView,
  template: `
    TableView
      Section
        Cell => :imageUI='/img/icon.png'   :switchUI=true   :title='標題'
        Cell => :imageUI='/img/icon.png'   :switchUI=true   :title='標題'   :subtitle='副標題'
        Cell => :imageUI='/img/icon.png'   :switchUI=true   :title='標題'   :subtitle='副標題'   :value='值'
      Section
        Cell => :imageUI='/img/icon.png'   :switchUI=val1   :title='開關'   @switchUI=val1=!val1
  `
})
Nav.Component('test02-11', {
  props: {
    view: { type: Nav.View },
  },
  data: _ => ({
    val1: false,
  }),
  components: TableView,
  template: `
    TableView
      Section
        Cell => :imageUI='/img/icon.png'   :radioUI=true   :title='標題'
        Cell => :imageUI='/img/icon.png'   :radioUI=true   :title='標題'   :subtitle='副標題'
        Cell => :imageUI='/img/icon.png'   :radioUI=true   :title='標題'   :subtitle='副標題'   :value='值'
      Section
        Cell => :imageUI='/img/icon.png'   :radioUI=val1   :title='點擊測試'   @radioUI=val1=!val1
  `
})
Nav.Component('test02-12', {
  props: {
    view: { type: Nav.View },
  },
  data: _ => ({
    val1: false,
    val2: false,
  }),
  components: TableView,
  template: `
    TableView
      Section
        Cell => :imageUI='/img/icon.png'   :arrowUI=true   :switchUI=true   :title='標題'
        Cell => :imageUI='/img/icon.png'   :arrowUI=true   :switchUI=true   :title='標題'   :subtitle='副標題'
        Cell => :imageUI='/img/icon.png'   :arrowUI=true   :switchUI=true   :title='標題'   :subtitle='副標題'   :value='值'
      Section
        Cell => :imageUI='/img/icon.png'   :arrowUI=true   :switchUI=val1   :title='開關'   @click=alert('點擊反應！')   @switchUI=val1=!val1
        Cell => :imageUI='/img/icon.png'   :arrowUI=true   :switchUI=val2   :title='讀取中'   @click=alert('點擊反應！')   @switchUI=setTimeout(_ => val2=false, 1000, val2=null)
  `
})
Nav.Component('test02-13', {
  props: {
    view: { type: Nav.View },
  },
  data: _ => ({
    val1: false,
  }),
  components: TableView,
  template: `
    TableView
      Section
        Cell => :imageUI='/img/icon.png'   :arrowUI=true   :radioUI=true   :title='標題'
        Cell => :imageUI='/img/icon.png'   :arrowUI=true   :radioUI=true   :title='標題'   :subtitle='副標題'
        Cell => :imageUI='/img/icon.png'   :arrowUI=true   :radioUI=true   :title='標題'   :subtitle='副標題'   :value='值'
      Section
        Cell => :imageUI='/img/icon.png'   :arrowUI=true   :radioUI=val1   :title='點擊測試'   @click=alert('點擊反應！')   @radioUI=val1=!val1
  `
})
Nav.Component('test02-14', {
  props: {
    view: { type: Nav.View },
  },
  data: _ => ({
    val1: false,
    val2: false,
    val3: false
  }),
  components: TableView,
  template: `
    TableView
      Section
        Cell => :imageUI='/img/icon.png'   :radioUI=true   :switchUI=true   :title='標題'
        Cell => :imageUI='/img/icon.png'   :radioUI=true   :switchUI=true   :title='標題'   :subtitle='副標題'
        Cell => :imageUI='/img/icon.png'   :radioUI=true   :switchUI=true   :title='標題'   :subtitle='副標題'   :value='值'
      Section
        Cell => :imageUI='/img/icon.png'   :radioUI=val3   @radioUI=val3=!val3   :switchUI=val1   :title='開關'   @switchUI=val1=!val1
        Cell => :imageUI='/img/icon.png'   :radioUI=val3   @radioUI=val3=!val3   :switchUI=val2   :title='讀取中'   @switchUI=setTimeout(_ => val2=false, 1000, val2=null)
  `
})
Nav.Component('test02-15', {
  props: {
    view: { type: Nav.View },
  },
  data: _ => ({
    val1: false,
    val2: false,
    val3: false,
  }),
  components: TableView,
  template: `
    TableView
      Section
        Cell => :imageUI='/img/icon.png'   :radioUI=true   :arrowUI=true   :switchUI=true   :title='標題'
        Cell => :imageUI='/img/icon.png'   :radioUI=true   :arrowUI=true   :switchUI=true   :title='標題'   :subtitle='副標題'
        Cell => :imageUI='/img/icon.png'   :radioUI=true   :arrowUI=true   :switchUI=true   :title='標題'   :subtitle='副標題'   :value='值'
      Section
        Cell => :imageUI='/img/icon.png'   :radioUI=val3   :arrowUI=true   :switchUI=val1   :title='開關'   @radioUI=val3=!val3   @click=alert('點擊反應！')   @switchUI=val1=!val1
        Cell => :imageUI='/img/icon.png'   :radioUI=val3   :arrowUI=true   :switchUI=val2   :title='讀取中'   @radioUI=val3=!val3   @click=alert('點擊反應！')   @switchUI=setTimeout(_ => val2=false, 1000, val2=null)
  `
})

Nav.Component('test02', {
  props: {
    view: { type: Nav.View },
  },
  components: TableView,
  methods: {
    test02_1 () { this.view.push(Nav.View('test02-1').title('箭頭 測試').loading(false)) },
    test02_2 () { this.view.push(Nav.View('test02-2').title('開關 測試').loading(false)) },
    test02_3 () { this.view.push(Nav.View('test02-3').title('按鈕 測試').loading(false)) },
    test02_4 () { this.view.push(Nav.View('test02-4').title('圖片 測試').loading(false)) },
    test02_5 () { this.view.push(Nav.View('test02-5').title('箭頭 + 開關 測試').loading(false)) },
    test02_6 () { this.view.push(Nav.View('test02-6').title('箭頭 + 按鈕 測試').loading(false)) },
    test02_7 () { this.view.push(Nav.View('test02-7').title('箭頭 + 圖片 測試').loading(false)) },
    test02_8 () { this.view.push(Nav.View('test02-8').title('開關 + 按鈕 測試').loading(false)) },
    test02_9 () { this.view.push(Nav.View('test02-9').title('開關 + 圖片 測試').loading(false)) },
    test02_10 () { this.view.push(Nav.View('test02-10').title('按鈕 + 圖片 測試').loading(false)) },
    test02_11 () { this.view.push(Nav.View('test02-11').title('箭頭 + 開關 + 按鈕 測試').loading(false)) },
    test02_12 () { this.view.push(Nav.View('test02-12').title('箭頭 + 開關 + 圖片 測試').loading(false)) },
    test02_13 () { this.view.push(Nav.View('test02-13').title('箭頭 + 按鈕 + 圖片 測試').loading(false)) },
    test02_14 () { this.view.push(Nav.View('test02-14').title('開關 + 按鈕 + 圖片 測試').loading(false)) },
    test02_15 () { this.view.push(Nav.View('test02-15').title('箭頭 + 開關 + 按鈕 + 圖片 測試').loading(false)) },
  },
  template: `
    TableView
      Section
        Cell => :title='箭頭 測試'   :arrowUI=true   @click=test02_1
        Cell => :title='開關 測試'   :arrowUI=true   @click=test02_2
        Cell => :title='按鈕 測試'   :arrowUI=true   @click=test02_3
        Cell => :title='圖片 測試'   :arrowUI=true   @click=test02_4
      Section
        Cell => :title='箭頭 + 開關 測試'   :arrowUI=true   @click=test02_5
        Cell => :title='箭頭 + 按鈕 測試'   :arrowUI=true   @click=test02_6
        Cell => :title='箭頭 + 圖片 測試'   :arrowUI=true   @click=test02_7
      Section
        Cell => :title='開關 + 按鈕 測試'   :arrowUI=true   @click=test02_8
        Cell => :title='開關 + 圖片 測試'   :arrowUI=true   @click=test02_9
      Section
        Cell => :title='按鈕 + 圖片 測試'   :arrowUI=true   @click=test02_10
      Section
        Cell => :title='箭頭 + 開關 + 按鈕 測試'   :arrowUI=true   @click=test02_11
        Cell => :title='箭頭 + 開關 + 圖片 測試'   :arrowUI=true   @click=test02_12
        Cell => :title='箭頭 + 按鈕 + 圖片 測試'   :arrowUI=true   @click=test02_13
        Cell => :title='開關 + 按鈕 + 圖片 測試'   :arrowUI=true   @click=test02_14
      Section
        Cell => :title='箭頭 + 開關 + 按鈕 + 圖片 測試'   :arrowUI=true   @click=test02_15
  `
})
Nav.Component('test03', {
  props: {
    view: { type: Nav.View },
  },
  components: TableView,
  methods: {
  },
  template: `
    TableView
      Section => :header='標題 位置'
        Cell => :title='標題 - 左（預設）'   :subtitle='副標題'   :value='值'   :titleAlign='left'
        Cell => :title='標題 - 中'   :subtitle='副標題'   :value='值'   :titleAlign='center'
        Cell => :title='標題 - 右'   :subtitle='副標題'   :value='值'   :titleAlign='right'
      Section => :header='副標題 位置'
        Cell => :title='標題'   :subtitle='副標題 - 左（預設）'   :value='值'   :subtitleAlign='left'
        Cell => :title='標題'   :subtitle='副標題 - 中'   :value='值'   :subtitleAlign='center'
        Cell => :title='標題'   :subtitle='副標題 - 右'   :value='值'   :subtitleAlign='right'
      Section => :header='值 位置'
        Cell => :title='標題'   :subtitle='副標題'   :value='值 - 左'   :valueAlign='left'
        Cell => :title='標題'   :subtitle='副標題'   :value='值 - 中'   :valueAlign='center'
        Cell => :title='標題'   :subtitle='副標題'   :value='值 - 右（預設）'   :valueAlign='right'
  `
})
Nav.Component('test04', {
  props: {
    view: { type: Nav.View },
  },
  components: TableView,
  template: `
    TableView
      Section => :header='標題'
        Cell => :title='標題 - 黑（預設）'   :titleColor='black'   :subtitle='副標題'   :value='值'
        Cell => :title='標題 - 灰'          :titleColor='gray'   :subtitle='副標題'   :value='值'
        Cell => :title='標題 - 紅'          :titleColor='red'   :subtitle='副標題'   :value='值'
        Cell => :title='標題 - 橘'          :titleColor='orange'   :subtitle='副標題'   :value='值'
        Cell => :title='標題 - 黃'          :titleColor='yellow'   :subtitle='副標題'   :value='值'
        Cell => :title='標題 - 綠'          :titleColor='green'   :subtitle='副標題'   :value='值'
        Cell => :title='標題 - 藍'          :titleColor='blue'   :subtitle='副標題'   :value='值'
        Cell => :title='標題 - 紫'          :titleColor='purple'   :subtitle='副標題'   :value='值'
        Cell => :title='標題 - 棕'          :titleColor='brown'   :subtitle='副標題'   :value='值'

      Section => :header='副標題'
        Cell => :title='標題'   :subtitleColor='black'   :subtitle='副標題 - 黑'   :value='值'
        Cell => :title='標題'   :subtitleColor='gray'   :subtitle='副標題 - 灰（預設）'   :value='值'
        Cell => :title='標題'   :subtitleColor='red'   :subtitle='副標題 - 紅'   :value='值'
        Cell => :title='標題'   :subtitleColor='orange'   :subtitle='副標題 - 橘'   :value='值'
        Cell => :title='標題'   :subtitleColor='yellow'   :subtitle='副標題 - 黃'   :value='值'
        Cell => :title='標題'   :subtitleColor='green'   :subtitle='副標題 - 綠'   :value='值'
        Cell => :title='標題'   :subtitleColor='blue'   :subtitle='副標題 - 藍'   :value='值'
        Cell => :title='標題'   :subtitleColor='purple'   :subtitle='副標題 - 紫'   :value='值'
        Cell => :title='標題'   :subtitleColor='brown'   :subtitle='副標題 - 棕'   :value='值'

      Section => :header='值'
        Cell => :title='標題'   :valueColor='black'   :subtitle='副標題'   :value='值 - 黑'
        Cell => :title='標題'   :valueColor='gray'   :subtitle='副標題'   :value='值 - 灰（預設）'
        Cell => :title='標題'   :valueColor='red'   :subtitle='副標題'   :value='值 - 紅'
        Cell => :title='標題'   :valueColor='orange'   :subtitle='副標題'   :value='值 - 橘'
        Cell => :title='標題'   :valueColor='yellow'   :subtitle='副標題'   :value='值 - 黃'
        Cell => :title='標題'   :valueColor='green'   :subtitle='副標題'   :value='值 - 綠'
        Cell => :title='標題'   :valueColor='blue'   :subtitle='副標題'   :value='值 - 藍'
        Cell => :title='標題'   :valueColor='purple'   :subtitle='副標題'   :value='值 - 紫'
        Cell => :title='標題'   :valueColor='brown'   :subtitle='副標題'   :value='值 - 棕'
  `
})
Nav.Component('test05', {
  props: {
    view: { type: Nav.View },
  },
  components: TableView,
  template: `
    TableView
      Section => :header='預設'
        CellEmpty
      Section => :header='客製化內容'
        CellEmpty => :title='目前沒有資料。'
  `
})
Nav.Component('test06', {
  props: {
    view: { type: Nav.View },
  },
  components: TableView,
  template: `
    TableView
      Section
        Cell => :title='標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題'
        Cell => :subtitle='副標題 副標題 副標題 副標題 副標題 副標題 副標題 副標題 副標題'
        Cell => :value='值值值值值值值值值值值值值值值值值值值值值值值值值值'
      Section
        Cell => :title='標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題'   :subtitle='副標題 副標題 副標題 副標題 副標題 副標題 副標題 副標題 副標題'
        Cell => :title='標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題'   :value='值值值值值值值值值值值值值值值值值值值值值值值值值值'
      Section
        Cell => :subtitle='副標題 副標題 副標題 副標題 副標題 副標題 副標題 副標題 副標題'   :value='值值值值值值值值值值值值值值值值值值值值值值值值值值'
      Section
        Cell => :title='標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題'   :subtitle='副標題 副標題 副標題 副標題 副標題 副標題 副標題 副標題 副標題'   :value='值值值值值值值值值值值值值值值值值值值值值值值值值值'
  `
})
Nav.Component('test07', {
  props: {
    view: { type: Nav.View },
  },
  components: TableView,
  template: `
    TableView
      Section
        Cell => :title='標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題'   :titleWrap=true
        Cell => :subtitle='副標題 副標題 副標題 副標題 副標題 副標題 副標題 副標題 副標題'   :subtitleWrap=true
        Cell => :value='值值值值值值值值值值值值值值值值值值值值值值值值值值'   :valueWrap=true
      Section
        Cell => :title='標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題'   :subtitle='副標題 副標題 副標題 副標題 副標題 副標題 副標題 副標題 副標題'   :titleWrap=true   :subtitleWrap=true
        Cell => :title='標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題'   :value='值值值值值值值值值值值值值值值值值值值值值值值值值值'   :titleWrap=true   :valueWrap=true
      Section
        Cell => :subtitle='副標題 副標題 副標題 副標題 副標題 副標題 副標題 副標題 副標題'   :value='值值值值值值值值值值值值值值值值值值值值值值值值值值'   :subtitleWrap=true   :valueWrap=true
      Section
        Cell => :title='標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題 標題'   :subtitle='副標題 副標題 副標題 副標題 副標題 副標題 副標題 副標題 副標題'   :value='值值值值值值值值值值值值值值值值值值值值值值值值值值'   :titleWrap=true   :subtitleWrap=true   :valueWrap=true
  `
})
Nav.Component('demo1', {
  props: {
    view: { type: Nav.View },
  },
  components: TableView,
  methods: {
    test01 () { this.view.push(Nav.View('test01').title('Header、Footer 測試').loading(false)) },
    test02 () { this.view.push(Nav.View('test02').title('箭頭、開關、按鈕、圖片 測試').loading(false)) },
    test03 () { this.view.push(Nav.View('test03').title('位置').loading(false)) },
    test04 () { this.view.push(Nav.View('test04').title('顏色').loading(false)) },
    test05 () { this.view.push(Nav.View('test05').title('空值').loading(false)) },
    test06 () { this.view.push(Nav.View('test06').title('多行文').loading(false)) },
    test07 () { this.view.push(Nav.View('test07').title('單行文').loading(false)) },
  },
  template: `
    TableView
      Section => :isGroup=false
        Cell => :title='Header、Footer 測試'   :arrowUI=true   @click=test01
        Cell => :title='箭頭、開關、按鈕、圖片 測試'   :arrowUI=true   @click=test02
        Cell => :title='位置'   :arrowUI=true   @click=test03
        Cell => :title='顏色'   :arrowUI=true   @click=test04
        Cell => :title='空值'   :arrowUI=true   @click=test05
        Cell => :title='多行文'   :arrowUI=true   @click=test06
        Cell => :title='單行文'   :arrowUI=true   @click=test07

    `
})

Load.Vue({
  data: {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    test1() {
      Nav.View('demo1').headerTitle('a').left('關閉', v => v.dismiss()).loading(false).presentTo(Nav.shared, v => {

      })
    }
  },
  template: `
    div
      label.btn => *text='點我'   @click=test1
  `
})