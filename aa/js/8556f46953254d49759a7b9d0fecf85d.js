/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2026, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */
window.Load.Vue(e=>{const{Str:t}=window.Helper;return{data:{style:{color:"rgba(120, 120, 120, 1.00);"},version:"3.0.1",a:!0},async mounted(){this.a&&(console.error(1),process.exit())},computed:{date(){return t.date()}},methods:{},template:`
      main#app
        h1 => *text='你好，世界！'
        div => :style=style
          span => *text='這是 '
          b    => *text='Lalilo'
          span => *text='，你目前版本是 '
          b    => *text=version
        br
        span => *text=date
      `}});
