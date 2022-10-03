<?php

namespace HTML;

echo html(
  head(
    meta()->attr('http-equiv', 'Content-Language')->content('zh-tw'),
    meta()->attr('http-equiv', 'Content-type')->content('text/html; charset=utf-8'),
    meta()->name('viewport')->content('width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,minimal-ui'),
    meta()->name('robots')->content('noindex,nofollow'),
    script('window.location.assign("' . BASE . 'index.html?f=404");')->type('text/javascript'),
    style('@charset "UTF-8";body{color:rgba(0,0,0,.8);background-color:#f2f2f7}main{position:fixed;left:0;right:0;text-align:center;top:calc(50% - 32px);display:inline-block;height:32px;line-height:32px;font-size:large;font-family:"微軟正黑體","黑體-繁","Open sans","Helvetica Neue",HelveticaNeue,Helvetica,Arial,sans-serif}@media (prefers-color-scheme:dark){body{background-color:#000;color:rgba(255,255,255,.95)}}')->type('text/css'),
    title('你迷路了' . SEPARATE . TITLE)
  ),
  body(main("你迷路囉！"))
)->lang('zh-Hant');