/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Asset = require('@oawu/_Asset')
const Config = require('@oawu/_Config')

module.exports = {
  title: 'PicMate',
  // PicNest

  baseUrl: Config.baseUrl,

  asset: _ => Asset()
    .css('https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css')
    .css('icon/icon.css')
    .css('_/Core.css')
    .css('_/Component/Segmented.css')
    .css('album.css')

    .js('https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js')
    .js('https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js')
    .js('https://cdn.jsdelivr.net/npm/jquery@1.12.4/dist/jquery.min.js', false)

    .js('_/Core/El3.js')
    .js('_/Core/Load.js')
    .js('_/Core/Api.js')
    .js('_/Core/Param.js')
    .js('_/Component/Segmented.js')

    .js('album.js')
}