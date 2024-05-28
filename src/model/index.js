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

  asset: Asset()
        .css('icon/icon.css')
        .css('_/Core.css')
        .css('index.css')

        .js('https://code.jquery.com/jquery-1.12.4.min.js')
        .js('https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js')

        .js('_/Core/El3.js')
        .js('_/Core/Load.js')

        .js('vue-index.js')
}