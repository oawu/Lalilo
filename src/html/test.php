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
      ->css('https://fonts.googleapis.com/css?family=Comfortaa:400,300,700')
      ->css('https://cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/hack.css')
      ->css('test.css')
  ),
  body(
    h1('肆 . 零 . 肆'),
    p('糟糕，是 404 not found！'),
    article(
      div(
        span('html')->class('r'),
        span('_')->class('s'),
        span('{')
      ),
      div(
        span('position')->class('b i'),
        span(':'),
        span('_')->class('s'),
        span('fixed')->class('b'),
        span(';')
      ),
      div(
        span('top')->class('b i'),
        span(':'),
        span('_')->class('s'),
        span('-99999')->class('p'),
        span('px')->class('r'),
        span(';')
      ),
      div(
        span('left')->class('b i'),
        span(':'),
        span('_')->class('s'),
        span('-99999')->class('p'),
        span('px')->class('r'),
        span(';')
      ),
      div(
      ),
      div(
        span('z-index')->class('b i'),
        span(':'),
        span('_')->class('s'),
        span('-99999')->class('p'),
        span(';')
      ),
      div(
      ),
      div(
        span('display')->class('b i'),
        span(':'),
        span('_')->class('s'),
        span('null')->class('b'),
        span(';')
      ),
      div(
        span('width')->class('b i'),
        span(':'),
        span('_')->class('s'),
        span('0')->class('p'),
        span(';')
      ),
      div(
        span('height')->class('b i'),
        span(':'),
        span('_')->class('s'),
        span('0')->class('p'),
        span(';')
      ),
      div(
      ),
      div(
        span('filter')->class('b i'),
        span(':'),
        span('_')->class('s'),
        span('progid:DXImageTransform.Microsoft.Alpha')->class('b'),
        span('(Opacity=0);')
      ),
      div(
        span('opacity')->class('b i'),
        span(':'),
        span('_')->class('s'),
        span('0')->class('p'),
        span(';')
      ),
      div(
      ),
      div(
        span('-webkit-transform')->class('b i'),
        span(':'),
        span('_')->class('s'),
        span('scale')->class('b'),
        span('('),
        span('0')->class('p'),
        span(','),
        span('_')->class('s'),
        span('0')->class('p'),
        span(');')
      ),
      div(
        span('_')->class('s i'),
        span('_')->class('s'),
        span('_')->class('s'),
        span('-moz-transform')->class('b'),
        span(':'),
        span('_')->class('s'),
        span('scale')->class('b'),
        span('('),
        span('0')->class('p'),
        span(','),
        span('_')->class('s'),
        span('0')->class('p'),
        span(');')
      ),
      div(
        span('_')->class('s i'),
        span('_')->class('s'),
        span('_')->class('s'),
        span('_')->class('s'),
        span('-ms-transform')->class('b'),
        span(':'),
        span('_')->class('s'),
        span('scale')->class('b'),
        span('('),
        span('0')->class('p'),
        span(','),
        span('_')->class('s'),
        span('0')->class('p'),
        span(');')
      ),
      div(
        span('_')->class('s i'),
        span('_')->class('s'),
        span('_')->class('s'),
        span('_')->class('s'),
        span('_')->class('s'),
        span('-o-transform')->class('b'),
        span(':'),
        span('_')->class('s'),
        span('scale')->class('b'),
        span('('),
        span('0')->class('p'),
        span(','),
        span('_')->class('s'),
        span('0')->class('p'),
        span(');')
      ),
      div(
        span('_')->class('s i'),
        span('_')->class('s'),
        span('_')->class('s'),
        span('_')->class('s'),
        span('_')->class('s'),
        span('_')->class('s'),
        span('_')->class('s'),
        span('_')->class('s'),
        span('transform')->class('b'),
        span(':'),
        span('_')->class('s'),
        span('scale')->class('b'),
        span('('),
        span('0')->class('p'),
        span(','),
        span('_')->class('s'),
        span('0')->class('p'),
        span(');')
      ),

      div(
        span('}')
      )
    ),
    footer(
      a(
        'OA'
      )->href('https://www.ioa.tw/')->target('blank'),
      i(),
      a(
        'GitHub'
      )->href('https://github.com/oawu/')->target('blank')
    )
  )
)->lang('zh-Hant');
