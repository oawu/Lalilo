/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.VueComponent('form_message', {
  props: {
    type: { type: String, default: 'warning', required: false },
    messages: { type: Array, default: [], required: false }
  },
  template: `
    ul._form_message => *if=messages.length   :class='__' + (['warning', 'info'].includes(type) ? type : 'warning')
      li => *for=(message, i) in messages   :key=i   *text=message`
})
