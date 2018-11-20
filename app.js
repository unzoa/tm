//app.js
App({
  apiPath: '',
  token: '',
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res)
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              // userInfo gender 性别 0 未知； 1 男性； 2 女性
              // userInfo nickName 昵称
              // userInfo avatarUrl 头像
              this.getToken(res.userInfo.avatarUrl, res.userInfo.nickName, res.userInfo.gender)
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  getToken (avatarUrl, nickName, gender) {
    let _this = this
    this.$('gettoken', {
        openid: 23213,
        photo: avatarUrl,
        nickname: nickName,
        sex: Boolean(Number(gender) ? !(Number(gender) - 1) : 1)
    }).then(res => {
      if (res.code === 0) {
        _this.token = res.data
        if (_this.tokenCallback) {
          _this.tokenCallback(res.data)
        }
      }
    })
  },
  $ (Interface, requestData, method) {
    let _this = this
    return new Promise((resolve, reject) => {
      wx.request({
        method: method || "GET",
        url: _this.apiPath + Interface,
        data: requestData,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + _this.token
        },
        success(res) {
          if (res.statusCode === 200) {
            resolve(res.data)
          }
        }
      })
    })
  }
})