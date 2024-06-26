/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

// ======== App.Emu
  App.Emu = function(params, data = undefined) {
    if (window.Bridge.type !== 'Web') {
      return console.error(`🔴 App.Emu 錯誤，沒有 window.Bridge.type 必須為 Web`)
    }

    if (!App._T.obj(params)) {
      return console.error(`🔴 App.Emu 格式錯誤，不是物件格式`)
    }
    
    if (!App._T.neStr(params.type)) {
      return console.error(`🔴 App.Emu 格式錯誤，沒有 Type`)
    }

    if (params.type == 'App.Action.Func') { return App.Emu.Action.Func(params.struct, params.completion, params.done, data) }
    if (params.type == 'App.Action.Emit') { return App.Emu.Action.Emit(params.struct, params.completion, params.done, data) }
    
    if (params.type == 'App.Feedback') { return App.Emu.Feedback(params.struct, params.completion, params.done) }
    if (params.type == 'App.OnScroll') { return App.Emu.OnScroll(params.struct, params.completion, params.done) }
    
    if (params.type == 'App.Alert') { return App.Emu.Alert(params.struct, params.completion, params.done) }

    if (params.type == 'App.HUD.Show') { return App.Emu.HUD.Show(params.struct, params.completion, params.done) }
    if (params.type == 'App.HUD.Change') { return App.Emu.HUD.Change(params.struct, params.completion, params.done) }
    if (params.type == 'App.HUD.Hide') { return App.Emu.HUD.Hide(params.struct, params.completion, params.done) }
    if (params.type == 'App.HUD.SetProgress') { return App.Emu.HUD.SetProgress(params.struct, params.completion, params.done) }

    if (params.type == 'App.YoutubePlayer.Show') { return App.Emu.YoutubePlayer.Show(params.struct, params.completion, params.done) }
    if (params.type == 'App.YoutubePlayer.Close') { return App.Emu.YoutubePlayer.Close(params.struct, params.completion, params.done) }

    if (params.type == 'App.VC.Close') { return App.Emu.VC.Close(params.struct, params.completion, params.done) }
    if (params.type == 'App.VC.Mounted') { return App.Emu.VC.Mounted(params.struct, params.completion, params.done) }
    if (params.type == 'App.VC.Present') { return App.Emu.VC.Present(params.struct, params.completion, params.done) }
    if (params.type == 'App.VC.Dismiss') { return App.Emu.VC.Dismiss(params.struct, params.completion, params.done) }

    if (params.type == 'App.VC.Nav.Push') { return App.Emu.VC.Nav.Push(params.struct, params.completion, params.done) }
    if (params.type == 'App.VC.Nav.Pop') { return App.Emu.VC.Nav.Pop(params.struct, params.completion, params.done) }
    if (params.type == 'App.VC.Nav.Bar.Hidden') { return App.Emu.VC.Nav.Bar.Hidden(params.struct, params.completion, params.done) }
    if (params.type == 'App.VC.Nav.Bar.Appearance') { return App.Emu.VC.Nav.Bar.Appearance(params.struct, params.completion, params.done) }
    if (params.type == 'App.VC.Nav.Bar.Title') { return App.Emu.VC.Nav.Bar.Title(params.struct, params.completion, params.done) }
    if (params.type == 'App.VC.Nav.Bar.Button.Left') { return App.Emu.VC.Nav.Bar.Button.Left(params.struct, params.completion, params.done) }
    if (params.type == 'App.VC.Nav.Bar.Button.Right') { return App.Emu.VC.Nav.Bar.Button.Right(params.struct, params.completion, params.done) }

    if (params.type == 'App.VC.Tab.Bar.Appearance') { return App.Emu.VC.Tab.Bar.Appearance(params.struct, params.completion, params.done) }
    if (params.type == 'App.VC.Tab.Bar.Title') { return App.Emu.VC.Tab.Bar.Title(params.struct, params.completion, params.done) }

    if (params.type == 'App.GPS.Start') { return App.Emu.GPS.Start(params.struct, params.completion, params.done) }
    if (params.type == 'App.GPS.Stop') { return App.Emu.GPS.Stop(params.struct, params.completion, params.done) }
    
    if (params.type == 'App.GPS.Require.WhenInUse') { return App.Emu.GPS.Require.WhenInUse(params.struct, params.completion, params.done) }
    if (params.type == 'App.GPS.Require.Always') { return App.Emu.GPS.Require.Always(params.struct, params.completion, params.done) }
    if (params.type == 'App.GPS.Refresh.Status') { return App.Emu.GPS.Refresh.Status(params.struct, params.completion, params.done) }
    if (params.type == 'App.GPS.Refresh.Location') { return App.Emu.GPS.Refresh.Location(params.struct, params.completion, params.done) }
    if (params.type == 'App.GPS.Refresh.isRunning') { return App.Emu.GPS.Refresh.isRunning(params.struct, params.completion, params.done) }
    if (params.type == 'App.GPS.Get.Status') { return App.Emu.GPS.Get.Status(params.struct, params.completion, params.done) }
    if (params.type == 'App.GPS.Get.Location') { return App.Emu.GPS.Get.Location(params.struct, params.completion, params.done) }
    if (params.type == 'App.GPS.Get.isRunning') { return App.Emu.GPS.Get.isRunning(params.struct, params.completion, params.done) }

    return console.error(`🔴 App.Emu 格式錯誤，沒有符合的 Type，Type：${params.type}`)
  }

  App.Emu._ActionStr = obj => App._T.obj(obj)
    ? ['App.Action.Emit', 'App.Action.Func'].includes(obj.type)
      ? `{ type: ${obj.type}, ${
          obj.type == 'App.Action.Emit'
          ? App.Emu._ActionEmitStr(obj.struct)
          : App.Emu._ActionFuncStr(obj.struct)
        } }`
      : '{...}'
    : 'null'

  App.Emu._ActionFuncStr = struct => `id: ${struct.id}`

  App.Emu._ActionEmitStr = struct => `goal: ${struct.goal}, key: ${struct.key}, param: ${struct.param}`

  // ======== App.Emu.Action
    App.Emu.Action = function() {}

    // ======== App.Emu.Action.Emit
      App.Emu.Action.Emit = function(struct, completion, done, data = undefined) {
        const _title = `App.Emu.Action.Emit`

        if (!App._T.obj(struct)) {
          return console.error(`🔴 ${_title} 格式錯誤，不是物件格式`)
        }
        if (!App.Action.Emit.isGoal(struct.goal)) {
          return console.error(`🔴 ${_title} 格式錯誤，goal 錯誤`)
        }
        if (struct.goal == App._ActionEmitGoalEnum[1]) {
          return console.log(`⚠️ 上一個頁面執行。`)
        }
        if (!App._T.neStr(struct.key)) {
          return console.error(`🔴 ${_title} 格式錯誤，key 錯誤`)
        }
        
        
        setTimeout(_ => {
          const str = `App.Bridge.Exec.emit("${struct.key}", ${data}, ${struct.param})`

          try {
            eval(str)
            console.error(`${str} - ok`)

            Toastr.success({
              title: _title,
              items: [
                `${App.Emu._ActionEmitStr(struct)}`,
              ]
            })
          } catch(_) {
            console.error(`${str} - err - ${_}`)
          }

          App._T.obj(completion) && App.Emu(completion)
        }, 150)
        
        return App._T.obj(done) && App.Emu(done)
      }

    // ======== App.Emu.Action.Func
      App.Emu.Action.Func = function(struct, completion, done, data = undefined) {
        const _title = 'App.Emu.Action.Func'
        if (!App._T.obj(struct)) {
          return console.error(`🔴 ${_title} 格式錯誤，不是物件格式`)
        }
        if (!App._T.num(struct.id)) {
          return console.error(`🔴 ${_title} 格式錯誤，id 錯誤`)
        }

        setTimeout(_ => {
          const str = `App.Bridge.Exec.func(${struct.id}, ${data})`
          
          try {
            eval(str)
            console.error(`${str} - ok`)

            Toastr.success({
              title: _title,
              items: [
                `${App.Emu._ActionFuncStr(struct)}`,
              ]
            })
          } catch(_) {
            console.error(`${str} - err - ${_}`)
          }

          App._T.obj(completion) && App.Emu(completion)
        }, 150)
        
        return App._T.obj(done) && App.Emu(done)
      }

  // ======== App.Emu.Feedback
    App.Emu.Feedback = function(struct, completion, done) {
      const __title = `App.Emu.Feedback`

      if (!(App._T.neStr(struct) && App._FeedbackEnum.includes(struct))) {
        return console.error(`🔴 ${__title} 格式錯誤，Style 錯誤`)
      }

      const _style = struct
      const _completion = App.Emu._ActionStr(completion)

      Toastr.success({
        title: __title,
        items: [
          `Style："${_style}"`,
          `Completion：${_completion}`,
        ]
      })

      App._T.obj(done) && App.Emu(done)
    }

  // ======== App.Emu.OnScroll
    App.Emu.OnScroll = function(struct, completion, done) {
      const __title = `App.Emu.OnScroll`

      if (!App._T.obj(struct)) {
        return console.error(`🔴 ${__title} 格式錯誤，不是物件格式`)
      }

      const _scrollTop = struct.scrollTop
      const _clientHeight = struct.clientHeight
      const _scrollHeight = struct.scrollHeight

      if (!App._T.num(_scrollTop) || !App._T.num(_clientHeight) || !App._T.num(_scrollHeight)) {
        return console.error(`🔴 ${__title} 格式錯誤，Offset 錯誤`)
      }

      const _completion = App.Emu._ActionStr(completion)

      Toastr.success({
        title: __title,
        items: [
          `ScrollTop：${_scrollTop}`,
          `ClientHeight：${_clientHeight}`,
          `ScrollHeight：${_scrollHeight}`,
          `Completion：${_completion}`,
        ]
      })

      App._T.obj(done) && App.Emu(done)
    }

  // ======== App.Emu.Alert
    App.Emu.Alert = function(struct, completion, done) {
      const __title = `App.Emu.Alert`

      if (!App._T.obj(struct)) {
        return console.error(`🔴 ${__title} 格式錯誤，不是物件格式`)
      }

      const _title  = App._T.str(struct.title) ? struct.title : null
      const _message = App._T.str(struct.message) ? struct.message : null
      const _isAnimated = App._T.bool(struct.isAnimated) ? struct.isAnimated : true

      const inputs = (Array.isArray(struct.inputs) ? struct.inputs : []).filter(input => App._T.obj(input))
      const buttons = (Array.isArray(struct.buttons) ? struct.buttons : []).filter(button => App._T.obj(button) && App._T.neStr(button.text))
      const _completion = App.Emu._ActionStr(completion)

      if (_title === null && _message === null && buttons.length <= 0) {
        return console.error(`🔴 ${__title} 格式錯誤，沒有滿足出現的條件`)
      }

      let alert = Alert(_title, _message)
      for (let button of buttons) {
        alert.button(button.text, (alert, ...inputs) => {
          try {
            inputs = JSON.stringify(inputs)
          } catch (e) {
            inputs = e
          }

          if (inputs instanceof Error) {
            inputs = '[]'
          }

          alert.dismiss(_ => App._T.obj(button.click) && App.Emu(button.click, inputs))
        }, App._T.bool(button.isDestructive) ? button.isDestructive : false, App._T.bool(button.isPreferred) ? button.isPreferred : false)
      }
      for (let input of inputs) {
        alert.input(App._T.str(input.value) ? input.value : '', App._T.str(input.placeholder) ? input.placeholder : '')
      }
      alert.present(_ => App._T.obj(completion) && App.Emu(completion), _isAnimated)

      Toastr.success({
        title: __title,
        items: [
          `Title：${_title === null ? 'null' : `"${_title}"`}`,
          `Message：${_message === null ? 'null' : `"${_message}"`}`,
          `IsAnimated：${_isAnimated}`,
          `Completion：${_completion}`,
          ...buttons.map((button, i) => {
            return [
              `Button[${i}].text：${button.text}`,
              `Button[${i}].click：${App.Emu._ActionStr(button.click)}`,
              `Button[${i}].isDestructive：${App._T.bool(button.isDestructive) && button.isDestructive ? 'true' : 'false'}`,
              `Button[${i}].isPreferred：${App._T.bool(button.isPreferred) && button.isPreferred ? 'true' : 'false'}`,
            ]
          }).reduce((a, b) => a.concat(b), [])
        ]
      })

      App._T.obj(done) && App.Emu(done)
    }

  // ======== App.Emu.HUD
    App.Emu.HUD = function() {}
    // ======== App.Emu.HUD.Show
      App.Emu.HUD.Show = function(struct, completion, done) {
        const __title = `App.Emu.HUD.Show`
        if (!App._T.obj(struct)) {
          return console.error(`🔴 ${__title} 格式錯誤，不是物件格式`)
        }
        
        const _icon = App._T.neStr(struct.icon) && App.HUD.Icons.includes(struct.icon) ? struct.icon : ''
        if (_icon === '') {
          return console.error(`🔴 ${__title} 格式錯誤，icon 格式有誤`)
        }

        const _title       = App._T.str(struct.title) ? struct.title : ''
        const _description = App._T.str(struct.description) ? struct.description : true
        const _isAnimated  = App._T.bool(struct.isAnimated) ? struct.isAnimated : true
        const _completion  = App.Emu._ActionStr(completion)
        
        Toastr.success({
          title: __title,
          items: [
            `Icon：${_icon}`,
            `Title："${_title}"`,
            `Description："${_description}"`,
            `isAnimated：${_isAnimated ? 'true' : 'false'}`,
            `Completion：${_completion}`,
          ]
        })
        
        return App._T.obj(done) && App.Emu(done)
      }
    // ======== App.Emu.HUD.Change
      App.Emu.HUD.Change = function(struct, completion, done) {
        const __title = `App.Emu.HUD.Change`
        if (!App._T.obj(struct)) {
          return console.error(`🔴 ${__title} 格式錯誤，不是物件格式`)
        }
        
        const _icon = App._T.neStr(struct.icon) && App.HUD.Icons.includes(struct.icon) ? struct.icon : ''
        
        if (_icon === '') {
          return console.error(`🔴 ${__title} 格式錯誤，icon 格式有誤`)
        }

        const _title       = App._T.str(struct.title) ? struct.title : ''
        const _description = App._T.str(struct.description) ? struct.description : true
        const _completion  = App.Emu._ActionStr(completion)

        Toastr.success({
          title: __title,
          items: [
            `Icon：${_icon}`,
            `Title："${_title}"`,
            `Description："${_description}"`,
            `Completion：${_completion}`,
          ]
        })
        
        return App._T.obj(done) && App.Emu(done)
      }
    // ======== App.Emu.HUD.Hide
      App.Emu.HUD.Hide = function(struct, completion, done) {
        const _title = `App.Emu.HUD.Hide`
        if (!App._T.obj(struct)) {
          return console.error(`🔴 ${_title} 格式錯誤，不是物件格式`)
        }
        
        const _delay      = App._T.num(struct.delay) && struct.delay >= 0 ? struct.delay : 0
        const _isAnimated = App._T.bool(struct.isAnimated) ? struct.isAnimated : true
        const _completion = App.Emu._ActionStr(completion)

        Toastr.success({
          title: _title,
          items: [
            `Delay：${_delay}`,
            `isAnimated：${_isAnimated ? 'true' : 'false'}`,
            `Completion：${_completion}`,
          ]
        })
        
        return App._T.obj(done) && App.Emu(done)
      }
    // ======== App.Emu.HUD.SetProgress
      App.Emu.HUD.SetProgress = function(struct, completion, done) {
        const _title = `App.Emu.HUD.SetProgress`
        if (!App._T.obj(struct)) {
          return console.error(`🔴 ${_title} 格式錯誤，不是物件格式`)
        }
        
        const _percent    = App._T.num(struct.percent) && struct.percent >= 0 ? struct.percent : 0
        const _completion = App.Emu._ActionStr(completion)
        
        Toastr.success({
          title: _title,
          items: [
            `Percent：${_percent}`,
            `Completion：${_completion}`,
          ]
        })
        
        return App._T.obj(done) && App.Emu(done)
      }

  // ======== App.Emu.YoutubePlayer
    App.Emu.YoutubePlayer = function() {}

    // ======== App.Emu.YoutubePlayer.Show
      App.Emu.YoutubePlayer.Show = function(struct, completion, done) {
        const _title = `App.Emu.YoutubePlayer.Show`

        if (!App._T.obj(struct)) {
          return console.error(`🔴 ${_title} 格式錯誤，不是物件格式`)
        }

        if (!App._T.neStr(struct.vid)) {
          return console.error(`🔴 ${_title} 格式錯誤，vid 錯誤`)
        }

        if (!App._T.obj(struct.on)) {
          return console.error(`🔴 ${_title} 格式錯誤，on 錯誤`)
        }

        const _vid        = struct.vid
        const _ref        = App._T.str(struct.ref) ? struct.ref : ''
        const _timeout    = App._T.num(struct.timeout) && struct.timeout >= 0 ? struct.timeout : 0
        const _onTimeout  = App.Emu._ActionStr(struct.on.timeout)
        const _onError    = App.Emu._ActionStr(struct.on.error)
        const _onPlay     = App.Emu._ActionStr(struct.on.play)
        const _onClose    = App.Emu._ActionStr(struct.on.close)
        const _completion = App.Emu._ActionStr(completion)

        Toastr.success({
          title: _title,
          items: [
            `Vid："${_vid}"`,
            `Ref："${_ref}"`,
            `Timeout：${_timeout}`,
            `On.timeout：${_onTimeout}`,
            `On.error：${_onError}`,
            `On.play：${_onPlay}`,
            `On.close：${_onClose}`,
            `Completion：${_completion}`,
          ]
        })
        return App._T.obj(done) && App.Emu(done)
      }

    // ======== App.Emu.YoutubePlayer.Close
      App.Emu.YoutubePlayer.Close = function(struct, completion, done) {
        const _title = `App.Emu.YoutubePlayer.Close`
        
        const _completion = App.Emu._ActionStr(completion)

        Toastr.success({
          title: _title,
          items: [
            `Completion：${_completion}`,
          ]
        })
        App._T.obj(done) && App.Emu(done)
        return
      }

  // ======== App.Emu.VC
    App.Emu.VC = function() {}
    // ======== App.Emu.VC.Present
      App.Emu.VC.Present = function(struct, completion, done) {
        const _title = `App.Emu.VC.Present`
        if (!App._T.obj(struct)) {
          return console.error(`🔴 ${_title} 格式錯誤，不是物件格式`)
        }

        const _type = App._T.str(struct.type) ? struct.type : null

        if (!(_type !== null && ['webView'].includes(_type))) {
          return console.error(`🔴 ${_title} 格式錯誤，Type 錯誤`)
        }

        const _isAnimated   = App._T.bool(struct.isAnimated) ? struct.isAnimated : true
        const _isFullScreen = App._T.bool(struct.isFullScreen) ? struct.isFullScreen : false
        const _completion   = App.Emu._ActionStr(completion)
        
        const _nav = App._T.obj(struct.nav) ? `{ ${[
          `barHidden: ${App._T.bool(struct.nav.barHidden) && struct.nav.barHidden ? 'true' : 'false'}`,
          `barAppearance: "${App._T.neStr(struct.nav.barAppearance) && App._NavBarAppearance.includes(struct.nav.barAppearance) ? struct.nav.barAppearance : App._NavBarAppearance[0]}"`,
          `barTitle: "${App._T.str(struct.nav.barTitle) ? struct.nav.barTitle : ''}"`,
          `barLeft: { text: "${App._T.obj(struct.nav.barLeft) && App._T.str(struct.nav.barLeft.text) ? struct.nav.barLeft.text : ''}", click: ${App.Emu._ActionStr(struct.nav.barLeft.click)} }`,
          `barRight: { text: "${App._T.obj(struct.nav.barRight) && App._T.str(struct.nav.barRight.text) ? struct.nav.barRight.text : ''}", click: ${App.Emu._ActionStr(struct.nav.barRight.click)} }`,
        ].join(', ')} }` : 'null'


        const _tab = `{ ${[
          `barAppearance: "${App._T.neStr(struct.tab.barAppearance) && App._TabBarAppearance.includes(struct.tab.barAppearance) ? struct.tab.barAppearance : App._TabBarAppearance[0]}"`,
          `barTitle: ${App._T.str(struct.tab.barTitle) ? `"${struct.tab.barTitle}"` : 'null'}`,
        ].join(', ')} }`


        if (_type == 'webView') {
          const _url = App._T.url(struct.url) ? struct.url : null

          if (_url === null) {
            return console.error(`🔴 ${_title} 格式錯誤，Url 錯誤`)
          }

          Toastr.success({
            title: _title,
            items: [
              `View：WebView`,
              `Url：${_url}`,
              `Nav：${_nav}`,
              `Tab：${_tab}`,
              `isAnimated：${_isAnimated ? 'true' : 'false'}`,
              `isFullScreenl：${_isFullScreen ? 'true' : 'false'}`,
              `Completion：${_completion}`,
            ]
          })
          
          return App._T.obj(done) && App.Emu(done)
        }

        return console.error(`🔴 ${_title} 格式錯誤，沒有符合的 Type，Type：${struct.type}`)
      }

    // ======== App.Emu.VC.Dismiss
      App.Emu.VC.Dismiss = function(struct, completion, done) {
        const _title = `App.Emu.VC.Dismiss`
        if (!App._T.obj(struct)) {
          return console.error(`🔴 ${_title} 格式錯誤，不是物件格式`)
        }
        
        const _isAnimated = App._T.bool(struct.isAnimated) ? struct.isAnimated : true
        const _completion = App.Emu._ActionStr(completion)

        Toastr.success({
          title: _title,
          items: [
            `isAnimated：${_isAnimated ? 'true' : 'false'}`,
            `Completion：${_completion}`,
          ]
        })

        return App._T.obj(done) && App.Emu(done)
      }

    // ======== App.Emu.VC.Close
      App.Emu.VC.Close = function(struct, completion, done) {
        const _title = `App.Emu.VC.Close`
        if (!App._T.obj(struct)) {
          return console.error(`🔴 ${_title} 格式錯誤，不是物件格式`)
        }
        
        const _isAnimated = App._T.bool(struct.isAnimated) ? struct.isAnimated : true
        const _completion = App.Emu._ActionStr(completion)

        Toastr.success({
          title: _title,
          items: [
            `isAnimated：${_isAnimated ? 'true' : 'false'}`,
            `Completion：${_completion}`,
          ]
        })
        return App._T.obj(done) && App.Emu(done)
      }

    // ======== App.Emu.VC.Mounted
      App.Emu.VC.Mounted = function(struct, completion, done) {
        const _title = `App.Emu.VC.Mounted`
        
        const _completion = App.Emu._ActionStr(completion)

        Toastr.success({
          title: _title,
          items: [
            `Completion：${_completion}`,
          ]
        })
        
        App._T.obj(completion) && App.Emu(completion)
        return App._T.obj(done) && App.Emu(done)
      }

    // ======== App.Emu.VC.Nav
      App.Emu.VC.Nav = function() {}

      // ======== App.Emu.VC.Nav.Push
        App.Emu.VC.Nav.Push = function(struct, completion, done) {
          const _title = `App.Emu.VC.Nav.Push`
          if (!App._T.obj(struct)) {
            return console.error(`🔴 ${_title} 格式錯誤，不是物件格式`)
          }
          if (!App._T.obj(struct.nav)) {
            return console.error(`🔴 ${_title} nav 格式錯誤，不是物件格式`)
          }
          
          const _type = App._T.str(struct.type) ? struct.type : null

          if (!(_type !== null && ['webView'].includes(_type))) {
            return console.error(`🔴 ${_title} 格式錯誤，Type 錯誤`)
          }

          const _isAnimated = App._T.bool(struct.isAnimated) ? struct.isAnimated : true
          
          const _nav = `{ ${[
            `barHidden: ${App._T.bool(struct.nav.barHidden) && struct.nav.barHidden ? 'true' : 'false'}`,
            `barAppearance: "${App._T.neStr(struct.nav.barAppearance) && App._NavBarAppearance.includes(struct.nav.barAppearance) ? struct.nav.barAppearance : App._NavBarAppearance[0]}"`,
            `barTitle: "${App._T.str(struct.nav.barTitle) ? struct.nav.barTitle : ''}"`,
            `barLeft: { text: "${App._T.obj(struct.nav.barLeft) && App._T.str(struct.nav.barLeft.text) ? struct.nav.barLeft.text : ''}", click: ${App.Emu._ActionStr(struct.nav.barLeft.click)} }`,
            `barRight: { text: "${App._T.obj(struct.nav.barRight) && App._T.str(struct.nav.barRight.text) ? struct.nav.barRight.text : ''}", click: ${App.Emu._ActionStr(struct.nav.barRight.click)} }`,
          ].join(', ')} }`

          const _tab = `{ ${[
            `barAppearance: "${App._T.neStr(struct.tab.barAppearance) && App._TabBarAppearance.includes(struct.tab.barAppearance) ? struct.tab.barAppearance : App._TabBarAppearance[0]}"`,
            `barTitle: ${App._T.str(struct.tab.barTitle) ? `"${struct.tab.barTitle}"` : 'null'}`,
          ].join(', ')} }`

          const _completion = App.Emu._ActionStr(completion)

          if (_type == 'webView') {
            const _url = App._T.url(struct.url) ? struct.url : null

            if (_url === null) {
              return console.error(`🔴 ${_title} 格式錯誤，Url 錯誤`)
            }

            Toastr.success({
              title: _title,
              items: [
                `View：WebView`,
                `Url：${_url}`,
                `Nav：${_nav}`,
                `Tab：${_tab}`,
                `isAnimated：${_isAnimated ? 'true' : 'false'}`,
                `Completion：${_completion}`,
              ]
            })

            return App._T.obj(done) && App.Emu(done)
          }

          return console.error(`🔴 ${_title} 格式錯誤，沒有符合的 Type，Type：${struct.type}`)
        }

      // ======== App.Emu.VC.Nav.Pop
        App.Emu.VC.Nav.Pop = function(struct, completion, done) {
          const _title = `App.Emu.VC.Nav.Pop`
          if (!App._T.obj(struct)) {
            return console.error(`🔴 ${_title} 格式錯誤，不是物件格式`)
          }
          
          const _isAnimated = App._T.bool(struct._isAnimated) ? struct.isAnimated : true
          const _completion = App.Emu._ActionStr(completion)

          Toastr.success({
            title: _title,
            items: [
              `isAnimated：${_isAnimated ? 'true' : 'false'}`,
              `Completion：${_completion}`,
            ]
          })
          return App._T.obj(done) && App.Emu(done)
        }

      // ======== App.Emu.VC.Nav.Bar
        App.Emu.VC.Nav.Bar = function() {}
        // ======== App.Emu.VC.Nav.Bar.Hidden
          App.Emu.VC.Nav.Bar.Hidden = function(struct, completion, done) {
            const _title = `App.Emu.VC.Nav.Bar.Hidden`
            if (!App._T.obj(struct)) {
              return console.error(`🔴 ${_title} 格式錯誤，不是物件格式`)
            }

            const _isHidden   = App._T.bool(struct.isHidden) ? struct.isHidden : true
            const _isAnimated = App._T.bool(struct.isAnimated) ? struct.isAnimated : true
            const _completion = App.Emu._ActionStr(completion)

            Toastr.success({
              title: _title,
              items: [
                `isHidden：${_isHidden ? 'true' : 'false'}`,
                `isAnimated：${_isAnimated ? 'true' : 'false'}`,
                `Completion：${_completion}`,
              ]
            })
            App._T.obj(done) && App.Emu(done)
            return 
          }
        
        // ======== App.Emu.VC.Nav.Bar.Appearance
          App.Emu.VC.Nav.Bar.Appearance = function(struct, completion, done) {
            const _title = `App.Emu.VC.Nav.Bar.Appearance`
            if (!App._T.obj(struct)) {
              return console.error(`🔴 ${_title} 格式錯誤，不是物件格式`)
            }

            const _style = App._T.neStr(struct.style)&& App._NavBarAppearance.includes(struct.style) ? struct.style : true
            const _completion = App.Emu._ActionStr(completion)
 
            Toastr.success({
              title: _title,
              items: [
                `Style：${_style}`,
                `Completion：${_completion}`,
              ]
            })
            App._T.obj(done) && App.Emu(done)
            return 
          }
        
        // ======== App.Emu.VC.Nav.Bar.Title
          App.Emu.VC.Nav.Bar.Title = function(struct, completion, done) {
            const _title = `App.Emu.VC.Nav.Bar.Title`
            if (!App._T.obj(struct)) {
              return console.error(`🔴 ${_title} 格式錯誤，不是物件格式`)
            }
            
            const _text       = App._T.str(struct.text) ? struct.text : ''
            const _completion = App.Emu._ActionStr(completion)

            Toastr.success({
              title: _title,
              items: [
                `Text："${_text}"`,
                `Completion：${_completion}`,
              ]
            })
            
            return App._T.obj(done) && App.Emu(done)
          }
        
        // ======== App.Emu.VC.Nav.Bar.Button
          App.Emu.VC.Nav.Bar.Button = function(){}

          // ======== App.Emu.VC.Nav.Bar.Button.Left
            App.Emu.VC.Nav.Bar.Button.Left = function(struct, completion, done) {
              const _title = `App.Emu.VC.Nav.Bar.Button.Left`

              if (!App._T.obj(struct)) {
                return console.error(`🔴 ${_title} 格式錯誤，不是物件格式`)
              }

              const _text       = App._T.str(struct.text) ? struct.text : ''
              const _click      = App.Emu._ActionStr(struct.click)
              const _completion = App.Emu._ActionStr(completion)

              Toastr.success({
                title: _title,
                items: [
                  `Text："${_text}"`,
                  `Click：${_click}`,
                  `Completion：${_completion}`,
                ]
              })

              return App._T.obj(done) && App.Emu(done)
            }

          // ======== App.Emu.VC.Nav.Bar.Button.Right
            App.Emu.VC.Nav.Bar.Button.Right = function(struct, completion, done) {
              const _title = `App.Emu.VC.Nav.Bar.Button.Right`
              
              if (!App._T.obj(struct)) {
                return console.error(`🔴 ${_title} 格式錯誤，不是物件格式`)
              }

              const _text       = App._T.str(struct.text) ? struct.text : ''
              const _click      = App.Emu._ActionStr(struct.click)
              const _completion = App.Emu._ActionStr(completion)

              Toastr.success({
                title: _title,
                items: [
                  `Text："${_text}"`,
                  `Click：${_click}`,
                  `Completion：${_completion}`,
                ]
              })
              
              return App._T.obj(done) && App.Emu(done)
            }

    // ======== App.Emu.VC.Tab
      App.Emu.VC.Tab = function() {}

      // ======== App.Emu.VC.Tab.Bar
        App.Emu.VC.Tab.Bar = function() {}
        // ======== App.Emu.VC.Tab.Bar.Appearance
          App.Emu.VC.Tab.Bar.Appearance = function(struct, completion, done) {
            const _title = `App.Emu.VC.Tab.Bar.Appearance`
            if (!App._T.obj(struct)) {
              return console.error(`🔴 ${_title} 格式錯誤，不是物件格式`)
            }

            const _style = App._T.neStr(struct.style)&& App._TabBarAppearance.includes(struct.style) ? struct.style : true
            const _completion = App.Emu._ActionStr(completion)
 
            Toastr.success({
              title: _title,
              items: [
                `Style：${_style}`,
                `Completion：${_completion}`,
              ]
            })
            App._T.obj(done) && App.Emu(done)
            return 
          }
        
        // ======== App.Emu.VC.Tab.Bar.Title
          App.Emu.VC.Tab.Bar.Title = function(struct, completion, done) {
            const _title = `App.Emu.VC.Tab.Bar.Title`
            if (!App._T.obj(struct)) {
              return console.error(`🔴 ${_title} 格式錯誤，不是物件格式`)
            }
            
            const _text       = App._T.str(struct.text) ? struct.text : null
            const _completion = App.Emu._ActionStr(completion)

            Toastr.success({
              title: _title,
              items: [
                `Text：${_text === null ? 'null' : `"${_text}"`}`,
                `Completion：${_completion}`,
              ]
            })
            
            return App._T.obj(done) && App.Emu(done)
          }
        

  // ======== App.Emu.GPS
    App.Emu.GPS = function() {}

    // ======== App.Emu.GPS.Start
      App.Emu.GPS.Start = function(struct, completion, done) {
        const _title = `App.Emu.GPS.Start`

        Toastr.success({
          title: _title,
          items: [
            `Completion：${App.Emu._ActionStr(completion)}`,
          ]
        })

        return App._T.obj(done) && App.Emu(done)
      }
    
    // ======== App.Emu.GPS.Stop
      App.Emu.GPS.Stop = function(struct, completion, done) {
        const _title = `App.Emu.GPS.Stop`


        Toastr.success({
          title: _title,
          items: [
            `Completion：${App.Emu._ActionStr(completion)}`,
          ]
        })

        return App._T.obj(done) && App.Emu(done)
      }

    // ======== App.Emu.GPS.Require
      App.Emu.GPS.Require = function() {}

      // ======== App.Emu.GPS.Require.WhenInUse
        App.Emu.GPS.Require.WhenInUse = function(struct, completion, done) {
          const _title = `App.Emu.GPS.Require.WhenInUse`

          Toastr.success({
            title: _title,
            items: [
              `Completion：${App.Emu._ActionStr(completion)}`,
            ]
          })

          return App._T.obj(done) && App.Emu(done)
        }
      // ======== App.Emu.GPS.Require.Always
        App.Emu.GPS.Require.Always = function(struct, completion, done) {
          const _title = `App.Emu.GPS.Require.Always`

          Toastr.success({
            title: _title,
            items: [
              `Completion：${App.Emu._ActionStr(completion)}`,
            ]
          })

          return App._T.obj(done) && App.Emu(done)
        }

    // ======== App.Emu.GPS.Refresh
      App.Emu.GPS.Refresh = function() {}

      // ======== App.Emu.GPS.Refresh.Status
        App.Emu.GPS.Refresh.Status = function(struct, completion, done) {
          const _title = `App.Emu.GPS.Refresh.Status`

          Toastr.success({
            title: _title,
            items: [
              `Completion：${App.Emu._ActionStr(completion)}`,
            ]
          })

          return App._T.obj(done) && App.Emu(done)
        }
      // ======== App.Emu.GPS.Refresh.Location
        App.Emu.GPS.Refresh.Location = function(struct, completion, done) {
          const _title = `App.Emu.GPS.Refresh.Location`

          Toastr.success({
            title: _title,
            items: [
              `Completion：${App.Emu._ActionStr(completion)}`,
            ]
          })

          return App._T.obj(done) && App.Emu(done)
        }
      // ======== App.Emu.GPS.Refresh.isRunning
        App.Emu.GPS.Refresh.isRunning = function(struct, completion, done) {
          const _title = `App.Emu.GPS.Refresh.isRunning`

          Toastr.success({
            title: _title,
            items: [
              `Completion：${App.Emu._ActionStr(completion)}`,
            ]
          })

          return App._T.obj(done) && App.Emu(done)
        }

    
    // ======== App.Emu.GPS.Get
      App.Emu.GPS.Get = function() {}

      // ======== App.Emu.GPS.Get.Status
        App.Emu.GPS.Get.Status = function(struct, completion, done) {
          const _title = `App.Emu.GPS.Get.Status`

          Toastr.success({
            title: _title,
            items: [
              `Completion：${App.Emu._ActionStr(completion)}`,
            ]
          })

          return App._T.obj(done) && App.Emu(done)
        }
      // ======== App.Emu.GPS.Get.Location
        App.Emu.GPS.Get.Location = function(struct, completion, done) {
          const _title = `App.Emu.GPS.Get.Location`

          Toastr.success({
            title: _title,
            items: [
              `Completion：${App.Emu._ActionStr(completion)}`,
            ]
          })

          return App._T.obj(done) && App.Emu(done)
        }
      // ======== App.Emu.GPS.Get.isRunning
        App.Emu.GPS.Get.isRunning = function(struct, completion, done) {
          const _title = `App.Emu.GPS.Get.isRunning`

          Toastr.success({
            title: _title,
            items: [
              `Completion：${App.Emu._ActionStr(completion)}`,
            ]
          })

          return App._T.obj(done) && App.Emu(done)
        }
      