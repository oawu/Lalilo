/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2024, Lalilo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

Load.Vue({
  data: {

    oriGroups: null
  },
  mounted () {
    App.emits([
      App.VC.Nav.Bar.Title("首頁  1"),
      App.VC.Tab.Bar.Title("首頁  2"),
    ])
    
    App.VC.Mounted().emit()

    setTimeout(_ => (new ResizeObserver((entries) => entries[0].target == this.$el && this.$el.dispatchEvent(new CustomEvent('scroll')))).observe(this.$el))

    // setTimeout(_ => {


    //   // this.groups = [
    //   // {
    //   //   header: '其他',
    //   //   footer: '',
    //   //   items: [
    //   //     { title: '控制前頁', subtitle: 'Emit 上一個頁面 func', href: `${window.baseUrl}Test/12-emitPrev-1.html` },
    //   //     { title: 'HUD', subtitle: '抬頭顯示器', href: `${window.baseUrl}Test/13-hud.html` },
    //   //     { title: 'Youtube Player', subtitle: 'Youtube 播放器', href: `${window.baseUrl}Test/14-youtubePlayer.html` },
    //   //     { title: 'GPS', subtitle: '定位功能', href: `${window.baseUrl}Test/15-gps-1.html` },
    //   //     { title: 'Feedback', subtitle: '觸感回應', href: `${window.baseUrl}Test/16-feedback.html` },
    //   //   ] 
    //   // },]
      
    // }, 2000)
    DB.Date.all((error, dates) => {
      if (error) {
        return
      }

      this.oriGroups = dates.reverse().map(date => {
        const group = {
          header: `${date.year}/${date.month}/${date.day}`,
          items: []
        }

        DB.Date.Activity.where('dateId', date.id).all((error, activities) => {
          if (error) {
            return
          }

          group.items = activities.reverse().map(activity => {
            return {
              title: `${date.year}.${date.month}.${date.day} ${activity.hour}:${activity.min}:${activity.sec}`
            }
          })
        })

        return group
      })
      
    })

  },
  watch: {
  },
  methods: {
    click (item) {
    },
    scroll (e) {
      App.OnScroll(e.target.scrollTop, e.target.clientHeight, e.target.scrollHeight).emit()
    },
  },
  computed: {
    groups () {
      return this.oriGroups === null ? null : this.oriGroups.filter(group => group.items.length)
    }
  },
  template: `
    main#app => @scroll=scroll
      .groups
        .group => *if=groups === null
          .items
            .item
              .content
                .info
                  .key
                    span.center => *text='讀取中…'

        .group => *for=(group, i) in groups   :key='groups_' + i
          .header => *if=typeof group.header == 'string' && group.header !== ''   *text=group.header
          .items
            label.item => *for=(item, j) in group.items   :key='items_' + j   @click=click(item)
              .img => *if=typeof item.image == 'string' && item.image !== ''
                figure

              .content
                .info
                  .key => *if=(typeof item.title == 'string' && item.title !== '') || (typeof item.subtitle == 'string' && item.subtitle !== '')
                    b => *if=typeof item.title == 'string' && item.title !== ''   *text=item.title
                    span => *if=typeof item.subtitle == 'string' && item.subtitle !== ''   *text=item.subtitle
                  .val => *if=typeof item.value == 'string' && item.value !== ''
                    b => *text=item.value
                .icon
                  .arrowUI

      `
})
