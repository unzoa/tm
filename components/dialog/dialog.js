// components/dialog/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    act: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show () {
      this.setData({
        act: 'dialog-act-in'
      })
    },
    hide () {
      this.setData({
        act: 'dialog-act-out'
      })
    }
  }
})
