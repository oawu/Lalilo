<?php

/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

return [
  \HTML\Script("window.ENV = '" . ENVIRONMENT . "';")->type('text/javascript'),
  \HTML\Script("window.EXT = '" . (ENVIRONMENT == 'Development' ? '.php' : '.html') . "';")->type('text/javascript'),
  \HTML\Script("window.API_URL = '" . API_URL . "';")->type('text/javascript'),
  \HTML\Script("window.BASE = '" . BASE . "';")->type('text/javascript'),
  \HTML\Script("window.SOCKET = '" . SOCKET . "';")->type('text/javascript'),
];
