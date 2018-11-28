//app.js
App({
  token: '',
  openid: '',
  userId: '',
  courseReserve: {
    0: '已结束',
    1: '可预约'
  },
  voucherStatus: {
    '-1': '取消',
    '0': '预约成功',
    '-2': '预约失败',
    '3': '已处理'
  },
  onLaunch: function () {
    wx.hideTabBar()
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    let _this = this
    let promise = new Promise((resolve, reject) => {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          // console.log(res)
          // this.getToken(res.code)
          _this.$('gettoken', {
            code: res.code
          }).then(res => {
            // console.log(res)
            if (res.code === 0) {
              _this.token = res.data.token
              _this.openid = res.data.openId
              if (_this.tokenCallback) {
                _this.tokenCallback(res.data.token)
              }
              resolve()
            }
          })
        }
      })
    })
    promise.then(() => {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // console.log(res)

                // 可以将 res 发送给后台解码出 unionId
                // userInfo gender 性别 0 未知； 1 男性； 2 女性 Boolean(Number(gender) ? !(Number(gender) - 1) : 1)
                // userInfo nickName 昵称
                // userInfo avatarUrl 头像
                this.globalData.userInfo = res.userInfo
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }

                // 注册用户信息
                this.$('setuserinfo', {
                  openid: this.openid,
                  photo: res.userInfo.avatarUrl,
                  nickname: res.userInfo.nickName,
                  sex: Number(res.userInfo.gender) ? !(Number(res.userInfo.gender) - 1) : 1
                }).then(res => {
                  console.log(res)
                  this.userId = res.data.id
                })
              }
            })
          }
        },
        fail: res => {
          console.log(res)
        },
        complete: (res) => {
          // console.log(res)
          // if (!res.authSetting['scope.userInfo']) {
          // }
        }
      })
    })
  },
  globalData: {
    userInfo: null
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
        },
        fail: res => {
          reject(res)
        }
      })
    })
  }
})