/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2026, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */
(m=>{const{Type:a,promisify:l}=window.Helper;window.Load={$(e,n=null){return l(n,async i=>{if(a.func(e)&&(e=e()),a.asyncFunc(e)&&(e=await e()),a.promise(e)&&(e=await e),!a.obj(e))return e;e.template===void 0&&(e.template=""),a.func(e.template)&&(e.template=e.template()),a.asyncFunc(e.template)&&(e.template=await e.template()),a.promise(e.template)&&(e.template=await e.template),a.num(e.template)&&(e.template=`${e.template}`),a.bool(e.template)&&(e.template=""),a.arr(e.template)&&(e.template="");const t=window.El3;return a.str(e.template)&&(e.template=t(e.template)),a.func(t)&&e.template instanceof t&&(e.template=e.template.toString()),a.obj(e.template)&&(e.template=e.template.toString()),e})},Vue:(e,n=null)=>l(n,async i=>document.addEventListener("DOMContentLoaded",async t=>document.body.appendChild(new Vue(await window.Load.$(e)).$mount().$el))),VueComponent:(e,n,i=null)=>l(i,async t=>Vue.component(e,await window.Load.$(n)))}})();
