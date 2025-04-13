/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Asset = require('@oawu/_Asset')
const Config = require('@oawu/_Config')

module.exports = {
  title: '登入 - 愛上大數據',
  robots: 'noindex, nofollow',

  baseUrl: Config.baseUrl,

  asset: _ => Asset()
    .css('icon/icon.css')
    .css('_/Core.css')
    .css('_/Component/FormMessage.css')
    .css('_/Alert.css')
    .css('login.css')

    .js('https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js')

    .js('_/Core.js')

    .js('_/Core/El3.js')
    .js('_/Core/Load.js')
    .js('_/Component/FormMessage.js')
    .js('_/Alert.js')

    .js('login.js')
}