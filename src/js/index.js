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
  },
  template: `
    layout
      template => slot=main
        #story
          #unit-roles
            .unit-roles
              .role-units
                b => *text='用戶前台'
              .role-units
                b => *text='管理後台'
            .unit-roles
              .role-units
                .role-unit
                  header
                    b => *text='登入前台'
                .role-unit
                  header
                    b => *text='清除購物車'
                .role-unit
                  header
                    b => *text='加入購物車'
                .role-unit
                  header
                    b => *text='取得付款憑證'
                .role-unit
                  header
                    b => *text='付款'
              .role-units
            
            .unit-roles
              .role-units
              .role-units
                .role-unit
                  header
                    b => *text='登入後台'
                .role-unit
                  header
                    b => *text='排程過 12 小時'
                .role-unit
                  header
                    b => *text='登入後台'
                .role-unit
                  header
                    b => *text='檢視訂單-取的項目'
                .role-unit
                  header
                    b => *text='建立出貨單'
                .role-unit
                  header
                    b => *text='檢視訂單-取得出貨單'
                .role-unit
                  header
                    b => *text='送達'
            
            .unit-roles
              .role-units
                .role-unit
                  header
                    b => *text='登入前台'
                .role-unit
                  header
                    b => *text='檢視訂單'
                .role-unit
                  header
                    b => *text='檢查是否可被申請退貨'
                .role-unit
                  header
                    b => *text='申請退貨'
              .role-units
            
            .unit-roles
              .role-units
              .role-units
                .role-unit
                  header
                    b => *text='登入後台'
                .role-unit
                  header
                    b => *text='允許退貨'
                
            .unit-roles
              .role-units
              .role-units
                .unit
                  .role-unit
                    header
                      b => *text='登入後台'
                  .role-unit
                    header
                      b => *text='退款'

      `
})
