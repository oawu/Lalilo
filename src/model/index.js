/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Asset = require('@oawu/_Asset')
const Config = require('@oawu/_Config')

module.exports = {
  title: '🚀 部署',

  baseUrl: Config.baseUrl,
  socketUrl: 'http://127.0.0.1:8125',
  token: 'nerbnvwbx6',

  asset: _ => Asset()
    .css('_/Core.css')
    .css('index.css')

    .js('https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js')
    .js('https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.2.0/socket.io.js')

    .js('_/Core/El3.js')
    .js('_/Core/Load.js')

    .js('index.js')
}