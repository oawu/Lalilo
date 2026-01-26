/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2026, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */
(c=>{const{Type:o,promisify:l,tryFunc:n}=window.Helper;window.Copy={str:(d,y)=>l(y,async i=>{let e=document.createElement("textarea");e.style.position="fixed",e.style.left="-100000px",e.style.top="-100000px",e.style.zIndex="-999999",e.style.opacity="0",e.value=d,document.body.appendChild(e),e.select();const t=await n(r=>document.execCommand("copy"));if(document.body.removeChild(e),e=null,o.err(t))throw t;return null})}})();
