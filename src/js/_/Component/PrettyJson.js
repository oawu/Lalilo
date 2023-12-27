/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.VueComponent('test-rule', {
  props: {
    condition: { type: Api.Rule.Test.Condition, request: true }
  },
  template: `
    .test-rule
      template => *if=condition
        label
          b.title => *text=condition.title   :class={_optional: condition.test.optional}
          span.type => *text=condition.test.typeText
          template => *if=condition.descriptions.length
            i
            span.desc => *text=condition.description
        
        ul => *if=condition.children.length
          li => *for=(child, i) in condition.children   :key=i
            test-rule => :condition=child

      template => *else
        label
          b.title => *text='回應'
          i
          span.desc => *text='不需檢查。'
`
})

Load.VueComponent('pretty-json-count', { props: { count: { type: Number, request: true }}, template: `span.pj-count._ns => *text=count` })
Load.VueComponent('pretty-json-copy', { template: `span.pj-copy._ns => *text='複製'   @click.stop=$emit('copy')` })
Load.VueComponent('pretty-json-empty', { template: `span.pj-empty._ns` })
Load.VueComponent('pretty-json-colon', { template: `span.pj-colon._ns => *text=':'` })
Load.VueComponent('pretty-json-more', { template: `span.pj-more._ns => *text='…'` })
Load.VueComponent('pretty-json-comma', { template: `span.pj-comma._ns => *text=','` })
Load.VueComponent('pretty-json-square-left', { template: `span.pj-square-left._ns => *text='['` })
Load.VueComponent('pretty-json-square-right', { template: `span.pj-square-right._ns => *text=']'` })
Load.VueComponent('pretty-json-curly-left', { template: `span.pj-curly-left._ns => *text='{'` })
Load.VueComponent('pretty-json-curly-right', { template: `span.pj-curly-right._ns => *text='}'` })
Load.VueComponent('pretty-json-key', { props: { val: { type: String, request: true } }, computed: { text () { return `"${this.val}"` }}, template: `span.pj-key._ns => *text=text` })
Load.VueComponent('pretty-json-null', { template: `span.pj-null._ns => *text='null'` })
Load.VueComponent('pretty-json-num', { props: { val: { type: PrettyJson.Num, request: true } }, template: `span.pj-num._ns => *text=val` })
Load.VueComponent('pretty-json-str', { props: { val: { type: PrettyJson.Str, request: true } }, computed: { text () { return `"${this.val}"` }}, template: `span.pj-str._ns => *text=text` })
Load.VueComponent('pretty-json-bool', { props: { val: { type: PrettyJson.Bool, request: true } }, template: `span.pj-bool._ns => *text=val` })

Load.VueComponent('pretty-json-arr', {
  props: {
    obj: { type: PrettyJson.Arr, request: true },
    colon: { type: Boolean, request: true }
  },
  data: _ => ({
    display: true
  }),
  methods: {
    addColon(i) {
      return i < this.obj.elements.length - 1
    },
    copyArr () {
      copy(this.obj.toStructString(), _ => Toastr.success('已複製！'), _ => Toastr.failure('複製失敗'))
    },
    copyKeyVal (item, colon) {
      if (!['null', 'num', 'str', 'bool'].includes(item.type)) return Toastr.failure('複製失敗')
      copy(`${item.toStructString()}${colon ? ',' : ''}`, _ => Toastr.success('已複製！'), _ => Toastr.failure('複製失敗'))
    }
  },
  template: `
    .pj-arr
      div.pj-r0 => @click=display=!display
        label
          slot => name=key
          pretty-json-square-left
          pretty-json-count => *if=display   :count=obj.elements.length
          pretty-json-more => *else
        pretty-json-copy => @copy=copyArr

      .pj-r1 => *if=display
        div => *for=(item, i) in obj.elements   :key=i
          .pj-els => *if=['null', 'num', 'str', 'bool'].includes(item.type)
            pretty-json-null => *if=item.type == 'null'
            pretty-json-num => *if=item.type == 'num'   :val=item.val
            pretty-json-str => *if=item.type == 'str'   :val=item.val
            pretty-json-bool => *if=item.type == 'bool'   :val=item.val
            pretty-json-comma => *if=addColon(i)
            pretty-json-copy => @copy=copyKeyVal(item, addColon(i))

          pretty-json-arr => *if=item.type == 'arr'   :obj=item   :colon=addColon(i)
          
          pretty-json-obj => *if=item.type == 'obj'   :obj=item   :colon=addColon(i)
          
      .pj-r2
        pretty-json-square-right
        pretty-json-comma => *if=colon
    `

})
Load.VueComponent('pretty-json-obj', {
  props: {
    obj: { type: PrettyJson.Obj, request: true },
    colon: { type: Boolean, request: true }
  },
  data: _ => ({
    display: true
  }),
  methods: {
    addColon(i) {
      return i < this.obj.keyVals.length - 1
    },
    copyObj () {
      copy(this.obj.toStructString(), _ => Toastr.success('已複製！'), _ => Toastr.failure('複製失敗'))
    },
    copyKeyVal (key, item, colon) {
      if (!['null', 'num', 'str', 'bool'].includes(item.type)) return Toastr.failure('複製失敗')
      copy(`"${key}": ${item.toStructString()}${colon ? ',' : ''}`, _ => Toastr.success('已複製！'), _ => Toastr.failure('複製失敗'))
    }
  },
  template: `
    .pj-obj
      div.pj-r0 => @click=display=!display
        label
          slot => name=key
          pretty-json-curly-left
          pretty-json-more => *if=!display
        pretty-json-copy => @copy=copyObj

      .pj-r1 => *if=display
        div => *for=({ key, val: item }, i) in obj.keyVals   :key=i
          .pj-kvs => *if=['null', 'num', 'str', 'bool'].includes(item.type)
            pretty-json-key => :val=key
            pretty-json-colon
            pretty-json-null => *if=item.type == 'null'
            pretty-json-num => *if=item.type == 'num'   :val=item.val
            pretty-json-str => *if=item.type == 'str'   :val=item.val
            pretty-json-bool => *if=item.type == 'bool'   :val=item.val
            pretty-json-comma => *if=addColon(i)
            pretty-json-copy => @copy=copyKeyVal(key, item, addColon(i))


          pretty-json-arr => *if=item.type == 'arr'   :obj=item   :colon=addColon(i)
            template => slot=key
              pretty-json-key => :val=key
              pretty-json-colon

          pretty-json-obj => *if=item.type == 'obj'   :obj=item   :colon=addColon(i)
            template => slot=key
              pretty-json-key => :val=key
              pretty-json-colon

      .pj-r2
        pretty-json-curly-right
        pretty-json-comma => *if=colon
  `
})
Load.VueComponent('pretty-json', {
  props: {
    json: { type: PrettyJson, request: true },
  },
  data: _ => ({
  }),
  methods: {
  },
  template: `
    .pretty-json
      template => *if=json
        pretty-json-obj  => *if=json.pretty.type == 'obj'   :obj=json.pretty
        pretty-json-arr  => *if=json.pretty.type == 'arr'   :obj=json.pretty
        pretty-json-null => *if=json.pretty.type == 'null'
        pretty-json-num  => *if=json.pretty.type == 'num'   :val=json.pretty.val
        pretty-json-str  => *if=json.pretty.type == 'str'   :val=json.pretty.val
        pretty-json-bool => *if=json.pretty.type == 'bool'   :val=json.pretty.val
      pretty-json-empty => *else
  `
})
