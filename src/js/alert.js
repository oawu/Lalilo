/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    alert1_1() {
      Alert('標題')
        .present(alert => setTimeout(_ => alert.dismiss(), 3000))
    },
    alert1_2() {
      Alert('標題')
        .button('關閉', alert => alert.dismiss())
        .present()
    },
    alert1_3() {
      Alert('標題')
        .button('關閉', alert => alert.dismiss())
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },
    alert1_4() {
      Alert('標題')
        .button('關閉', alert => alert.dismiss())
        .button('取消', alert => alert.dismiss(), true)
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },

    alert2_1() {
      Alert('', '敘述')
        .present(alert => setTimeout(_ => alert.dismiss(), 3000))
    },
    alert2_2() {
      Alert('', '敘述')
        .button('關閉', alert => alert.dismiss())
        .present()
    },
    alert2_3() {
      Alert('', '敘述')
        .button('關閉', alert => alert.dismiss())
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },
    alert2_4() {
      Alert('', '敘述')
        .button('關閉', alert => alert.dismiss())
        .button('取消', alert => alert.dismiss(), true)
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },

    alert3_1() {
      Alert()
        .input()
        .present(alert => setTimeout(_ => alert.dismiss(), 3000))
    },
    alert3_2() {
      Alert()
        .input('請輸入…', '')
        .button('關閉', alert => alert.dismiss())
        .present()
    },
    alert3_3() {
      Alert()
        .input('請輸入…', '預設值')
        .button('關閉', alert => alert.dismiss())
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },
    alert3_4() {
      Alert()
        .input('請輸入…')
        .input('請輸入…')
        .button('關閉', alert => alert.dismiss())
        .button('取消', alert => alert.dismiss(), true)
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },

    alert4_1() {
      Alert()
        .input()
        .input()
        .present(alert => setTimeout(_ => alert.dismiss(), 3000))
    },
    alert4_2() {
      Alert()
        .input('請輸入…', '')
        .input('請輸入…', '')
        .button('關閉', alert => alert.dismiss())
        .present()
    },
    alert4_3() {
      Alert()
        .input('請輸入…', '預設值')
        .input('請輸入…', '預設值')
        .button('關閉', alert => alert.dismiss())
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },
    alert4_4() {
      Alert()
        .input('請輸入…')
        .input('請輸入…')
        .button('關閉', alert => alert.dismiss())
        .button('取消', alert => alert.dismiss(), true)
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },

    alert5_1() {
      Alert()
        .input()
        .input()
        .input()
        .present(alert => setTimeout(_ => alert.dismiss(), 3000))
    },
    alert5_2() {
      Alert()
        .input('請輸入…', '')
        .input('請輸入…', '')
        .input('請輸入…', '')
        .button('關閉', alert => alert.dismiss())
        .present()
    },
    alert5_3() {
      Alert()
        .input('請輸入…', '預設值')
        .input('請輸入…', '預設值')
        .input('請輸入…', '預設值')
        .button('關閉', alert => alert.dismiss())
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },
    alert5_4() {
      Alert()
        .input('請輸入…')
        .input('請輸入…')
        .input('請輸入…')
        .button('關閉', alert => alert.dismiss())
        .button('取消', alert => alert.dismiss(), true)
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },

    alert6_1() {
      Alert('標題', '敘述')
        .present(alert => setTimeout(_ => alert.dismiss(), 3000))
    },
    alert6_2() {
      Alert('標題', '敘述')
        .button('關閉', alert => alert.dismiss())
        .present()
    },
    alert6_3() {
      Alert('標題', '敘述')
        .button('關閉', alert => alert.dismiss())
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },
    alert6_4() {
      Alert('標題', '敘述')
        .button('關閉', alert => alert.dismiss())
        .button('取消', alert => alert.dismiss(), true)
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },

    alert7_1() {
      Alert('標題')
        .input()
        .present(alert => setTimeout(_ => alert.dismiss(), 3000))
    },
    alert7_2() {
      Alert('標題')
        .input('請輸入…', '')
        .button('關閉', alert => alert.dismiss())
        .present()
    },
    alert7_3() {
      Alert('標題')
        .input('請輸入…', '預設值')
        .button('關閉', alert => alert.dismiss())
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },
    alert7_4() {
      Alert('標題')
        .input('請輸入…')
        .button('關閉', alert => alert.dismiss())
        .button('取消', alert => alert.dismiss(), true)
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },

    alert8_1() {
      Alert('標題')
        .input()
        .input()
        .present(alert => setTimeout(_ => alert.dismiss(), 3000))
    },
    alert8_2() {
      Alert('標題')
        .input('請輸入…', '')
        .input('請輸入…', '')
        .button('關閉', alert => alert.dismiss())
        .present()
    },
    alert8_3() {
      Alert('標題')
        .input('請輸入…', '預設值')
        .input('請輸入…', '預設值')
        .button('關閉', alert => alert.dismiss())
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },
    alert8_4() {
      Alert('標題')
        .input('請輸入…')
        .input('請輸入…')
        .button('關閉', alert => alert.dismiss())
        .button('取消', alert => alert.dismiss(), true)
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },

    alert9_1() {
      Alert('標題')
        .input()
        .input()
        .input()
        .present(alert => setTimeout(_ => alert.dismiss(), 3000))
    },
    alert9_2() {
      Alert('標題')
        .input('請輸入…', '')
        .input('請輸入…', '')
        .input('請輸入…', '')
        .button('關閉', alert => alert.dismiss())
        .present()
    },
    alert9_3() {
      Alert('標題')
        .input('請輸入…', '預設值')
        .input('請輸入…', '預設值')
        .input('請輸入…', '預設值')
        .button('關閉', alert => alert.dismiss())
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },
    alert9_4() {
      Alert('標題')
        .input('請輸入…')
        .input('請輸入…')
        .input('請輸入…')
        .button('關閉', alert => alert.dismiss())
        .button('取消', alert => alert.dismiss(), true)
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },

    alert10_1() {
      Alert('', '敘述')
        .input()
        .present(alert => setTimeout(_ => alert.dismiss(), 3000))
    },
    alert10_2() {
      Alert('', '敘述')
        .input('請輸入…', '')
        .button('關閉', alert => alert.dismiss())
        .present()
    },
    alert10_3() {
      Alert('', '敘述')
        .input('請輸入…', '預設值')
        .button('關閉', alert => alert.dismiss())
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },
    alert10_4() {
      Alert('', '敘述')
        .input('請輸入…')
        .button('關閉', alert => alert.dismiss())
        .button('取消', alert => alert.dismiss(), true)
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },

    alert11_1() {
      Alert('', '敘述')
        .input()
        .input()
        .present(alert => setTimeout(_ => alert.dismiss(), 3000))
    },
    alert11_2() {
      Alert('', '敘述')
        .input('請輸入…', '')
        .input('請輸入…', '')
        .button('關閉', alert => alert.dismiss())
        .present()
    },
    alert11_3() {
      Alert('', '敘述')
        .input('請輸入…', '預設值')
        .input('請輸入…', '預設值')
        .button('關閉', alert => alert.dismiss())
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },
    alert11_4() {
      Alert('', '敘述')
        .input('請輸入…')
        .input('請輸入…')
        .button('關閉', alert => alert.dismiss())
        .button('取消', alert => alert.dismiss(), true)
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },

    alert12_1() {
      Alert('', '敘述')
        .input()
        .input()
        .input()
        .present(alert => setTimeout(_ => alert.dismiss(), 3000))
    },
    alert12_2() {
      Alert('', '敘述')
        .input('請輸入…', '')
        .input('請輸入…', '')
        .input('請輸入…', '')
        .button('關閉', alert => alert.dismiss())
        .present()
    },
    alert12_3() {
      Alert('', '敘述')
        .input('請輸入…', '預設值')
        .input('請輸入…', '預設值')
        .input('請輸入…', '預設值')
        .button('關閉', alert => alert.dismiss())
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },
    alert12_4() {
      Alert('', '敘述')
        .input('請輸入…')
        .input('請輸入…')
        .input('請輸入…')
        .button('關閉', alert => alert.dismiss())
        .button('取消', alert => alert.dismiss(), true)
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },

    alert13_1() {
      Alert('標題', '敘述')
        .input()
        .present(alert => setTimeout(_ => alert.dismiss(), 3000))
    },
    alert13_2() {
      Alert('標題', '敘述')
        .input('請輸入…', '')
        .button('關閉', alert => alert.dismiss())
        .present()
    },
    alert13_3() {
      Alert('標題', '敘述')
        .input('請輸入…', '預設值')
        .button('關閉', alert => alert.dismiss())
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },
    alert13_4() {
      Alert('標題', '敘述')
        .input('請輸入…')
        .button('關閉', alert => alert.dismiss())
        .button('取消', alert => alert.dismiss(), true)
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },

    alert14_1() {
      Alert('標題', '敘述')
        .input()
        .input()
        .present(alert => setTimeout(_ => alert.dismiss(), 3000))
    },
    alert14_2() {
      Alert('標題', '敘述')
        .input('請輸入…', '')
        .input('請輸入…', '')
        .button('關閉', alert => alert.dismiss())
        .present()
    },
    alert14_3() {
      Alert('標題', '敘述')
        .input('請輸入…', '預設值')
        .input('請輸入…', '預設值')
        .button('關閉', alert => alert.dismiss())
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },
    alert14_4() {
      Alert('標題', '敘述')
        .input('請輸入…')
        .input('請輸入…')
        .button('關閉', alert => alert.dismiss())
        .button('取消', alert => alert.dismiss(), true)
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },

    alert15_1() {
      Alert('標題', '敘述')
        .input()
        .input()
        .input()
        .present(alert => setTimeout(_ => alert.dismiss(), 3000))
    },
    alert15_2() {
      Alert('標題', '敘述')
        .input('請輸入…', '')
        .input('請輸入…', '')
        .input('請輸入…', '')
        .button('關閉', alert => alert.dismiss())
        .present()
    },
    alert15_3() {
      Alert('標題', '敘述')
        .input('請輸入…', '預設值')
        .input('請輸入…', '預設值')
        .input('請輸入…', '預設值')
        .button('關閉', alert => alert.dismiss())
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },
    alert15_4() {
      Alert('標題', '敘述')
        .input('請輸入…')
        .input('請輸入…')
        .input('請輸入…')
        .button('關閉', alert => alert.dismiss())
        .button('取消', alert => alert.dismiss(), true)
        .button('讀取', alert => setTimeout(_ => alert.dismiss(), 3000, alert.loading()))
        .present()
    },
  },
  template: `
    main#app
      label => @click=alert1_1   *text='只有標題'
      label => @click=alert1_2   *text='標題 + 按鈕x1'
      label => @click=alert1_3   *text='標題 + 按鈕x2'
      label => @click=alert1_4   *text='標題 + 按鈕x3'
      hr
      label => @click=alert2_1   *text='只有敘述'
      label => @click=alert2_2   *text='敘述 + 按鈕x1'
      label => @click=alert2_3   *text='敘述 + 按鈕x2'
      label => @click=alert2_4   *text='敘述 + 按鈕x3'
      hr
      label => @click=alert3_1   *text='只有輸入'
      label => @click=alert3_2   *text='輸入 + 按鈕x1'
      label => @click=alert3_3   *text='輸入 + 按鈕x2'
      label => @click=alert3_4   *text='輸入 + 按鈕x3'
      hr
      label => @click=alert4_1   *text='輸入x2'
      label => @click=alert4_2   *text='輸入x2 + 按鈕x1'
      label => @click=alert4_3   *text='輸入x2 + 按鈕x2'
      label => @click=alert4_4   *text='輸入x2 + 按鈕x3'
      hr
      label => @click=alert5_1   *text='輸入x3'
      label => @click=alert5_2   *text='輸入x3 + 按鈕x1'
      label => @click=alert5_3   *text='輸入x3 + 按鈕x2'
      label => @click=alert5_4   *text='輸入x3 + 按鈕x3'
      hr
      hr
      label => @click=alert6_1   *text='標題 + 敘述'
      label => @click=alert6_2   *text='標題 + 敘述 + 按鈕x1'
      label => @click=alert6_3   *text='標題 + 敘述 + 按鈕x2'
      label => @click=alert6_4   *text='標題 + 敘述 + 按鈕x3'
      hr
      hr
      label => @click=alert7_1   *text='標題 + 輸入'
      label => @click=alert7_2   *text='標題 + 輸入 + 按鈕x1'
      label => @click=alert7_3   *text='標題 + 輸入 + 按鈕x2'
      label => @click=alert7_4   *text='標題 + 輸入 + 按鈕x3'
      hr
      label => @click=alert8_1   *text='標題 + 輸入x2'
      label => @click=alert8_2   *text='標題 + 輸入x2 + 按鈕x1'
      label => @click=alert8_3   *text='標題 + 輸入x2 + 按鈕x2'
      label => @click=alert8_4   *text='標題 + 輸入x2 + 按鈕x3'
      hr
      label => @click=alert9_1   *text='標題 + 輸入x3'
      label => @click=alert9_2   *text='標題 + 輸入x3 + 按鈕x1'
      label => @click=alert9_3   *text='標題 + 輸入x3 + 按鈕x2'
      label => @click=alert9_4   *text='標題 + 輸入x3 + 按鈕x3'
      hr
      hr
      label => @click=alert10_1   *text='敘述 + 輸入'
      label => @click=alert10_2   *text='敘述 + 輸入 + 按鈕x1'
      label => @click=alert10_3   *text='敘述 + 輸入 + 按鈕x2'
      label => @click=alert10_4   *text='敘述 + 輸入 + 按鈕x3'
      hr
      label => @click=alert11_1   *text='敘述 + 輸入x2'
      label => @click=alert11_2   *text='敘述 + 輸入x2 + 按鈕x1'
      label => @click=alert11_3   *text='敘述 + 輸入x2 + 按鈕x2'
      label => @click=alert11_4   *text='敘述 + 輸入x2 + 按鈕x3'
      hr
      label => @click=alert12_1   *text='敘述 + 輸入x3'
      label => @click=alert12_2   *text='敘述 + 輸入x3 + 按鈕x1'
      label => @click=alert12_3   *text='敘述 + 輸入x3 + 按鈕x2'
      label => @click=alert12_4   *text='敘述 + 輸入x3 + 按鈕x3'

      hr
      hr
      label => @click=alert13_1   *text='標題 + 敘述 + 輸入'
      label => @click=alert13_2   *text='標題 + 敘述 + 輸入 + 按鈕x1'
      label => @click=alert13_3   *text='標題 + 敘述 + 輸入 + 按鈕x2'
      label => @click=alert13_4   *text='標題 + 敘述 + 輸入 + 按鈕x3'
      hr
      label => @click=alert14_1   *text='標題 + 敘述 + 輸入x2'
      label => @click=alert14_2   *text='標題 + 敘述 + 輸入x2 + 按鈕x1'
      label => @click=alert14_3   *text='標題 + 敘述 + 輸入x2 + 按鈕x2'
      label => @click=alert14_4   *text='標題 + 敘述 + 輸入x2 + 按鈕x3'
      hr
      label => @click=alert15_1   *text='標題 + 敘述 + 輸入x3'
      label => @click=alert15_2   *text='標題 + 敘述 + 輸入x3 + 按鈕x1'
      label => @click=alert15_3   *text='標題 + 敘述 + 輸入x3 + 按鈕x2'
      label => @click=alert15_4   *text='標題 + 敘述 + 輸入x3 + 按鈕x3'
      `
})