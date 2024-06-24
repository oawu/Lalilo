/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    status: null,
    isRunning: null,
    count: 0,
    model: {
      lat: '',
      lng: '',
      alt: '',
      accH: '',
      accV: '',
      accS: '',
      accC: '',
      speed: '',
      course: '',
    },
    groups: [
      {
        header: 'Start',
        items: [
          { key: 'Start(A.E(s))', text: 'Start(Action.Emit(Str))' },
          { key: 'Start(A.E(s,a))', text: 'Start(Action.Emit(Str, Any))' },
          { key: 'Start(A.F(=>))', text: 'Start(Action.Fun(=>))' },
          { key: 'Start(A.F(=>,true))', text: 'Start(Action.Fun(=>, true))' },

          { key: 'Start(A(s))', text: 'Start(Action(Str))' },
          { key: 'Start(A(s,a))', text: 'Start(Action(Str, Any))' },
          { key: 'Start(A(=>))', text: 'Start(Action(=>))' },
          { key: 'Start(A(=>,true))', text: 'Start(Action(=>, true))' },

          { key: 'Start(s)', text: 'Start(Str)' },
          { key: 'Start(s,a)', text: 'Start(Str, Any)' },
          { key: 'Start(=>)', text: 'Start(=>)' },
          { key: 'Start(=>,true)', text: 'Start(=>, true)' },
        ]
      },
      {
        header: 'Stop',
        items: [
          { key: 'Stop(A.E(s))', text: 'Stop(Action.Emit(Str))' },
          { key: 'Stop(A.E(s,a))', text: 'Stop(Action.Emit(Str, Any))' },
          { key: 'Stop(A.F(=>))', text: 'Stop(Action.Fun(=>))' },
          { key: 'Stop(A.F(=>,true))', text: 'Stop(Action.Fun(=>, true))' },

          { key: 'Stop(A(s))', text: 'Stop(Action(Str))' },
          { key: 'Stop(A(s,a))', text: 'Stop(Action(Str, Any))' },
          { key: 'Stop(A(=>))', text: 'Stop(Action(=>))' },
          { key: 'Stop(A(=>,true))', text: 'Stop(Action(=>, true))' },

          { key: 'Stop(s)', text: 'Stop(Str)' },
          { key: 'Stop(s,a)', text: 'Stop(Str, Any)' },
          { key: 'Stop(=>)', text: 'Stop(=>)' },
          { key: 'Stop(=>,true)', text: 'Stop(=>, true)' },
        ]
      },


      {
        header: 'Get Status',
        items: [
          { key: 'G.Status(A.E(s))', text: 'Get.Status(Action.Emit(Str))' },
          { key: 'G.Status(A.E(s,a))', text: 'Get.Status(Action.Emit(Str, Any))' },
          { key: 'G.Status(A.F(=>))', text: 'Get.Status(Action.Fun(=>))' },
          { key: 'G.Status(A.F(=>,true))', text: 'Get.Status(Action.Fun(=>, true))' },

          { key: 'G.Status(A(s))', text: 'Get.Status(Action(Str))' },
          { key: 'G.Status(A(s,a))', text: 'Get.Status(Action(Str, Any))' },
          { key: 'G.Status(A(=>))', text: 'Get.Status(Action(=>))' },
          { key: 'G.Status(A(=>,true))', text: 'Get.Status(Action(=>, true))' },

          { key: 'G.Status(s)', text: 'Get.Status(Str)' },
          { key: 'G.Status(s,a)', text: 'Get.Status(Str, Any)' },
          { key: 'G.Status(=>)', text: 'Get.Status(=>)' },
          { key: 'G.Status(=>,true)', text: 'Get.Status(=>, true)' },
        ]
      },
      {
        header: 'Get Location',
        items: [
          { key: 'G.Location(A.E(s))', text: 'Get.Location(Action.Emit(Str))' },
          { key: 'G.Location(A.E(s,a))', text: 'Get.Location(Action.Emit(Str, Any))' },
          { key: 'G.Location(A.F(=>))', text: 'Get.Location(Action.Fun(=>))' },
          { key: 'G.Location(A.F(=>,true))', text: 'Get.Location(Action.Fun(=>, true))' },

          { key: 'G.Location(A(s))', text: 'Get.Location(Action(Str))' },
          { key: 'G.Location(A(s,a))', text: 'Get.Location(Action(Str, Any))' },
          { key: 'G.Location(A(=>))', text: 'Get.Location(Action(=>))' },
          { key: 'G.Location(A(=>,true))', text: 'Get.Location(Action(=>, true))' },

          { key: 'G.Location(s)', text: 'Get.Location(Str)' },
          { key: 'G.Location(s,a)', text: 'Get.Location(Str, Any)' },
          { key: 'G.Location(=>)', text: 'Get.Location(=>)' },
          { key: 'G.Location(=>,true)', text: 'Get.Location(=>, true)' },
        ]
      },
      {
        header: 'Get isRunning',
        items: [
          { key: 'G.isRunning(A.E(s))', text: 'Get.isRunning(Action.Emit(Str))' },
          { key: 'G.isRunning(A.E(s,a))', text: 'Get.isRunning(Action.Emit(Str, Any))' },
          { key: 'G.isRunning(A.F(=>))', text: 'Get.isRunning(Action.Fun(=>))' },
          { key: 'G.isRunning(A.F(=>,true))', text: 'Get.isRunning(Action.Fun(=>, true))' },

          { key: 'G.isRunning(A(s))', text: 'Get.isRunning(Action(Str))' },
          { key: 'G.isRunning(A(s,a))', text: 'Get.isRunning(Action(Str, Any))' },
          { key: 'G.isRunning(A(=>))', text: 'Get.isRunning(Action(=>))' },
          { key: 'G.isRunning(A(=>,true))', text: 'Get.isRunning(Action(=>, true))' },

          { key: 'G.isRunning(s)', text: 'Get.isRunning(Str)' },
          { key: 'G.isRunning(s,a)', text: 'Get.isRunning(Str, Any)' },
          { key: 'G.isRunning(=>)', text: 'Get.isRunning(=>)' },
          { key: 'G.isRunning(=>,true)', text: 'Get.isRunning(=>, true)' },
        ]
      },



      {
        header: 'Refresh Status',
        items: [
          { key: 'R.Status(A.E(s))', text: 'Refresh.Status(Action.Emit(Str))' },
          { key: 'R.Status(A.E(s,a))', text: 'Refresh.Status(Action.Emit(Str, Any))' },
          { key: 'R.Status(A.F(=>))', text: 'Refresh.Status(Action.Fun(=>))' },
          { key: 'R.Status(A.F(=>,true))', text: 'Refresh.Status(Action.Fun(=>, true))' },

          { key: 'R.Status(A(s))', text: 'Refresh.Status(Action(Str))' },
          { key: 'R.Status(A(s,a))', text: 'Refresh.Status(Action(Str, Any))' },
          { key: 'R.Status(A(=>))', text: 'Refresh.Status(Action(=>))' },
          { key: 'R.Status(A(=>,true))', text: 'Refresh.Status(Action(=>, true))' },

          { key: 'R.Status(s)', text: 'Refresh.Status(Str)' },
          { key: 'R.Status(s,a)', text: 'Refresh.Status(Str, Any)' },
          { key: 'R.Status(=>)', text: 'Refresh.Status(=>)' },
          { key: 'R.Status(=>,true)', text: 'Refresh.Status(=>, true)' },
        ]
      },
      {
        header: 'Refresh Location',
        items: [
          { key: 'R.Location(A.E(s))', text: 'Refresh.Location(Action.Emit(Str))' },
          { key: 'R.Location(A.E(s,a))', text: 'Refresh.Location(Action.Emit(Str, Any))' },
          { key: 'R.Location(A.F(=>))', text: 'Refresh.Location(Action.Fun(=>))' },
          { key: 'R.Location(A.F(=>,true))', text: 'Refresh.Location(Action.Fun(=>, true))' },

          { key: 'R.Location(A(s))', text: 'Refresh.Location(Action(Str))' },
          { key: 'R.Location(A(s,a))', text: 'Refresh.Location(Action(Str, Any))' },
          { key: 'R.Location(A(=>))', text: 'Refresh.Location(Action(=>))' },
          { key: 'R.Location(A(=>,true))', text: 'Refresh.Location(Action(=>, true))' },

          { key: 'R.Location(s)', text: 'Refresh.Location(Str)' },
          { key: 'R.Location(s,a)', text: 'Refresh.Location(Str, Any)' },
          { key: 'R.Location(=>)', text: 'Refresh.Location(=>)' },
          { key: 'R.Location(=>,true)', text: 'Refresh.Location(=>, true)' },
        ]
      },
      {
        header: 'Refresh isRunning',
        items: [
          { key: 'R.isRunning(A.E(s))', text: 'Refresh.isRunning(Action.Emit(Str))' },
          { key: 'R.isRunning(A.E(s,a))', text: 'Refresh.isRunning(Action.Emit(Str, Any))' },
          { key: 'R.isRunning(A.F(=>))', text: 'Refresh.isRunning(Action.Fun(=>))' },
          { key: 'R.isRunning(A.F(=>,true))', text: 'Refresh.isRunning(Action.Fun(=>, true))' },

          { key: 'R.isRunning(A(s))', text: 'Refresh.isRunning(Action(Str))' },
          { key: 'R.isRunning(A(s,a))', text: 'Refresh.isRunning(Action(Str, Any))' },
          { key: 'R.isRunning(A(=>))', text: 'Refresh.isRunning(Action(=>))' },
          { key: 'R.isRunning(A(=>,true))', text: 'Refresh.isRunning(Action(=>, true))' },

          { key: 'R.isRunning(s)', text: 'Refresh.isRunning(Str)' },
          { key: 'R.isRunning(s,a)', text: 'Refresh.isRunning(Str, Any)' },
          { key: 'R.isRunning(=>)', text: 'Refresh.isRunning(=>)' },
          { key: 'R.isRunning(=>,true)', text: 'Refresh.isRunning(=>, true)' },
        ]
      },


      {
        header: 'Require WhenInUse',
        items: [
          { key: 'R.WIU(A.E(s))', text: 'Require.WhenInUse(Action.Emit(Str))' },
          { key: 'R.WIU(A.E(s,a))', text: 'Require.WhenInUse(Action.Emit(Str, Any))' },
          { key: 'R.WIU(A.F(=>))', text: 'Require.WhenInUse(Action.Fun(=>))' },
          { key: 'R.WIU(A.F(=>,true))', text: 'Require.WhenInUse(Action.Fun(=>, true))' },

          { key: 'R.WIU(A(s))', text: 'Require.WhenInUse(Action(Str))' },
          { key: 'R.WIU(A(s,a))', text: 'Require.WhenInUse(Action(Str, Any))' },
          { key: 'R.WIU(A(=>))', text: 'Require.WhenInUse(Action(=>))' },
          { key: 'R.WIU(A(=>,true))', text: 'Require.WhenInUse(Action(=>, true))' },

          { key: 'R.WIU(s)', text: 'Require.WhenInUse(Str)' },
          { key: 'R.WIU(s,a)', text: 'Require.WhenInUse(Str, Any)' },
          { key: 'R.WIU(=>)', text: 'Require.WhenInUse(=>)' },
          { key: 'R.WIU(=>,true)', text: 'Require.WhenInUse(=>, true)' },
        ]
      },
      {
        header: 'Require Always',
        items: [
          { key: 'R.ALW(A.E(s))', text: 'Require.Always(Action.Emit(Str))' },
          { key: 'R.ALW(A.E(s,a))', text: 'Require.Always(Action.Emit(Str, Any))' },
          { key: 'R.ALW(A.F(=>))', text: 'Require.Always(Action.Fun(=>))' },
          { key: 'R.ALW(A.F(=>,true))', text: 'Require.Always(Action.Fun(=>, true))' },

          { key: 'R.ALW(A(s))', text: 'Require.Always(Action(Str))' },
          { key: 'R.ALW(A(s,a))', text: 'Require.Always(Action(Str, Any))' },
          { key: 'R.ALW(A(=>))', text: 'Require.Always(Action(=>))' },
          { key: 'R.ALW(A(=>,true))', text: 'Require.Always(Action(=>, true))' },

          { key: 'R.ALW(s)', text: 'Require.Always(Str)' },
          { key: 'R.ALW(s,a)', text: 'Require.Always(Str, Any)' },
          { key: 'R.ALW(=>)', text: 'Require.Always(=>)' },
          { key: 'R.ALW(=>,true)', text: 'Require.Always(=>, true)' },
        ]
      },
    ],
  },
  mounted () {

    App.Bridge.on('GPS::isRunning', isRunning => {
      this.isRunning = isRunning
    })

    App.Bridge.on('GPS::status', status => {
      this.status = status
    })

    App.Bridge.on('GPS::location', locations => {
      if (!locations.length) { return }

      this.count += locations.length

      this.model.lat = locations[0].lat
      this.model.lng = locations[0].lng
      this.model.accH = locations[0].accH

      this.model.alt = locations[0].alt
      this.model.accV = locations[0].accV

      this.model.speed = locations[0].speed
      this.model.accS = locations[0].accS
      this.model.course = locations[0].course
      this.model.accC = locations[0].accC
    })

    App.Bridge.emits([
      App.VC.Nav.SetRight('範例應用', App.VC.Nav.Push(App.VC.View.Web(`${window.baseUrl}Test/15-gps-2.html`).navTitle('範例應用'))),
      App.GPS.Refresh.Status(),
      App.GPS.Refresh.isRunning(),
    ], App.VC.Mounted())
  },
  methods: {
    click (task, func1, closure) {
      if (typeof closure != 'function') {
        return
      }

      if (task === null) {
        return closure(null)
      }

      // ==================================== Start
        if (task.key == 'Start(A.E(s))') { closure(App.GPS.Start(App.Action.Emit('On_Emit'))) }
        if (task.key == 'Start(A.E(s,a))') { closure(App.GPS.Start(App.Action.Emit('On_Emit', 'Emit'))) }
        if (task.key == 'Start(A.F(=>))') { closure(App.GPS.Start(App.Action.Func(func1))) }
        if (task.key == 'Start(A.F(=>,true))') { closure(App.GPS.Start(App.Action.Func(func1, true))) }

        if (task.key == 'Start(A(s))') { closure(App.GPS.Start(App.Action('On_Emit'))) }
        if (task.key == 'Start(A(s,a))') { closure(App.GPS.Start(App.Action('On_Emit', 'Emit'))) }
        if (task.key == 'Start(A(=>))') { closure(App.GPS.Start(App.Action(func1))) }
        if (task.key == 'Start(A(=>,true))') { closure(App.GPS.Start(App.Action(func1, true))) }

        if (task.key == 'Start(s)') { closure(App.GPS.Start('On_Emit')) }
        if (task.key == 'Start(s,a)') { closure(App.GPS.Start('On_Emit', 'Emit')) }
        if (task.key == 'Start(=>)') { closure(App.GPS.Start(func1)) }
        if (task.key == 'Start(=>,true)') { closure(App.GPS.Start(func1, true)) }

      // ==================================== Stop
        if (task.key == 'Stop(A.E(s))') { closure(App.GPS.Stop(App.Action.Emit('On_Emit'))) }
        if (task.key == 'Stop(A.E(s,a))') { closure(App.GPS.Stop(App.Action.Emit('On_Emit', 'Emit'))) }
        if (task.key == 'Stop(A.F(=>))') { closure(App.GPS.Stop(App.Action.Func(func1))) }
        if (task.key == 'Stop(A.F(=>,true))') { closure(App.GPS.Stop(App.Action.Func(func1, true))) }

        if (task.key == 'Stop(A(s))') { closure(App.GPS.Stop(App.Action('On_Emit'))) }
        if (task.key == 'Stop(A(s,a))') { closure(App.GPS.Stop(App.Action('On_Emit', 'Emit'))) }
        if (task.key == 'Stop(A(=>))') { closure(App.GPS.Stop(App.Action(func1))) }
        if (task.key == 'Stop(A(=>,true))') { closure(App.GPS.Stop(App.Action(func1, true))) }

        if (task.key == 'Stop(s)') { closure(App.GPS.Stop('On_Emit')) }
        if (task.key == 'Stop(s,a)') { closure(App.GPS.Stop('On_Emit', 'Emit')) }
        if (task.key == 'Stop(=>)') { closure(App.GPS.Stop(func1)) }
        if (task.key == 'Stop(=>,true)') { closure(App.GPS.Stop(func1, true)) }

      // ==================================== G.Status
        if (task.key == 'G.Status(A.E(s))') { closure(App.GPS.Get.Status(App.Action.Emit('On_Emit'))) }
        if (task.key == 'G.Status(A.E(s,a))') { closure(App.GPS.Get.Status(App.Action.Emit('On_Emit', 'Emit'))) }
        if (task.key == 'G.Status(A.F(=>))') { closure(App.GPS.Get.Status(App.Action.Func(func1))) }
        if (task.key == 'G.Status(A.F(=>,true))') { closure(App.GPS.Get.Status(App.Action.Func(func1, true))) }

        if (task.key == 'G.Status(A(s))') { closure(App.GPS.Get.Status(App.Action('On_Emit'))) }
        if (task.key == 'G.Status(A(s,a))') { closure(App.GPS.Get.Status(App.Action('On_Emit', 'Emit'))) }
        if (task.key == 'G.Status(A(=>))') { closure(App.GPS.Get.Status(App.Action(func1))) }
        if (task.key == 'G.Status(A(=>,true))') { closure(App.GPS.Get.Status(App.Action(func1, true))) }

        if (task.key == 'G.Status(s)') { closure(App.GPS.Get.Status('On_Emit')) }
        if (task.key == 'G.Status(s,a)') { closure(App.GPS.Get.Status('On_Emit', 'Emit')) }
        if (task.key == 'G.Status(=>)') { closure(App.GPS.Get.Status(func1)) }
        if (task.key == 'G.Status(=>,true)') { closure(App.GPS.Get.Status(func1, true)) }

      // ==================================== G.Location
        if (task.key == 'G.Location(A.E(s))') { closure(App.GPS.Get.Location(App.Action.Emit('On_Emit'))) }
        if (task.key == 'G.Location(A.E(s,a))') { closure(App.GPS.Get.Location(App.Action.Emit('On_Emit', 'Emit'))) }
        if (task.key == 'G.Location(A.F(=>))') { closure(App.GPS.Get.Location(App.Action.Func(func1))) }
        if (task.key == 'G.Location(A.F(=>,true))') { closure(App.GPS.Get.Location(App.Action.Func(func1, true))) }

        if (task.key == 'G.Location(A(s))') { closure(App.GPS.Get.Location(App.Action('On_Emit'))) }
        if (task.key == 'G.Location(A(s,a))') { closure(App.GPS.Get.Location(App.Action('On_Emit', 'Emit'))) }
        if (task.key == 'G.Location(A(=>))') { closure(App.GPS.Get.Location(App.Action(func1))) }
        if (task.key == 'G.Location(A(=>,true))') { closure(App.GPS.Get.Location(App.Action(func1, true))) }

        if (task.key == 'G.Location(s)') { closure(App.GPS.Get.Location('On_Emit')) }
        if (task.key == 'G.Location(s,a)') { closure(App.GPS.Get.Location('On_Emit', 'Emit')) }
        if (task.key == 'G.Location(=>)') { closure(App.GPS.Get.Location(func1)) }
        if (task.key == 'G.Location(=>,true)') { closure(App.GPS.Get.Location(func1, true)) }

      // ==================================== G.isRunning
        if (task.key == 'G.isRunning(A.E(s))') { closure(App.GPS.Get.isRunning(App.Action.Emit('On_Emit'))) }
        if (task.key == 'G.isRunning(A.E(s,a))') { closure(App.GPS.Get.isRunning(App.Action.Emit('On_Emit', 'Emit'))) }
        if (task.key == 'G.isRunning(A.F(=>))') { closure(App.GPS.Get.isRunning(App.Action.Func(func1))) }
        if (task.key == 'G.isRunning(A.F(=>,true))') { closure(App.GPS.Get.isRunning(App.Action.Func(func1, true))) }

        if (task.key == 'G.isRunning(A(s))') { closure(App.GPS.Get.isRunning(App.Action('On_Emit'))) }
        if (task.key == 'G.isRunning(A(s,a))') { closure(App.GPS.Get.isRunning(App.Action('On_Emit', 'Emit'))) }
        if (task.key == 'G.isRunning(A(=>))') { closure(App.GPS.Get.isRunning(App.Action(func1))) }
        if (task.key == 'G.isRunning(A(=>,true))') { closure(App.GPS.Get.isRunning(App.Action(func1, true))) }

        if (task.key == 'G.isRunning(s)') { closure(App.GPS.Get.isRunning('On_Emit')) }
        if (task.key == 'G.isRunning(s,a)') { closure(App.GPS.Get.isRunning('On_Emit', 'Emit')) }
        if (task.key == 'G.isRunning(=>)') { closure(App.GPS.Get.isRunning(func1)) }
        if (task.key == 'G.isRunning(=>,true)') { closure(App.GPS.Get.isRunning(func1, true)) }

      // ==================================== R.Status
        if (task.key == 'R.Status(A.E(s))') { closure(App.GPS.Refresh.Status(App.Action.Emit('On_Emit'))) }
        if (task.key == 'R.Status(A.E(s,a))') { closure(App.GPS.Refresh.Status(App.Action.Emit('On_Emit', 'Emit'))) }
        if (task.key == 'R.Status(A.F(=>))') { closure(App.GPS.Refresh.Status(App.Action.Func(func1))) }
        if (task.key == 'R.Status(A.F(=>,true))') { closure(App.GPS.Refresh.Status(App.Action.Func(func1, true))) }

        if (task.key == 'R.Status(A(s))') { closure(App.GPS.Refresh.Status(App.Action('On_Emit'))) }
        if (task.key == 'R.Status(A(s,a))') { closure(App.GPS.Refresh.Status(App.Action('On_Emit', 'Emit'))) }
        if (task.key == 'R.Status(A(=>))') { closure(App.GPS.Refresh.Status(App.Action(func1))) }
        if (task.key == 'R.Status(A(=>,true))') { closure(App.GPS.Refresh.Status(App.Action(func1, true))) }

        if (task.key == 'R.Status(s)') { closure(App.GPS.Refresh.Status('On_Emit')) }
        if (task.key == 'R.Status(s,a)') { closure(App.GPS.Refresh.Status('On_Emit', 'Emit')) }
        if (task.key == 'R.Status(=>)') { closure(App.GPS.Refresh.Status(func1)) }
        if (task.key == 'R.Status(=>,true)') { closure(App.GPS.Refresh.Status(func1, true)) }

      // ==================================== R.Location
        if (task.key == 'R.Location(A.E(s))') { closure(App.GPS.Refresh.Location(App.Action.Emit('On_Emit'))) }
        if (task.key == 'R.Location(A.E(s,a))') { closure(App.GPS.Refresh.Location(App.Action.Emit('On_Emit', 'Emit'))) }
        if (task.key == 'R.Location(A.F(=>))') { closure(App.GPS.Refresh.Location(App.Action.Func(func1))) }
        if (task.key == 'R.Location(A.F(=>,true))') { closure(App.GPS.Refresh.Location(App.Action.Func(func1, true))) }

        if (task.key == 'R.Location(A(s))') { closure(App.GPS.Refresh.Location(App.Action('On_Emit'))) }
        if (task.key == 'R.Location(A(s,a))') { closure(App.GPS.Refresh.Location(App.Action('On_Emit', 'Emit'))) }
        if (task.key == 'R.Location(A(=>))') { closure(App.GPS.Refresh.Location(App.Action(func1))) }
        if (task.key == 'R.Location(A(=>,true))') { closure(App.GPS.Refresh.Location(App.Action(func1, true))) }

        if (task.key == 'R.Location(s)') { closure(App.GPS.Refresh.Location('On_Emit')) }
        if (task.key == 'R.Location(s,a)') { closure(App.GPS.Refresh.Location('On_Emit', 'Emit')) }
        if (task.key == 'R.Location(=>)') { closure(App.GPS.Refresh.Location(func1)) }
        if (task.key == 'R.Location(=>,true)') { closure(App.GPS.Refresh.Location(func1, true)) }

      // ==================================== R.isRunning
        if (task.key == 'R.isRunning(A.E(s))') { closure(App.GPS.Refresh.isRunning(App.Action.Emit('On_Emit'))) }
        if (task.key == 'R.isRunning(A.E(s,a))') { closure(App.GPS.Refresh.isRunning(App.Action.Emit('On_Emit', 'Emit'))) }
        if (task.key == 'R.isRunning(A.F(=>))') { closure(App.GPS.Refresh.isRunning(App.Action.Func(func1))) }
        if (task.key == 'R.isRunning(A.F(=>,true))') { closure(App.GPS.Refresh.isRunning(App.Action.Func(func1, true))) }

        if (task.key == 'R.isRunning(A(s))') { closure(App.GPS.Refresh.isRunning(App.Action('On_Emit'))) }
        if (task.key == 'R.isRunning(A(s,a))') { closure(App.GPS.Refresh.isRunning(App.Action('On_Emit', 'Emit'))) }
        if (task.key == 'R.isRunning(A(=>))') { closure(App.GPS.Refresh.isRunning(App.Action(func1))) }
        if (task.key == 'R.isRunning(A(=>,true))') { closure(App.GPS.Refresh.isRunning(App.Action(func1, true))) }

        if (task.key == 'R.isRunning(s)') { closure(App.GPS.Refresh.isRunning('On_Emit')) }
        if (task.key == 'R.isRunning(s,a)') { closure(App.GPS.Refresh.isRunning('On_Emit', 'Emit')) }
        if (task.key == 'R.isRunning(=>)') { closure(App.GPS.Refresh.isRunning(func1)) }
        if (task.key == 'R.isRunning(=>,true)') { closure(App.GPS.Refresh.isRunning(func1, true)) }

      // ==================================== R.WIU
        if (task.key == 'R.WIU(A.E(s))') { closure(App.GPS.Require.WhenInUse(App.Action.Emit('On_Emit'))) }
        if (task.key == 'R.WIU(A.E(s,a))') { closure(App.GPS.Require.WhenInUse(App.Action.Emit('On_Emit', 'Emit'))) }
        if (task.key == 'R.WIU(A.F(=>))') { closure(App.GPS.Require.WhenInUse(App.Action.Func(func1))) }
        if (task.key == 'R.WIU(A.F(=>,true))') { closure(App.GPS.Require.WhenInUse(App.Action.Func(func1, true))) }

        if (task.key == 'R.WIU(A(s))') { closure(App.GPS.Require.WhenInUse(App.Action('On_Emit'))) }
        if (task.key == 'R.WIU(A(s,a))') { closure(App.GPS.Require.WhenInUse(App.Action('On_Emit', 'Emit'))) }
        if (task.key == 'R.WIU(A(=>))') { closure(App.GPS.Require.WhenInUse(App.Action(func1))) }
        if (task.key == 'R.WIU(A(=>,true))') { closure(App.GPS.Require.WhenInUse(App.Action(func1, true))) }

        if (task.key == 'R.WIU(s)') { closure(App.GPS.Require.WhenInUse('On_Emit')) }
        if (task.key == 'R.WIU(s,a)') { closure(App.GPS.Require.WhenInUse('On_Emit', 'Emit')) }
        if (task.key == 'R.WIU(=>)') { closure(App.GPS.Require.WhenInUse(func1)) }
        if (task.key == 'R.WIU(=>,true)') { closure(App.GPS.Require.WhenInUse(func1, true)) }

      // ==================================== R.ALW
        if (task.key == 'R.ALW(A.E(s))') { closure(App.GPS.Require.Always(App.Action.Emit('On_Emit'))) }
        if (task.key == 'R.ALW(A.E(s,a))') { closure(App.GPS.Require.Always(App.Action.Emit('On_Emit', 'Emit'))) }
        if (task.key == 'R.ALW(A.F(=>))') { closure(App.GPS.Require.Always(App.Action.Func(func1))) }
        if (task.key == 'R.ALW(A.F(=>,true))') { closure(App.GPS.Require.Always(App.Action.Func(func1, true))) }

        if (task.key == 'R.ALW(A(s))') { closure(App.GPS.Require.Always(App.Action('On_Emit'))) }
        if (task.key == 'R.ALW(A(s,a))') { closure(App.GPS.Require.Always(App.Action('On_Emit', 'Emit'))) }
        if (task.key == 'R.ALW(A(=>))') { closure(App.GPS.Require.Always(App.Action(func1))) }
        if (task.key == 'R.ALW(A(=>,true))') { closure(App.GPS.Require.Always(App.Action(func1, true))) }

        if (task.key == 'R.ALW(s)') { closure(App.GPS.Require.Always('On_Emit')) }
        if (task.key == 'R.ALW(s,a)') { closure(App.GPS.Require.Always('On_Emit', 'Emit')) }
        if (task.key == 'R.ALW(=>)') { closure(App.GPS.Require.Always(func1)) }
        if (task.key == 'R.ALW(=>,true)') { closure(App.GPS.Require.Always(func1, true)) }

    },
  },
  template: `
    Tool => :groups=groups   @click=click
      .header => *text='Status'
      .unit
        div
          span => *text=status   :before='狀態'   :after=''
          span => *text=isRunning?'True':'False'   :before='是否收集'   :after=''

      .header => *text='Location：' + count
      .unit
        div
          span => *text=model.lat   :before='緯度'   :after=''
          span => *text=model.lng   :before='經度'   :after=''
          span => *text=model.accH   :before='水平誤差'   :after='m'
          span => *text=model.alt   :before='高度'   :after='m'
          span => *text=model.accV   :before='垂直誤差'   :after='m'
          span => *text=model.speed   :before='速度'   :after='m/s'
          span => *text=model.accS   :before='速度誤差'   :after='m/s'
          span => *text=model.course   :before='航向'   :after=''
          span => *text=model.accC   :before='角度誤差'   :after=''

      `
})
