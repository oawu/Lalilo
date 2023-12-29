<?php

/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, LaliloCore
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

namespace HTML;

echo html(
  head(
    meta()->attr('http-equiv', 'Content-Language')->content('zh-tw'),
    meta()->attr('http-equiv', 'Content-type')->content('text/html; charset=utf-8'),
    meta()->name('viewport')->content('width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,minimal-ui'),

    title(TITLE),

    asset()
      ->css('icon.css')
      ->css('_/Core.css')
      ->css('_/Alert.css')
      ->css('_/Toastr.css')
      ->css('_/Nav.css')
      ->css('_/Component/PrettyJson.css')
      ->css('_/Component/Segmented.css')
      ->css('_/Component/Layout.css')
      ->css('index.css')
      ->js('https://code.jquery.com/jquery-1.12.4.min.js')
      ->js('https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js')
      ->js('_/Core.js')
      
      ->js('_/Lib/Helper.js')

      ->js('_/Lib/PrettyJson.js')
      ->js('_/Lib/PrettyJson/Null.js')
      ->js('_/Lib/PrettyJson/Bool.js')
      ->js('_/Lib/PrettyJson/Num.js')
      ->js('_/Lib/PrettyJson/Str.js')
      ->js('_/Lib/PrettyJson/Arr.js')
      ->js('_/Lib/PrettyJson/Obj.js')
      ->js('_/Lib/PrettyJson/Obj/KeyVal.js')
      
      ->js('_/Lib/Api.js')
      ->js('_/Lib/Api/Ctrl.js')
      
      ->js('_/Lib/Api/Token.js')
      ->js('_/Lib/Api/Token/Fix.js')
      ->js('_/Lib/Api/Token/Var.js')
      ->js('_/Lib/Api/Token/Rand.js')

      ->js('_/Lib/Api/Request.js')
      ->js('_/Lib/Api/Request/Url.js')
      ->js('_/Lib/Api/Request/Method.js')
      ->js('_/Lib/Api/Request/Payload.js')
      ->js('_/Lib/Api/Request/Payload/Form.js')
      
      ->js('_/Lib/Api/Rule.js')
      ->js('_/Lib/Api/Rule/Test.js')
      ->js('_/Lib/Api/Rule/Test/Condition.js')
      ->js('_/Lib/Api/Rule/Test/Bool.js')
      ->js('_/Lib/Api/Rule/Test/Num.js')
      ->js('_/Lib/Api/Rule/Test/Str.js')
      ->js('_/Lib/Api/Rule/Test/Arr.js')
      ->js('_/Lib/Api/Rule/Test/Obj.js')

      ->js('_/Lib/Api/Rule/Save.js')
      
      ->js('_/Lib/Api/Response.js')
      ->js('_/Lib/Api/Response/Info.js')
      ->js('_/Lib/Api/Response/Header.js')
      ->js('_/Lib/Api/Response/Body.js')
      ->js('_/Lib/Api/Response/Body/Json.js')

      ->js('_/Alert.js')
      ->js('_/Toastr.js')
      ->js('_/Nav.js')
      ->js('_/Component/PrettyJson.js')
      ->js('_/Component/Segmented.js')
      ->js('_/Component/Layout.js')
      ->js('index.js')
  ),
  body()
)->lang('zh-Hant');
