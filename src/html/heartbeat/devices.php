<?php

namespace HTML;

echo html(
  head(
    meta()->attr('http-equiv', 'Content-Language')->content('zh-tw'),
    meta()->attr('http-equiv', 'Content-type')->content('text/html; charset=utf-8'),
    meta()->name('viewport')->content('width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,minimal-ui'),

    title('各個咖啡機的 heartbeat 紀錄' . SEPARATE . TITLE),

    asset()
      ->css('_/Core.css')
      ->css('_/Alert.css')
      ->css('_/Toastr.css')
      ->css('_/PopupBox.css')
      ->css('heartbeat/devices.css')
      ->js('https://code.jquery.com/jquery-1.12.4.min.js')
      ->js('https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js')
      ->js('_/Core.js')
      ->js('_/Alert.js')
      ->js('_/Toastr.js')
      ->js('_/PopupBox.js')
      ->js('heartbeat/devices.js')
  ),
  body()
)->lang('zh-Hant');
