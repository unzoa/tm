// pages/ticket/ticket.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLogin: false, // 登陆按钮显示
    getTokenShow: false, // token 的回掉显示
    ReserveId: 0,
    time: '0000/00/00',
    num: '0000',
    addr: '',
    userId: 0,
    msg: ''
  },
  // 事件处理函数
  getUserInfo: function(e) {
    wx.showLoading()
    // console.log(e)
    if (e.detail.userInfo) {
      // 完成授权
      // 显示tabbar
      // 注册用户信息
      // 获取用户id
      // 完成领取动作
      wx.showTabBar()
      app.globalData.userInfo = e.detail.userInfo
      app.setuserinfo(e.detail).then(userId => {
        // 得到用户id，需要领取优惠券
        console.log(userId)
        wx.hideLoading()
        this.setData({
          userId: userId
        })
        this.GetVoucherInfo()
      })
      // 显示单独领取按钮
      this.setData({
        showLogin: false
      })
    } else {
      console.log('没有授权')
    }
  },
  goIndex () {
    // 没有完成授权，showLogin 是true
    if (this.data.showLogin) {
      wx.showTabBar()
    }
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  GetVoucherInfo (userId) {
    wx.showLoading()
    app.$('GetVoucherInfo', {
      UserId: this.data.userId
    }).then(res => {
      wx.hideLoading()
      console.log(res)
      this.setData({
        msg: res.msg
      })
      this.selectComponent('#message').show()
    }).catch(err => {
      this.setData({
        msg: '很抱歉，领取失败'
      })
      this.selectComponent('#message').show()
    })
  },
  init () {
    wx.showLoading()
    app.$('GetVoucherPageInfo', {
      ReserveId: this.data.ReserveId
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      if (res.code === 0) {
        this.setData({
          time: res.data.endDatetime.split('T')[0],
          addr: res.data.voucherAddress,
          num: res.data.voucherId,
          msg: res.msg
        })
        // this.selectComponent('#message').show()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        ReserveId: options.id
      })
    }

    /*
    @ 单个页面分享
    * 正常程序内跳转不需要等待token请求和用户登陆设置
    * 而分享后，程序没有经过index.js 
    */
    if (!app.userId) {
      // 是分享后：
      // 1，获取token、openid;
      // 2, 显示登陆button, 点击getUserInfo, setuserinfo
      app.login().then(() => {
        this.setData({
          getTokenShow: true, // 得到token
          showLogin: true
        })
      }).then(() => {
        // 3, 异步后页面动作
        this.init()
      })
    } else {
      console.log(app.userId)
      // 页面动作
      this.init()
      this.setData({
        userId: app.userId,
        getTokenShow: true // 得到token
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '私教邦-团体课体验券',
      path: '/pages/ticket/ticket?id=' + this.data.ReserveId
    }
  }
})