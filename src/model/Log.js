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

  baseUrl: Config.baseUrl,

  asset: _ => Asset()
    .css('icon/icon.css')
    .css('_/Core/Core.css')
    .css('_/Core/Alert.css')
    .css('_/Core/Toastr.css')

    .css('Log.css')

    .js('_/Core/vue-2.7.16.min.js', false)
    .js('_/Core/jquery-1.12.4.min.js', false)

    .js('_/Core/El3.js')
    .js('_/Core/Load.js')
    .js('_/Core/Api.js')
    .js('_/Core/Helper.js')
    .js('_/Core/Alert.js')
    .js('_/Core/Toastr.js')
    
    .js('_/Core/App.js')
    .js('_/Core/App.Emu.js')

    .js('Log.js')
}