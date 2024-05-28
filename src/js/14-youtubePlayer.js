/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {
    groups: [
      {
        header: '',
        items: [
          { key: 'S(vid)',  text: 'Show(vid)' },
          { key: 'C()',  text: 'Close()' },

          { key: 'S(vid, ref)', text: 'Show(vid, ref)' },
          { key: 'S(vid, timeout)', text: 'Show(vid, timeout)' },
          { key: 'S(vid, ref, timeout)', text: 'Show(vid, ref, timeout)' },

        ]
      },
      {
        header: 'On Play',
        items: [
          { key: 'p(A.E(str))', text: 'Play(Act.Emit(str))' },
          { key: 'p(A.E(str,any))', text: 'Play(Act.Emit(str, any))' },
          { key: 'p(A.F(=>))', text: 'Play(Act.Func(=>))' },
          { key: 'p(A.F(=>,true))', text: 'Play(Act.Func(=>, true))' },

          { key: 'p(A(str))', text: 'Play(Act(str))' },
          { key: 'p(A(str,any))', text: 'Play(Act(str, any))' },
          { key: 'p(A(=>))', text: 'Play(Act(=>))' },
          { key: 'p(A(=>,true))', text: 'Play(Act(=>, true))' },

          { key: 'p(str))', text: 'Play(str)' },
          { key: 'p(str,any)', text: 'Play(str, any)' },
          { key: 'p(=>)', text: 'Play(=>)' },
          { key: 'p(=>,true)', text: 'Play(=>, true)' },
        ]
      },
      {
        header: 'On Close',
        items: [
          { key: 'c(A.E(str))', text: 'Close(Act.Emit(str))' },
          { key: 'c(A.E(str,any))', text: 'Close(Act.Emit(str, any))' },
          { key: 'c(A.F(=>))', text: 'Close(Act.Func(=>))' },
          { key: 'c(A.F(=>,true))', text: 'Close(Act.Func(=>, true))' },

          { key: 'c(A(str))', text: 'Close(Act(str))' },
          { key: 'c(A(str,any))', text: 'Close(Act(str, any))' },
          { key: 'c(A(=>))', text: 'Close(Act(=>))' },
          { key: 'c(A(=>,true))', text: 'Close(Act(=>, true))' },

          { key: 'c(str))', text: 'Close(str)' },
          { key: 'c(str,any)', text: 'Close(str, any)' },
          { key: 'c(=>)', text: 'Close(=>)' },
          { key: 'c(=>,true)', text: 'Close(=>, true)' },
        ]
      },
      {
        header: 'On Timeout',
        items: [
          { key: 't(A.E(str))', text: 'Timeout(Act.Emit(str))' },
          { key: 't(A.E(str,any))', text: 'Timeout(Act.Emit(str, any))' },
          { key: 't(A.F(=>))', text: 'Timeout(Act.Func(=>))' },
          { key: 't(A.F(=>,true))', text: 'Timeout(Act.Func(=>, true))' },

          { key: 't(A(str))', text: 'Timeout(Act(str))' },
          { key: 't(A(str,any))', text: 'Timeout(Act(str, any))' },
          { key: 't(A(=>))', text: 'Timeout(Act(=>))' },
          { key: 't(A(=>,true))', text: 'Timeout(Act(=>, true))' },

          { key: 't(str))', text: 'Timeout(str)' },
          { key: 't(str,any)', text: 'Timeout(str, any)' },
          { key: 't(=>)', text: 'Timeout(=>)' },
          { key: 't(=>,true)', text: 'Timeout(=>, true)' },
        ]
      },
      {
        header: 'On Error',
        items: [
          { key: 'e(A.E(str))', text: 'Error(Act.Emit(str))' },
          { key: 'e(A.E(str,any))', text: 'Error(Act.Emit(str, any))' },
          { key: 'e(A.F(=>))', text: 'Error(Act.Func(=>))' },
          { key: 'e(A.F(=>,true))', text: 'Error(Act.Func(=>, true))' },

          { key: 'e(A(str))', text: 'Error(Act(str))' },
          { key: 'e(A(str,any))', text: 'Error(Act(str, any))' },
          { key: 'e(A(=>))', text: 'Error(Act(=>))' },
          { key: 'e(A(=>,true))', text: 'Error(Act(=>, true))' },

          { key: 'e(str))', text: 'Error(str)' },
          { key: 'e(str,any)', text: 'Error(str, any)' },
          { key: 'e(=>)', text: 'Error(=>)' },
          { key: 'e(=>,true)', text: 'Error(=>, true)' },
        ]
      },
    ],
  },
  mounted () {
    App.VC.Mounted().emit()
  },
  methods: {
    click (task, func1, closure) {
      if (typeof closure != 'function') {
        return
      }

      if (task === null) {
        return closure(null)
      }

      // ====================================
      
      const vid = 'Grq3DJcIgTY'
      const ref = 'OA Wu'

      if (task.key == 'S(vid)')                { closure(App.YoutubePlayer.Show(vid)) }
      if (task.key == 'C()')                   { closure(App.YoutubePlayer.Close())  }
      if (task.key == 'S(vid, ref)')           { closure(App.YoutubePlayer.Show(vid, ref)) }
      if (task.key == 'S(vid, timeout)')       { closure(App.YoutubePlayer.Show(vid, 10)) }
      if (task.key == 'S(vid, ref, timeout)')  { closure(App.YoutubePlayer.Show(vid, ref, 10)) }

      if (task.key == 'p(A.E(str))')           { closure(App.YoutubePlayer.Show(vid).onPlay(App.Action.Emit('On_Emit'))) }
      if (task.key == 'p(A.E(str,any))')       { closure(App.YoutubePlayer.Show(vid).onPlay(App.Action.Emit('On_Emit', 'Emit'))) }
      if (task.key == 'p(A.F(=>))')            { closure(App.YoutubePlayer.Show(vid).onPlay(App.Action.Func(func1))) }
      if (task.key == 'p(A.F(=>,true))')       { closure(App.YoutubePlayer.Show(vid).onPlay(App.Action.Func(func1, true))) }
      if (task.key == 'p(A(str))')             { closure(App.YoutubePlayer.Show(vid).onPlay(App.Action('On_Emit'))) }
      if (task.key == 'p(A(str,any))')         { closure(App.YoutubePlayer.Show(vid).onPlay(App.Action('On_Emit', 'Emit'))) }
      if (task.key == 'p(A(=>))')              { closure(App.YoutubePlayer.Show(vid).onPlay(App.Action(func1))) }
      if (task.key == 'p(A(=>,true))')         { closure(App.YoutubePlayer.Show(vid).onPlay(App.Action(func1, true))) }
      if (task.key == 'p(str))')               { closure(App.YoutubePlayer.Show(vid).onPlay('On_Emit')) }
      if (task.key == 'p(str,any)')            { closure(App.YoutubePlayer.Show(vid).onPlay('On_Emit', 'Emit')) }
      if (task.key == 'p(=>)')                 { closure(App.YoutubePlayer.Show(vid).onPlay(func1)) }
      if (task.key == 'p(=>,true)')            { closure(App.YoutubePlayer.Show(vid).onPlay(func1, true)) }

      if (task.key == 'c(A.E(str))')           { closure(App.YoutubePlayer.Show(vid).onClose(App.Action.Emit('On_Emit'))) }
      if (task.key == 'c(A.E(str,any))')       { closure(App.YoutubePlayer.Show(vid).onClose(App.Action.Emit('On_Emit', 'Emit'))) }
      if (task.key == 'c(A.F(=>))')            { closure(App.YoutubePlayer.Show(vid).onClose(App.Action.Func(func1))) }
      if (task.key == 'c(A.F(=>,true))')       { closure(App.YoutubePlayer.Show(vid).onClose(App.Action.Func(func1, true))) }
      if (task.key == 'c(A(str))')             { closure(App.YoutubePlayer.Show(vid).onClose(App.Action('On_Emit'))) }
      if (task.key == 'c(A(str,any))')         { closure(App.YoutubePlayer.Show(vid).onClose(App.Action('On_Emit', 'Emit'))) }
      if (task.key == 'c(A(=>))')              { closure(App.YoutubePlayer.Show(vid).onClose(App.Action(func1))) }
      if (task.key == 'c(A(=>,true))')         { closure(App.YoutubePlayer.Show(vid).onClose(App.Action(func1, true))) }
      if (task.key == 'c(str))')               { closure(App.YoutubePlayer.Show(vid).onClose('On_Emit')) }
      if (task.key == 'c(str,any)')            { closure(App.YoutubePlayer.Show(vid).onClose('On_Emit', 'Emit')) }
      if (task.key == 'c(=>)')                 { closure(App.YoutubePlayer.Show(vid).onClose(func1)) }
      if (task.key == 'c(=>,true)')            { closure(App.YoutubePlayer.Show(vid).onClose(func1, true)) }

      if (task.key == 't(A.E(str))')           { closure(App.YoutubePlayer.Show(vid).onTimeout(App.Action.Emit('On_Emit'))) }
      if (task.key == 't(A.E(str,any))')       { closure(App.YoutubePlayer.Show(vid).onTimeout(App.Action.Emit('On_Emit', 'Emit'))) }
      if (task.key == 't(A.F(=>))')            { closure(App.YoutubePlayer.Show(vid).onTimeout(App.Action.Func(func1))) }
      if (task.key == 't(A.F(=>,true))')       { closure(App.YoutubePlayer.Show(vid).onTimeout(App.Action.Func(func1, true))) }
      if (task.key == 't(A(str))')             { closure(App.YoutubePlayer.Show(vid).onTimeout(App.Action('On_Emit'))) }
      if (task.key == 't(A(str,any))')         { closure(App.YoutubePlayer.Show(vid).onTimeout(App.Action('On_Emit', 'Emit'))) }
      if (task.key == 't(A(=>))')              { closure(App.YoutubePlayer.Show(vid).onTimeout(App.Action(func1))) }
      if (task.key == 't(A(=>,true))')         { closure(App.YoutubePlayer.Show(vid).onTimeout(App.Action(func1, true))) }
      if (task.key == 't(str))')               { closure(App.YoutubePlayer.Show(vid).onTimeout('On_Emit')) }
      if (task.key == 't(str,any)')            { closure(App.YoutubePlayer.Show(vid).onTimeout('On_Emit', 'Emit')) }
      if (task.key == 't(=>)')                 { closure(App.YoutubePlayer.Show(vid).onTimeout(func1)) }
      if (task.key == 't(=>,true)')            { closure(App.YoutubePlayer.Show(vid).onTimeout(func1, true)) }

      if (task.key == 'e(A.E(str))')           { closure(App.YoutubePlayer.Show(vid).onError(App.Action.Emit('On_Emit'))) }
      if (task.key == 'e(A.E(str,any))')       { closure(App.YoutubePlayer.Show(vid).onError(App.Action.Emit('On_Emit', 'Emit'))) }
      if (task.key == 'e(A.F(=>))')            { closure(App.YoutubePlayer.Show(vid).onError(App.Action.Func(func1))) }
      if (task.key == 'e(A.F(=>,true))')       { closure(App.YoutubePlayer.Show(vid).onError(App.Action.Func(func1, true))) }
      if (task.key == 'e(A(str))')             { closure(App.YoutubePlayer.Show(vid).onError(App.Action('On_Emit'))) }
      if (task.key == 'e(A(str,any))')         { closure(App.YoutubePlayer.Show(vid).onError(App.Action('On_Emit', 'Emit'))) }
      if (task.key == 'e(A(=>))')              { closure(App.YoutubePlayer.Show(vid).onError(App.Action(func1))) }
      if (task.key == 'e(A(=>,true))')         { closure(App.YoutubePlayer.Show(vid).onError(App.Action(func1, true))) }
      if (task.key == 'e(str))')               { closure(App.YoutubePlayer.Show(vid).onError('On_Emit')) }
      if (task.key == 'e(str,any)')            { closure(App.YoutubePlayer.Show(vid).onError('On_Emit', 'Emit')) }
      if (task.key == 'e(=>)')                 { closure(App.YoutubePlayer.Show(vid).onError(func1)) }
      if (task.key == 'e(=>,true)')            { closure(App.YoutubePlayer.Show(vid).onError(func1, true)) }
    },
  },
  template: `
    Tool => :groups=groups   @click=click
      `
})
