/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Api.Folder = function(title, children = []) {
  if (!(this instanceof Api.Folder))
    return new Api.Folder(title, children)
  this._title = title
  this._children = children
  this._open = true
}
Object.defineProperty(Api.Folder.prototype, 'el', {
  get () { return 'tree-api-folder' }
})
Object.defineProperty(Api.Folder.prototype, 'title', {
  get () { return this._title }
})
Object.defineProperty(Api.Folder.prototype, 'children', {
  get () { return this._children }
})
Object.defineProperty(Api.Folder.prototype, 'open', {
  get () { return this._open },
  set (val) { return this._open = val }
})

Load.VueComponent('tree-api-folder', {
  props: {
    obj: { type: Api.Folder, required: true },
  },
  template: `
    div.tree-api-folder
      div.tree-api-title => :class={_open: obj.open}   @click=obj.open=!obj.open
        label
        span => *text=obj.title

      div.tree-api-children
        component => *for=(child, i) in obj.children   :key=i   :is=child.el   :obj=child
  `
})