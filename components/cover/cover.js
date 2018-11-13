// components/cover/cover.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    res: Array,
    height: Number,
    paddingLR: Number,
    autoplay: Boolean,
    interval: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgWH: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    imageLoad (e) {
      // 容器
      var coverHeight = this.data.height,
          coverPadding = this.data.paddingLR
      var ratioCon = (wx.getSystemInfoSync().windowWidth - coverPadding) / coverHeight
      // 图片
      var imgwidth = e.detail.width,
        imgheight = e.detail.height,
        ratio = imgwidth / imgheight
      // 数据
      let res = this.data.res
      if (ratio >= ratioCon) {
        // 图片的宽度大，正常记录宽度即可
        res[e.target.dataset.id].w = ratio * coverHeight
        res[e.target.dataset.id].h = coverHeight
      } else {
        // img 宽度小，则宽度撑开，重新计算高度
        res[e.target.dataset.id].w = wx.getSystemInfoSync().windowWidth - coverPadding
        res[e.target.dataset.id].h = (wx.getSystemInfoSync().windowWidth - coverPadding) / ratio
      }
      this.setData({
        res: res
      })
    },
    previewImg () {
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: [] // 需要预览的图片http链接列表
      })
    }
  }
})
