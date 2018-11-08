// components/media/media.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    res: Array,
    jumpTo: String
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkThis (e) {
      let data = e.currentTarget.dataset
      if (this.data.jumpTo !== '/') {
        wx.navigateTo({
          url: '/pages/' + this.data.jumpTo + '/' + this.data.jumpTo + '?id=' + data.id 
        })
      }
    }
  }
})
