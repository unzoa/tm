// pages/bookList/bookList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mediaRes: []
  },
  getUserReserve () {
    app.$('GetUserReserve', {
      UserId: app.userId
    }).then(res => {
      console.log(res)
      let d = res.data
      let mediaRes = []
      for (let i = 0; i < d.length; i++) {
        mediaRes.push({
          id: d[i].id,
          img: app.imgPath + d[i].coursePhoto + '.png',
          title: d[i].courseName,
          level: d[i].courseDifficulty,
          time: d[i].reserveDatetime.split('T')[0] + ' ' + d[i].reserveDatetime.split('T')[1],
          status: app.voucherStatus[d[i].voucherStatus]
        })
      }
      this.setData({
        mediaRes: mediaRes
      })
      // 停止下拉状态
      wx.stopPullDownRefresh()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    @ 数据
    */
    this.getUserReserve()
  },
  onPullDownRefresh: function () {
    this.getUserReserve()
  }
})