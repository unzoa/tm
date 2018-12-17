// pages/me/me.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    showUserId: '',
    accountList: []
  },
  jumpTo (e) {
    let data = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/' + data.path + '/' + data.path
    })
  },
  getMyMainInfo (id) {
    app.$('GetMyMainInfo', {
      UserId: app.userId || id
    }).then(res => {
      let d = res.data
      this.setData({
        showUserId: d.userCode,
        accountList: [
          '团体课体验券x' + d.groupCourseNums + '. ' + util.formatTime(d.groupCourseExpireTime) + '过期',
          '团体课x' + d.voucherNums + '. ' + util.formatTime(d.voucherExpireTime) + '过期',
          '私教课x' + d.privateCourseNums + '. ' + util.formatTime(d.privateCourseExpireTime) + '过期'
        ]
      })
      // 停止下拉状态
      wx.stopPullDownRefresh()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })

    this.getMyMainInfo()
  },
  onPullDownRefresh: function () {
    this.getMyMainInfo()
  }
})