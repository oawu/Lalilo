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
          { key: '1_light', text: 'Light' },
          { key: '1_heavy', text: 'Heavy' },
          { key: '1_medium', text: 'Medium' },
          { key: '1_soft', text: 'Soft' },
          { key: '1_rigid', text: 'Rigid' },
          { key: '1_error', text: 'Error' },
          { key: '1_success', text: 'Success' },
          { key: '1_warning', text: 'Warning' },
        ]
      },
      {
        header: '',
        items: [
          { key: '2_light', text: 'Light' },
          { key: '2_heavy', text: 'Heavy' },
          { key: '2_medium', text: 'Medium' },
          { key: '2_soft', text: 'Soft' },
          { key: '2_rigid', text: 'Rigid' },
          { key: '2_error', text: 'Error' },
          { key: '2_success', text: 'Success' },
          { key: '2_warning', text: 'Warning' },
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

      if (task.key == '1_light') { closure(App.Feedback('light')) }
      if (task.key == '1_heavy') { closure(App.Feedback('heavy')) }
      if (task.key == '1_medium') { closure(App.Feedback('medium')) }
      if (task.key == '1_soft') { closure(App.Feedback('soft')) }
      if (task.key == '1_rigid') { closure(App.Feedback('rigid')) }
      if (task.key == '1_error') { closure(App.Feedback('error')) }
      if (task.key == '1_success') { closure(App.Feedback('success')) }
      if (task.key == '1_warning') { closure(App.Feedback('warning')) }
      
      // ====================================

      if (task.key == '2_light') { closure(App.Feedback.Light()) }
      if (task.key == '2_heavy') { closure(App.Feedback.Heavy()) }
      if (task.key == '2_medium') { closure(App.Feedback.Medium()) }
      if (task.key == '2_soft') { closure(App.Feedback.Soft()) }
      if (task.key == '2_rigid') { closure(App.Feedback.Rigid()) }
      if (task.key == '2_error') { closure(App.Feedback.Error()) }
      if (task.key == '2_success') { closure(App.Feedback.Success()) }
      if (task.key == '2_warning') { closure(App.Feedback.Warning()) }
    }
  },
  template: `
    Tool => :groups=groups   @click=click
      `
})
