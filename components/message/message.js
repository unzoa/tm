// components/message/message.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    act: String,
    mes: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    // act: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show () {
      this.setData({
        act: 'mes-act-in'
      })
      setTimeout(() => {
        this.setData({
          act: 'mes-act-out'
        })
      }, 3000)
    }
  }
})
