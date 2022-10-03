<?php

/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

switch (ENVIRONMENT) {
  case 'Development':
    define('API_URL',  'http://dev-app.idrip.coffee/tool/');
    define('BASE', 'http://127.0.0.1:8000/');
    define('SOCKET', 'http://127.0.0.1:8123/');

    break;
  case 'Staging':
    define('API_URL',  'https://beta-app.idrip.coffee/tool/');
    define('BASE', 'https://tool.idrip.coffee/beta/');
    define('SOCKET', 'https://beta-socket-device.idrip.coffee/');

    break;
  case 'Production':
    define('API_URL',  'https://app.idrip.coffee/tool/');
    define('BASE', 'https://tool.idrip.coffee/');
    define('SOCKET', 'https://beta-socket-device.idrip.coffee/');
    break;
}
