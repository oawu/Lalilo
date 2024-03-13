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
      ->css('https://unpkg.com/leaflet@1.9.2/dist/leaflet.css')
      ->css('icon.css')
      ->css('_/Core.css')
      ->css('index.css')

      ->js('https://code.jquery.com/jquery-1.12.4.min.js')
      ->js('https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js')
      ->js('https://unpkg.com/leaflet@1.9.2/dist/leaflet.js')
      ->js('https://unpkg.com/leaflet-ant-path@1.3.0/dist/leaflet-ant-path.js')
      ->js('_/Core.js')
      ->js('index.js')
  ),
  body()
)->lang('zh-Hant');
