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

    .css('_/Core/Core.css')
    .css('New.css')

    .js('_/Core/vue-2.7.16.min.js', false)
    .js('_/Core/jquery-1.12.4.min.js', false)

    .js('_/Core/El3.js')
    .js('_/Core/Load.js')
    
    .js('_/App/Core.js')
    .js('_/App/EMU.js')
    .js('_/App/EMU/Log.js')
    .js('_/App/EMU/Action.js')
    .js('_/App/EMU/Action/Emit.js')
    .js('_/App/EMU/Action/Func.js')
    .js('_/App/EMU/Feedback.js')
    .js('_/App/EMU/OnScroll.js')
    
    .js('_/App/Log.js')
    .js('_/App/OnScroll.js')
    
    .js('_/App/Feedback.js')
    .js('_/App/Feedback/Error.js')
    .js('_/App/Feedback/Heavy.js')
    .js('_/App/Feedback/Light.js')
    .js('_/App/Feedback/Medium.js')
    .js('_/App/Feedback/Rigid.js')
    .js('_/App/Feedback/Soft.js')
    .js('_/App/Feedback/Success.js')
    .js('_/App/Feedback/Warning.js')
    
    .js('_/App/Action.js')
    .js('_/App/Action/On.js')
    .js('_/App/Action/Emit.js')
    .js('_/App/Action/Func.js')

    .js('_/App/Alert.js')
    .js('_/App/Alert/Button.js')
    .js('_/App/Alert/Input.js')

    .js('New.js')
}