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
    // .css('https://unpkg.com/leaflet@1.9.2/dist/leaflet.css')

    .css('icon/icon.css')
    .css('_/Core.css')
    .css('_/Alert.css')
    .css('_/Toastr.css')
    .css('00-tool.css')

    .js('_/Core/vue-2.7.16.min.js', false)
    .js('_/Core/jquery-1.12.4.min.js', false)

    // .js('https://unpkg.com/leaflet@1.9.2/dist/leaflet.js')
    // .js('https://unpkg.com/leaflet-ant-path@1.3.0/dist/leaflet-ant-path.js')

    .js('_/Core/El3.js')
    .js('_/Core/Load.js')
    .js('_/Core/Api.js')
    .js('_/Core/Helper.js')
    .js('_/Alert.js')
    .js('_/Toastr.js')
    
    .js('_/App.js')
    .js('_/App.Emu.js')

    .js('00-tool.js')
    .js('02-alert.js')
}