//app.js
App({
  apiPath: '',
  imgPath: '',
  token: '',
  openid: '',
  userId: '',
  courseReserve: {
    0: '已满员',
    1: '可预约',
    2: '已结束'
  },
  voucherStatus: {
    '-1': '已取消',
    '0': '预约成功',
    '-2': '预约失败',
    '3': '已处理'
  },
  onLaunch: function () {
    wx.hideTabBar()
  },
  globalData: {
    userInfo: null
  },
  login () {
    let _this = this
    return new Promise((resolve, reject) => {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.showLoading()
          // 获取token， openid
          _this.$('gettoken', {
            code: res.code
          }).then(gettokenData => {
            wx.hideLoading()
            if (gettokenData.code === 0) {
              _this.token = gettokenData.data.token
              _this.openid = gettokenData.data.openId
              resolve(gettokenData)
            }
          }).catch(err => {
            _this.login()
          })
        }
      })
    })
  },
  getSetting () {
    // 获取用户信息
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          // 判断是否返回了用户信息 *****
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: UserInfo => {
                resolve(UserInfo)
                // userInfo gender 性别 0 未知； 1 男性； 2 女性 Boolean(Number(gender) ? !(Number(gender) - 1) : 1)
                // userInfo nickName 昵称
                // userInfo avatarUrl 头像
                this.globalData.userInfo = UserInfo.userInfo
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                this.setuserinfo(UserInfo)
              }
            })
          } else {
            reject(`reject authSetting`)
          }
        },
        fail: err => {
          reject(err)
        }
      })
    })
  },
  setuserinfo (res) {
    // 注册用户信息
    return new Promise((resolve, reject) => {
      this.$('setuserinfo', {
        openid: this.openid,
        photo: res.userInfo.avatarUrl,
        nickname: res.userInfo.nickName,
        sex: Number(res.userInfo.gender) ? !(Number(res.userInfo.gender) - 1) : 1
      }).then(res => {
        this.userId = res.data.id
        resolve(res.data.id)
      })
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
        },
        fail: res => {
          reject(res)
        }
      })
    })
  }
})