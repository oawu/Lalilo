/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

$(_ => {
  const $menu = $('#menu')
  $('#cover, #hamburger').click(_ => $menu.toggleClass('show'))
})