/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Asset = require('@oawu/_Asset')
const Config = require('@oawu/_Config')

module.exports = {
  title: 'Lalilo',

  asset: _ => Asset()
        .css('icon/icon.css')
        .css('_/Core.css')
        .css('_/Alert.css')
        .css('_/Toastr.css')
        .css('_/Lib.css')
        .css('_/Lib/EventNav.css')
        .css('edit-0319.css')

        .js('https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js')
        
        .js('_/Core/El3.js')
        .js('_/Core/Load.js')

        .js('_/Alert.js')
        .js('_/Toastr.js')
        .js('_/Lib.js')
        .js('_/Lib/EventNav.js')
        .js('_/Gmap.js')

        .js('edit-0319.js')
}