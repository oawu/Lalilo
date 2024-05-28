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
          { key: 'loading', text: '載入中' },
          { key: 'done', text: '成功' },
          { key: 'fail', text: '失敗' },
          { key: 'hide', text: '載入中 ➜ 隱藏' },
          { key: 'hide-delay 5s', text: '載入中 ➜ 5 秒後 隱藏' },
          { key: 'change->wait', text: '載入中 ➜ 等待中' },
          { key: 'progress', text: '讀取中 ➜ 0~100' },
        ]
      },
      {
        header: '無動畫',
        items: [
          { key: 'x_loading', text: '載入中' },
          { key: 'x_done', text: '成功' },
          { key: 'x_fail', text: '失敗' },
          { key: 'x_hide', text: '載入中 ➜ 隱藏' },
          { key: 'x_hide-delay 5s', text: '載入中 ➜ 5 秒後 隱藏' },
          { key: 'x_change->wait', text: '載入中 ➜ 等待中' },
          { key: 'x_progress', text: '讀取中 ➜ 0~100' },
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
      if (task.key == 'loading') {
        closure(App.HUD.Show.Loading('載入中…'))
        setTimeout(_ => closure(App.HUD.Hide()), 3000)
      }
      if (task.key == 'done') {
        closure(App.HUD.Show.Done('成功！'))
        setTimeout(_ => closure(App.HUD.Hide()), 3000)
      }
      if (task.key == 'fail') {
        closure(App.HUD.Show.Fail('失敗！'))
        setTimeout(_ => closure(App.HUD.Hide()), 3000)
      }
      if (task.key == 'hide') {
        closure(App.HUD.Show.Loading('敘述', '標題'))
        setTimeout(_ => closure(App.HUD.Hide()), 3000)
      }
      if (task.key == 'hide-delay 5s') {
        closure(App.HUD.Show.Loading('敘述', '標題'))
        closure(App.HUD.Hide(5000))
      }
      if (task.key == 'change->wait') {
        closure(App.HUD.Show.Loading('敘述1', '標題1'))
        setTimeout(_ => closure(App.HUD.Change.Fail('敘述2', '標題2')), 3000)
        setTimeout(_ => closure(App.HUD.Change.Done('OK')), 6000)
        setTimeout(_ => closure(App.HUD.Hide()), 9000)
      }
      if (task.key == 'progress') {
        closure(App.HUD.Show.Progress('讀取中…'))
        setTimeout(_ => {
          closure(App.HUD.SetProgress(0.1))
          setTimeout(_ => {
            closure(App.HUD.SetProgress(0.2))
            setTimeout(_ => {
              closure(App.HUD.SetProgress(0.3))
              setTimeout(_ => {
                closure(App.HUD.SetProgress(0.4))
                setTimeout(_ => {
                  closure(App.HUD.SetProgress(0.5))
                  setTimeout(_ => {
                    closure(App.HUD.SetProgress(0.6))
                    setTimeout(_ => {
                      closure(App.HUD.SetProgress(0.7))
                      setTimeout(_ => {
                        closure(App.HUD.SetProgress(0.8))
                        setTimeout(_ => {
                          closure(App.HUD.SetProgress(0.9))
                          setTimeout(_ => {
                            closure(App.HUD.SetProgress(1))
                            setTimeout(_ => {
                              closure(App.HUD.Show.Done('OK'))

                              setTimeout(_ => {
                                closure(App.HUD.Hide())
                              }, 1000)
                            }, 1000)
                          }, 500)
                        }, 500)
                      }, 500)
                    }, 500)
                  }, 500)
                }, 500)
              }, 500)
            }, 500)
          }, 500)
        }, 500)
      }
      // ====================================
      if (task.key == 'x_loading') {
        closure(App.HUD.Show.Loading('載入中…', false))
        setTimeout(_ => closure(App.HUD.Hide(false)), 3000)
      }
      if (task.key == 'x_done') {
        closure(App.HUD.Show.Done('成功！', false))
        setTimeout(_ => closure(App.HUD.Hide(false)), 3000)
      }
      if (task.key == 'x_fail') {
        closure(App.HUD.Show.Fail('失敗！', false))
        setTimeout(_ => closure(App.HUD.Hide(false)), 3000)
      }
      if (task.key == 'x_hide') {
        closure(App.HUD.Show.Loading('敘述', '標題', false))
        setTimeout(_ => closure(App.HUD.Hide(false)), 3000)
      }
      if (task.key == 'x_hide-delay 5s') {
        closure(App.HUD.Show.Loading('敘述', '標題', false))
        closure(App.HUD.Hide(5000, false))
      }
      if (task.key == 'x_change->wait') {
        closure(App.HUD.Show.Loading('敘述1', '標題1', false))
        setTimeout(_ => closure(App.HUD.Change.Fail('敘述2', '標題2')), 3000)
        setTimeout(_ => closure(App.HUD.Change.Done('OK')), 6000)
        setTimeout(_ => closure(App.HUD.Hide(false)), 9000)
      }
      if (task.key == 'x_progress') {
        closure(App.HUD.Show.Progress('讀取中…', false))
        setTimeout(_ => {
          closure(App.HUD.SetProgress(0.1))
          setTimeout(_ => {
            closure(App.HUD.SetProgress(0.2))
            setTimeout(_ => {
              closure(App.HUD.SetProgress(0.3))
              setTimeout(_ => {
                closure(App.HUD.SetProgress(0.4))
                setTimeout(_ => {
                  closure(App.HUD.SetProgress(0.5))
                  setTimeout(_ => {
                    closure(App.HUD.SetProgress(0.6))
                    setTimeout(_ => {
                      closure(App.HUD.SetProgress(0.7))
                      setTimeout(_ => {
                        closure(App.HUD.SetProgress(0.8))
                        setTimeout(_ => {
                          closure(App.HUD.SetProgress(0.9))
                          setTimeout(_ => {
                            closure(App.HUD.SetProgress(1))
                            setTimeout(_ => {
                              closure(App.HUD.Show.Done('OK', false))

                              setTimeout(_ => {
                                closure(App.HUD.Hide(false))
                              }, 1000)
                            }, 1000)
                          }, 500)
                        }, 500)
                      }, 500)
                    }, 500)
                  }, 500)
                }, 500)
              }, 500)
            }, 500)
          }, 500)
        }, 500)
      }
    },
  },
  template: `
    Tool => :groups=groups   @click=click
      `
})
