
const pad0 = (t, n = 2, c = '0') => {
  t = '' + t
  c = '' + c
  n = '' + Math.pow(10, n - 1)
  if (t.length > n.length) return t
  n = n.length - t.length
  return c.repeat(n) + t
}
const date = (format = 'Y-m-d H:i:s', now = new Date()) => {
  return now = now instanceof Date ? now : new Date(now * 1000), format.replace('Y', now.getFullYear()).replace('m', pad0(now.getMonth() + 1)).replace('d', pad0(now.getDate())).replace('H', pad0(now.getHours())).replace('i', pad0(now.getMinutes())).replace('s', pad0(now.getSeconds()))
}
!function(){function t(t){return I[t-S][0]}function n(t){for(var n=I[t-S],r=n[0],e=n[3].toString(2).split(""),a=0;a<16-e.length;a++)e.unshift(0);for(var o=r?13:12,d=0,u=[],a=0;a<o;a++)0==e[a]?(d+=29,u.push(29)):(d+=30,u.push(30));return{yearDays:d,monthDays:u}}function r(t,r){for(var e=n(t),a=r>0?r:e.yearDays-Math.abs(r),o=e.monthDays,d=0,u=0,i=0;i<o.length;i++)if((d+=o[i])>a){u=i,d-=o[i];break}return[t,u,a-d+1]}function e(t,n,e){var o=I[t-S],d=a(t,o[1]-1,o[2],t,n,e);return 0==d?[t,0,1]:r(d>0?t:t-1,d)}function a(t,n,r,e,a,o){var d=new Date(t,n,r).getTime();return(new Date(e,a,o).getTime()-d)/864e5}function o(t,r,e){for(var a=n(t).monthDays,o=0,d=0;d<a.length&&d<r;d++)o+=a[d];return o+e-1}function d(t,n){return new Date(31556925974.7*(t-1890)+6e4*U[n]+Date.UTC(1890,0,5,16,2,31)).getUTCDate()}function u(t){for(var n={},r=0,e=0;e<24;e++){var a=d(t,e);e%2==0&&r++,n[F(r-1,a)]=Y.solarTerm[e]}return n}function i(t){var n=t-1890+25;return Y.zodiac[n%12]}function h(t){return Y.heavenlyStems[t%10]+Y.earthlyBranches[t%12]}function f(t,n){return n=n||0,h(t-1890+25+n)}function l(t,n,r){return r=r||0,h(12*(t-1890)+n+12+r)}function s(t,n,r){return h(Date.UTC(t,n,r)/864e5+29219+18)}function c(t,n){return[31,m(t)?29:28,31,30,31,30,31,31,30,31,30,31][n]}function m(t){return t%4==0&&t%100!=0||t%400==0}function D(t,n,r,e){var a=arguments.length,o=new Date;return t=a?parseInt(t,10):o.getFullYear(),n=a?parseInt(n-1,10):o.getMonth(),r=a?parseInt(r,10)||o.getDate():o.getDate(),t<(e||S+1)||t>b?{error:100,msg:T[100]}:{year:t,month:n,day:r}}function y(t,n,r){var e=D(t,n,r);if(e.error)return e;var a=e.year,d=o(a,e.month,e.day),u=I[a-S],i=u[1],h=u[2],f=new Date(a,i-1,h).getTime()+864e5*d;return f=new Date(f),{year:f.getFullYear(),month:f.getMonth()+1,day:f.getDate()}}function g(r,a,o){var h=D(r,a,o,S);if(h.error)return h;var c=h.year,m=h.month,y=h.day;L.setCurrent(c);var g=L.get("term2")?L.get("term2"):L.set("term2",d(c,2)),v=L.get("termList")?L.get("termList"):L.set("termList",u(c)),p=d(c,2*m),C=m>1||1==m&&y>=g?c+1:c,w=y>=p?m+1:m,T=e(c,m,y),M=t(T[0]),b="";b=M>0&&M==T[1]?"閏"+Y.monthCn[T[1]-1]+"月":M>0&&T[1]>M?Y.monthCn[T[1]-1]+"月":Y.monthCn[T[1]]+"月";var I=z[F(m,y)]?z[F(m,y)]:[],U=!1,Z=n(T[0]).monthDays;return T[1]==Z.length-1&&T[2]==Z[Z.length-1]?U=G.d0100:M>0&&T[1]>M&&(U=G[F(T[1]-1,T[2])]?G[F(T[1]-1,T[2])]:[]),{zodiac:i(C),GanZhiYear:f(C),GanZhiMonth:l(c,w),GanZhiDay:s(c,m,y),worktime:"清明"==v[F(m,y)]||!!I.length&&I[1]||!!U.length&&U[1],term:v[F(m,y)],lunarYear:T[0],lunarMonth:T[1]+1,lunarDay:T[2],lunarMonthName:b,lunarDayName:Y.dateCn[T[2]-1],lunarLeapMonth:M,solarFestival:I.length?I[0]:[],lunarFestival:U.length?U[0]:[]}}function v(t,n,r){var e=D(t,n);if(e.error)return e;for(var a=p(e.year,e.month+1,r),o=0;o<a.monthData.length;o++){var d=a.monthData[o],u=g(d.year,d.month,d.day);C(a.monthData[o],u)}return a}function p(t,n,r){var e=D(t,n);if(e.error)return e;var a,o,d,u=e.year,i=e.month,h={firstDay:new Date(u,i,1).getDay(),monthDays:c(u,i),monthData:[]};if(h.monthData=w(u,i+1,h.monthDays,1),r){if(h.firstDay>0){var f=i-1<0?u-1:u,l=i-1<0?11:i-1;a=c(f,l),o=w(f,l+1,h.firstDay,a-h.firstDay+1),h.monthData=o.concat(h.monthData)}if(42-h.monthData.length!=0){var s=i+1>11?u+1:u,m=i+1>11?0:i+1,y=42-h.monthData.length;d=w(s,m+1,y,1),h.monthData=h.monthData.concat(d)}}return h}var C=function(t,n){if(t&&n&&"object"==typeof n)for(var r in n)t[r]=n[r];return t},w=function(t,n,r,e){var a=[];if(e=e||0,r<1)return a;for(var o=e,d=0;d<r;d++)a.push({year:t,month:n,day:o}),o++;return a},T={100:"年份超出了可達的範圍，僅支持1891年至2100年",101:"參數輸入錯誤，請查閱文檔"},M=null,L={current:"",setCurrent:function(t){this.current!=t&&(this.current=t,this.clear())},set:function(t,n){return M||(M={}),M[t]=n,M[t]},get:function(t){return M||(M={}),M[t]},clear:function(){M=null}},F=function(t,n){return t+=1,t=t<10?"0"+t:t,n=n<10?"0"+n:n,"d"+t+n},S=1890,b=2100,Y={solarTerm:["小寒","大寒","立春","雨水","驚蟄","春分","清明","穀雨","立夏","小滿","芒種","夏至","小暑","大暑","立秋","處暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"],heavenlyStems:["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"],earthlyBranches:["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"],zodiac:["鼠","牛","虎","兔","龍","蛇","馬","羊","猴","雞","狗","豬"],monthCn:["正","二","三","四","五","六","七","八","九","十","十一","十二"],dateCn:["初一","初二","初三","初四","初五","初六","初七","初八","初九","初十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十","廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十","卅一"]},z={d0101:[["元旦","中華民國開國紀念日"],!0],d0111:[["司法節"],!1],d0115:[["藥師節"],!1],d0123:[["自由日"],!1],d0204:[["農民節"],!1],d0214:[["情人節"],!1],d0215:[["戲劇節"],!1],d0219:[["新生活運動紀念日"],!1],d0228:[["和平紀念日"],!0],d0301:[["兵役節"],!1],d0305:[["童子軍節"],!1],d0308:[["婦女節"],!1],d0312:[["植樹節","國父逝世紀念日"],!1],d0317:[["國醫節"],!1],d0320:[["郵政節"],!1],d0321:[["氣象節"],!1],d0325:[["美術節"],!1],d0326:[["廣播節"],!1],d0329:[["青年節","革命先烈紀念日"],!1],d0330:[["出版節"],!1],d0401:[["愚人節","主計節"],!1],d0404:[["婦幼節"],!1],d0405:[["音樂節"],!1],d0407:[["衛生節"],!1],d0422:[["世界地球日"],!1],d0501:[["勞動節"],!0],d0504:[["文藝節"],!1],d0505:[["舞蹈節"],!1],d0510:[["珠算節"],!1],d0512:[["護士節"],!1],d0603:[["禁煙節"],!1],d0606:[["工程師節","水利節"],!1],d0609:[["鐵路節"],!1],d0615:[["警察節"],!1],d0630:[["會計師節"],!1],d0701:[["漁民節","公路節","稅務節"],!1],d0711:[["航海節"],!1],d0712:[["聾啞節"],!1],d0808:[["父親節"],!1],d0814:[["空軍節"],!1],d0827:[["鄭成功誕辰"],!1],d0901:[["記者節"],!1],d0903:[["軍人節","抗戰紀念"],!1],d0909:[["體育節","律師節"],!1],d0913:[["法律日"],!1],d0928:[["教師節","孔子誕辰"],!1],d1006:[["老人節"],!1],d1010:[["國慶紀念日"],!0],d1021:[["華僑節"],!1],d1025:[["台灣光復節"],!1],d1031:[["萬聖節","蔣公誕辰紀念日","榮民節"],!1],d1101:[["商人節"],!1],d1111:[["工業節","地政節"],!1],d1117:[["自來水節"],!1],d1112:[["國父誕辰紀念日","醫師節","中華文化復興節"],!1],d1121:[["防空節"],!1],d1205:[["海員節","盲人節"],!1],d1210:[["人權節"],!1],d1212:[["憲兵節"],!1],d1225:[["行憲紀念日","民族復興節","聖誕節"],!1],d1227:[["建築師節"],!1],d1228:[["電信節"],!1],d1231:[["受信節"],!1]},G={d0101:[["春節"],!0],d0102:[["回娘家"],!0],d0103:[["祭祖"],!0],d0104:[["迎神"],!1],d0105:[["開市"],!1],d0109:[["天公生"],!1],d0115:[["元宵節","觀光節"],!1],d0202:[["頭牙","土地公生"],!1],d0323:[["媽祖生"],!1],d0408:[["浴佛節"],!1],d0505:[["端午節","詩人節"],!0],d0701:[["開鬼門"],!1],d0707:[["七夕情人節"],!1],d0715:[["中元節"],!1],d0800:[["關鬼門"],!1],d0815:[["中秋節"],!0],d0909:[["重陽節"],!1],d1208:[["臘八節"],!1],d1216:[["尾牙"],!1],d1224:[["送神"],!1],d0100:[["除夕"],!0]},I=[[2,1,21,22184],[0,2,9,21936],[6,1,30,9656],[0,2,17,9584],[0,2,6,21168],[5,1,26,43344],[0,2,13,59728],[0,2,2,27296],[3,1,22,44368],[0,2,10,43856],[8,1,30,19304],[0,2,19,19168],[0,2,8,42352],[5,1,29,21096],[0,2,16,53856],[0,2,4,55632],[4,1,25,27304],[0,2,13,22176],[0,2,2,39632],[2,1,22,19176],[0,2,10,19168],[6,1,30,42200],[0,2,18,42192],[0,2,6,53840],[5,1,26,54568],[0,2,14,46400],[0,2,3,54944],[2,1,23,38608],[0,2,11,38320],[7,2,1,18872],[0,2,20,18800],[0,2,8,42160],[5,1,28,45656],[0,2,16,27216],[0,2,5,27968],[4,1,24,44456],[0,2,13,11104],[0,2,2,38256],[2,1,23,18808],[0,2,10,18800],[6,1,30,25776],[0,2,17,54432],[0,2,6,59984],[5,1,26,27976],[0,2,14,23248],[0,2,4,11104],[3,1,24,37744],[0,2,11,37600],[7,1,31,51560],[0,2,19,51536],[0,2,8,54432],[6,1,27,55888],[0,2,15,46416],[0,2,5,22176],[4,1,25,43736],[0,2,13,9680],[0,2,2,37584],[2,1,22,51544],[0,2,10,43344],[7,1,29,46248],[0,2,17,27808],[0,2,6,46416],[5,1,27,21928],[0,2,14,19872],[0,2,3,42416],[3,1,24,21176],[0,2,12,21168],[8,1,31,43344],[0,2,18,59728],[0,2,8,27296],[6,1,28,44368],[0,2,15,43856],[0,2,5,19296],[4,1,25,42352],[0,2,13,42352],[0,2,2,21088],[3,1,21,59696],[0,2,9,55632],[7,1,30,23208],[0,2,17,22176],[0,2,6,38608],[5,1,27,19176],[0,2,15,19152],[0,2,3,42192],[4,1,23,53864],[0,2,11,53840],[8,1,31,54568],[0,2,18,46400],[0,2,7,46752],[6,1,28,38608],[0,2,16,38320],[0,2,5,18864],[4,1,25,42168],[0,2,13,42160],[10,2,2,45656],[0,2,20,27216],[0,2,9,27968],[6,1,29,44448],[0,2,17,43872],[0,2,6,38256],[5,1,27,18808],[0,2,15,18800],[0,2,4,25776],[3,1,23,27216],[0,2,10,59984],[8,1,31,27432],[0,2,19,23232],[0,2,7,43872],[5,1,28,37736],[0,2,16,37600],[0,2,5,51552],[4,1,24,54440],[0,2,12,54432],[0,2,1,55888],[2,1,22,23208],[0,2,9,22176],[7,1,29,43736],[0,2,18,9680],[0,2,7,37584],[5,1,26,51544],[0,2,14,43344],[0,2,3,46240],[4,1,23,46416],[0,2,10,44368],[9,1,31,21928],[0,2,19,19360],[0,2,8,42416],[6,1,28,21176],[0,2,16,21168],[0,2,5,43312],[4,1,25,29864],[0,2,12,27296],[0,2,1,44368],[2,1,22,19880],[0,2,10,19296],[6,1,29,42352],[0,2,17,42208],[0,2,6,53856],[5,1,26,59696],[0,2,13,54576],[0,2,3,23200],[3,1,23,27472],[0,2,11,38608],[11,1,31,19176],[0,2,19,19152],[0,2,8,42192],[6,1,28,53848],[0,2,15,53840],[0,2,4,54560],[5,1,24,55968],[0,2,12,46496],[0,2,1,22224],[2,1,22,19160],[0,2,10,18864],[7,1,30,42168],[0,2,17,42160],[0,2,6,43600],[5,1,26,46376],[0,2,14,27936],[0,2,2,44448],[3,1,23,21936],[0,2,11,37744],[8,2,1,18808],[0,2,19,18800],[0,2,8,25776],[6,1,28,27216],[0,2,15,59984],[0,2,4,27424],[4,1,24,43872],[0,2,12,43744],[0,2,2,37600],[3,1,21,51568],[0,2,9,51552],[7,1,29,54440],[0,2,17,54432],[0,2,5,55888],[5,1,26,23208],[0,2,14,22176],[0,2,3,42704],[4,1,23,21224],[0,2,11,21200],[8,1,31,43352],[0,2,19,43344],[0,2,7,46240],[6,1,27,46416],[0,2,15,44368],[0,2,5,21920],[4,1,24,42448],[0,2,12,42416],[0,2,2,21168],[3,1,22,43320],[0,2,9,26928],[7,1,29,29336],[0,2,17,27296],[0,2,6,44368],[5,1,26,19880],[0,2,14,19296],[0,2,3,42352],[4,1,24,21104],[0,2,10,53856],[8,1,30,59696],[0,2,18,54560],[0,2,7,55968],[6,1,27,27472],[0,2,15,22224],[0,2,5,19168],[4,1,25,42216],[0,2,12,42192],[0,2,1,53584],[2,1,21,55592],[0,2,9,54560]],U=[0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758],Z={solarToLunar:g,lunarToSolar:y,calendar:v,solarCalendar:p,getSolarMonthDays:c,setSolarFestival:function(t){C(z,t)},setLunarFestival:function(t){C(G,t)}};"function"==typeof define?define(function(){return Z}):"object"==typeof exports?module.exports=Z:window.LunarCalendar=Z}();

const PopupBox = function(identifier, body) {
  if (!(this instanceof PopupBox)) return new PopupBox(identifier, body)
  this.vue = new Vue({
    data: {
      body: null,
      display: false,
      presented: false,
      identifier: null,
    },
    computed: {},
    watch: {},
    mounted () {},
    methods: {
      present(completion = _ => {}, animated = true) {

        this.$el || this.$mount() && document.body.append(this.$el)

        return animated
          ? setTimeout(_ => completion(this, this.presented = true), 100, this.display = true)
          : completion(this, this.presented = true, this.display = true), this

        return this
      },
      dismiss(completion = _ => {}, animated = true) {
        return animated
          ? setTimeout(_ => completion(this, this.display = false), 300, this.presented = false)
          : completion(this, this.presented = false, this.display = false), this
      },
    },
    template: El3(`
      div#popup-box => *if=display   :class={ __present: presented }
        div._cover => @click=_=>dismiss()
        div._box
          component => :is=identifier   @click=body.click   :value=body.value`).toString()
  })
  this.identifier(identifier).body(body)
}

PopupBox.prototype.identifier = function(identifier) { return typeof identifier == 'string' && (this.vue.identifier = identifier), this }
PopupBox.prototype.body = function(body) { return this.vue.body = body, this }
PopupBox.prototype.present = function(completion = _ => {}, animated = true) { return this.vue.present(completion, animated), this }
PopupBox.prototype.dismiss = function(completion = _ => {}, animated = true) { return this.vue.dismiss(completion, animated), this }

const DatePicker = function(date = null) { if (this instanceof DatePicker) return this._date = null, this._year = null, this._month = null, this._day = null, this.date = date, this; else return new DatePicker(date) }
Object.defineProperty(DatePicker.prototype, 'date', { set (val) { return val = val === null ? date('Y-m-d') : val, val = Array.isArray(val) ? val : val.split('-').map(t => parseInt(t, 10)), this._date = val.map(t => pad0(t, 2)).join('-'), this._year = val.shift(), this._month = val.shift(), this._day = val.shift(), this }})
Object.defineProperty(DatePicker.prototype, 'year', { get () { return this._year }})
Object.defineProperty(DatePicker.prototype, 'month', { get () { return this._month }})
Object.defineProperty(DatePicker.prototype, 'day', { get () { return this._day }})
Object.defineProperty(DatePicker.prototype, 'formally', { get () { return this.year + '年' + this.month + '月' + this.day + '日' }})
Object.defineProperty(DatePicker.prototype, 'pick', { get () { return (closure => { const box = PopupBox('calendar', { value: this, click: ({ year, month, day }) => box.dismiss(_ => (this.date = [year, month, day], typeof closure == 'function' && closure(this._date))) }).present() }).bind(this) }})
DatePicker.prototype.toString = function() { return this._date }

const TimePicker = function(time = null) { if (this instanceof TimePicker) return this._time = null, this._hour = null, this._min = null, this._sec = null, this.time = time, this; else return new TimePicker(time) }
Object.defineProperty(TimePicker.prototype, 'time', { set (val) { return val = val === null ? date('H:i:s') : val, val = Array.isArray(val) ? val : val.split(':').map(t => parseInt(t, 10)), this._time = val.map(t => pad0(t, 2)).join(':'), this._hour = val.shift(), this._min = val.shift(), this._sec = val.shift(), this }})
Object.defineProperty(TimePicker.prototype, 'hour', { get () { return this._hour }})
Object.defineProperty(TimePicker.prototype, 'min', { get () { return this._min }})
Object.defineProperty(TimePicker.prototype, 'sec', { get () { return this._sec }})
Object.defineProperty(TimePicker.prototype, 'formally', { get () { return (this.hour != 12 ? this.hour != 0 ? this.hour < 12 ? '上午' : '下午'  : '午夜' : '中午') + ' ' + this }})
Object.defineProperty(TimePicker.prototype, 'pick', { get () { return (_ => { const box = PopupBox('timepick', { value: this, click: ({ hour, min, sec }) => box.dismiss(_ => this.time = [hour, min, sec]) }).present() }).bind(this) }})
TimePicker.prototype.toString = function() { return this._time }

const Calculator = function(value = null) { if (this instanceof Calculator) return this._value = null, this.value = value, this; else return new Calculator(value) }
Object.defineProperty(Calculator.prototype, 'value', { set (value) { return this._value = '' + (value === null ? 0 : value), this }})
Object.defineProperty(Calculator.prototype, 'formally', { get () { return this.toString() }})
Object.defineProperty(Calculator.prototype, 'pick', { get () { return (_ => { const box = PopupBox('calculator', { value: this, click: value => box.dismiss(_ => this.value = value) }).present() }).bind(this) }})
Calculator.prototype.toString = function() { return this._value }

Vue.component('calendar', {
  props: {
    value: { type: DatePicker, default: null, required: true },
    inMonth: { type: Boolean, default: true, required: false }
  },
  data () {
    return {
      month: null,
      today: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      }
    }
  },
  mounted () {
    this.month = this.initMonth(this.value || this.today)
  },
  methods: {
    click (day) {
      if (this.inMonth && day.class.__not) return
      this.value.date = [day.year, day.month, day.day]
      return this.$emit('click', { year: day.year, month: day.month, day: day.day })
    },
    prevMonth: ({ year, month }) => ({ year: month == 1 ? year - 1 : year, month: month != 1 ? month - 1 : 12 }),
    nextMonth: ({ year, month }) => ({ year: month == 12 ? year + 1 : year, month: month != 12 ? month + 1 : 1 }),

    initMonth ({ year, month }) {
      const prev = this.prevMonth({ year, month })
      const next = this.nextMonth({ year, month })
      const monthDayCount = ({ year, month }) => (--month == 1) ? ((year % 4) === 0) && ((year % 100) !== 0) || ((year % 400) === 0) ? 29 : 28 : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
      const monthCount    = monthDayCount({ year, month })
      const firstDayWeek  = new Date(year, month - 1, 1).getDay()
      const weekCount     = parseInt((firstDayWeek + monthCount) / 7, 10) + (((firstDayWeek + monthCount) % 7) ? 1 : 0)

      return {
        year,
        month,
        lunar: {
          year: year - 1911,
          ganZhi: ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'][(year - 1900 + 36) % 10] + ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][(year - 1900 + 36) % 12],
          zodiac: ['鼠','牛','虎','兔','龍','蛇','馬','羊','猴','雞','狗','豬'][(year - 4) % 12],
        },
        weeks: Array.apply(null, Array(weekCount)).map((_, i) => Array.apply(null, Array(7)).map((_, j) => {
          const day = i * 7 + j - firstDayWeek + 1
          
          const data = {
            year: day > 0 ? day > monthCount ? next.year : year : prev.year,
            month: day > 0 ? day > monthCount ? next.month : month : prev.month,
            day: (day > 0 ? day > monthCount ? -monthCount : 0 : monthDayCount(prev)) + day,
          }

          const lunar = LunarCalendar.solarToLunar(data.year, data.month, data.day)
          
          data.class = {
            __not: day < 1 || day > monthCount,
            __today: this.today.year == data.year && this.today.month == data.month && this.today.day == data.day,
          }

          data.lunar = {
            year: lunar.GanZhiYear,
            month: lunar.GanZhiMonth,
            day: lunar.lunarDay == 1 ? lunar.lunarMonthName : lunar.lunarDayName
          }

          return data
        }))
      }
    }
  },
  computed: {
  },
  template: El3(`
    div.calendar => *if=month
      div._title
        label => @click=_ => month = initMonth(prevMonth(month))
        span => :year=month.year   :month=month.month
        label => @click=_ => month = initMonth(nextMonth(month))

      div._month
        div._week
          div._wd => *for=(day, i) in ['日', '一', '二', '三', '四', '五', '六']   :key=i   :title=day
        div._days => *for=(week, i) in month.weeks   :key=i
          label._dd => *for=(day, j) in week   :key=j   :china-day=day.lunar.day   :day=day.day   :class={ ...day.class, __select: value && value.year == day.year && value.month == day.month && value.day == day.day }   @click=click(day)
            i`).toString() })

Vue.component('timepick', {
  props: {
    value: { type: TimePicker, default: null, required: true }
  },
  data () {
    return {
      time: null,
      hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      mins: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
      secs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]
    }
  },
  mounted () {
    this.time = {
      hour: this.value ? this.value.hour : new Date().getHours(),
      min : this.value ? this.value.min  : new Date().getMinutes(),
      sec : this.value ? this.value.sec  : new Date().getSeconds()
    }
  },
  methods: {
    change () {
      return this.$emit('click', this.time)
    },
    click (type, val) {
      if (type == 'h') this.time.hour = this.time.hour + val < 24 ? this.time.hour + val > -1 ? this.time.hour + val : 23 : 0
      if (type == 'm') this.time.min = this.time.min + val < 60 ? this.time.min + val > -1 ? this.time.min + val : 59 : 0
      if (type == 's') this.time.sec = this.time.sec + val < 60 ? this.time.sec + val > -1 ? this.time.sec + val : 59 : 0
    },
  },
  computed: {
  },
  template: El3(`
    div.timepick => *if=time
      div.top
        label => @click=click('h', 1)
        label => @click=click('m', 1)
        label => @click=click('s', 1)

      div.middle
        select => *model=time.hour   @change=change
          option => *for=hour in hours   :key=hour   :value=hour   *text=pad0(hour)
        i
        select => *model=time.min   @change=change
          option => *for=min in mins   :key=min   :value=min   *text=pad0(min)
        i
        select => *model=time.sec   @change=change
          option => *for=sec in secs   :key=sec   :value=sec   *text=pad0(sec)

      div.bottom
        label => @click=click('h', -1)
        label => @click=click('m', -1)
        label => @click=click('s', -1)
      
      label.button => *text='確定'   @click=change`).toString() })

Vue.component('calculator', {
  props: {
    value: { type: Calculator, default: null, required: true }
  },
  data () {
    return {
      isOperator: '',
      nums: [1,2,3,4,5,6,7,8,9],
      values1: [],
      values2: [],
      nextClean: true
    }
  },
  mounted () {
    this.ac(this.value)
  },
  methods: {
    split: num => ('' + parseInt(num, 10)).trim().split('').filter(t => t !== ''),
    join: strs => parseInt(strs.join(''), 10),
    push (vals, num) { return vals.push(num), this.split(this.join(vals)) },
    ac (num) { this.values1 = this.split(num), this.values2 = [], this.isOperator = '' },
    equal () { return this.isOperator ? !this.values2.length ? this.isOperator = '' : this.calc() : this.$emit('click', this.join(this.values1)) },
    back () {
      if (this.values2.length) return this.values2.pop()
      if (this.isOperator) return this.isOperator = ''
      this.values1.length && this.values1.pop()
      this.values1.length || this.ac(0)
    },
    calc() {
      if (!(this.values1.length && this.isOperator && this.values2.length))
        return

      let val1 = this.join(this.values1)
      let val2 = this.join(this.values2)
      let val  = 0

      if (this.isOperator == '+') val = val1 + val2
      if (this.isOperator == '-') val = val1 - val2
      if (this.isOperator == '*') val = val1 * val2
      if (this.isOperator == '/') val = parseInt(val1 / val2, 10)
      if (val <= 0) val = 0

      this.ac(val)
    },
    operator (operator) {
      if (!['+', '-', '*', '/'].includes(operator)) return
      if (this.nextClean) this.nextClean = false
      this.isOperator && this.calc()
      this.isOperator = operator
    },
    num (num) {
      if (this.nextClean) return this.values1 = this.split(num), this.nextClean = false
      if (this.isOperator) this.values2 = this.push(this.values2, num)
      else this.values1 = this.push(this.values1, num)
    }
  },
  computed: {
  },
  template: El3(`
    div.calculator
      div.value
        span => *if=values1.length   *text=values1.join('')
        i    => *if=isOperator       :operator=isOperator
        span => *if=values2.length   *text=values2.join('')

      div.operator
        label.divide   => @click=operator('/')
        label.sub      => @click=operator('-')
        label.multiply => @click=operator('*')
        label.back     => @click=back

      div.other
        div.operant
          label.num => *for=(n, i) in nums   :key=i   *text=n   @click=num(n)
          label.ac  => @click=ac(0)   *text='清除'
          label.num => @click=num(0)   *text='0'
        div.button
          label.add   => @click=operator('+')
          label.equal => *if=isOperator   @click=equal
          label.ok    => *else   *text='確定'   @click=equal`).toString() })
