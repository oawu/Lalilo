/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Asset = require('@oawu/_Asset')
const Config = require('@oawu/_Config')

module.exports = {
  title: 'Lalilo',

  jsEnv: Config.jsEnv,

  asset: _ => Asset()
    .css('icon/icon.css')

    .css('_Core/01-Elements.css')
    .css('_Core/02-Vars.css')
    .css('_Core/03-Body.css')
    .css('_Core/04-Classes.css')
    .css('_Core/05-Includes.css')

    .css('index.css')

    .js('https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js')

    .js('_Core/01-Helper.js')
    .js('_Core/02-Load.js')
    .js('_Core/03-El3.js')
    .js('_Core/04-Param.js')
    .js('_Core/05-Data.js')
    .js('_Core/06-Api.js')
    .js('_Core/07-Copy.js')

    .js('index.js')
}