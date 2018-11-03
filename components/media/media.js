// components/media/media.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    res: Array,
    path: String
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
      console.log(data.id, this.data.path)
    }
  }
})