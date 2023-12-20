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
      ->css('_api.css')
      ->css('_/Alert.css')
      ->css('_/Toastr.css')
      ->css('_/Nav.css')
      ->css('_/Component/Segmented.css')
      ->css('index.css')
      ->js('https://code.jquery.com/jquery-1.12.4.min.js')
      ->js('https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js')
      ->js('_/Core.js')
      
      ->js('_api.js')
      ->js('_api-folder.js')
      ->js('_api-request.js')
      ->js('_api-sample.js')

      ->js('_/Alert.js')
      ->js('_/Toastr.js')
      ->js('_/Nav.js')
      ->js('_/Component/Segmented.js')
      ->js('index.js')
  ),
  body()
)->lang('zh-Hant');
