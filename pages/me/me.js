// pages/me/me.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userName: '',
    userId: 0,
    accountList: []
  },
  getUserInfo: function(e) {
    app.setuserinfo(e.detail)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
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
      userId: app.userId
    })
    // console.log(app.globalData.userInfo, this.data.canIUse)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    app.setUserCallback = id => {
      this.setData({
        userId: app.userId
      })
      this.getMyMainInfo(id)
    }
    this.getMyMainInfo()
  },
  onPullDownRefresh: function () {
    this.getMyMainInfo()
  }
})