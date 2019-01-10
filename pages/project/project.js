// pages/project/project.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLogin: false, // 登陆按钮显示
    getTokenShow: false, // token 的回掉显示
    id: 1,
    userId: 0,
    coverData: [],
    current: 0,
    res: {
      title: '课程名称',
      coverData: [],
      coach: '教练名字',
      time: '时间',
      placeName: '地点',
      placeLatitude: 0,
      placeLongitude: 0,
      booked: {
        has: 0,
        max: 0,
        headImg: ['/img/img.png'],
        pp: []
      },
      level: 1,
      levelInfo: '',
      levelFit: '初级',
      content: ''
    },
    coverHeight: 150,
    coverPadding: 30,
    cancelShow: false,
    msg: '',
    courseReserveMsg: ''
  },
  getUserInfo: function(e) {
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
        this.setData({
          userId: userId,
          cancelShow : false
        })
        this.setCourseReserve()
      })
      // 显示单独领取按钮
      this.setData({
        showLogin: false
      })
    } else {
      console.log('没有授权')
    }
  },
  checkPlace () {
    let _this = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(Number(_this.data.res.placeLatitude), Number(_this.data.res.placeLongitude))
        wx.openLocation({
          latitude: Number(_this.data.res.placeLatitude), // 要去的纬度-地址
          longitude: Number(_this.data.res.placeLongitude), // 要去的经度-地址
          name: _this.data.res.placeName, // 调用本地地图时候用到
          address: ''
        })
      }
    })
  },
  showBooked () {
    this.selectComponent('#dialog').show()
  },
  getCourseInfo (id) {
    let r = this.data.res
    r.coverData = []
    this.setData({
      res: r,
      current: 0
    })
    app.$('GetCourseInfo', {
      'CourseId': id
    }).then(res => {
      console.log(res)
      if (res.code === 0) {
        let pr = this.data.res
        let d = res.data
        let photos = d.coursePhoto

        pr.title = d.courseName
        if (photos.length) {
          // cover con height
          wx.getImageInfo({
            src: app.imgPath + photos[0].photoPath,
            success: imgRes => {
              let ratio = imgRes.width / imgRes.height
              this.setData({
                coverHeight: (wx.getSystemInfoSync().windowWidth - this.data.coverPadding) / ratio
              })
            }
          })
          photos.forEach((i, j) => {
            pr.coverData.push({
              img: i.photoPath ? (app.imgPath + i.photoPath) : '/img/img.png',
              w: 0,
              h: 0,
              jump: ''
            })
          })
        }
        pr.coach = d.coachName
        pr.time = d.schooltime
        pr.placeName = d.venueAddress
        pr.placeLatitude = d.lat
        pr.placeLongitude = d.lng
        pr.booked.max = d.limitNumsMax
        pr.booked.has = d.reservePerson || 0
        pr.booked.pp = d.reserveList
        pr.level = d.courseLevel
        pr.levelInfo = `L${d.courseDifficultyMin}~L${d.courseDifficultyMax}`,
        pr.levelFit = d.courseLevelInfo
        pr.content = d.courseInfo
        
        let courseReserveMsg = ''
        if (d.isHasvoucher) {
          courseReserveMsg = '您有一张团体体验券，' + util.formatTime(d.voucherExpireDatetime) + '过期，确认使用吗？'
        } else {
          courseReserveMsg = `您还剩余${d.leagueNum}节团体课，确定预约吗？`
        }
        pr.voucherId = d.voucherId

        this.setData({
          res: pr,
          courseReserveMsg: courseReserveMsg
        })
        // 停止下拉状态
        wx.stopPullDownRefresh()
      }
    })
  },
  setCourseReserve () {
    app.$('SetCourseReserve', {
      UserId: app.userId,
      CourseId: this.data.id,
      CourseClassId: 1,
      VoucherId: this.data.res.voucherId
    }).then(res => {
      this.setData({
        msg: res.msg
      })
      this.selectComponent('#message').show()
      if (res.msg.indexOf('成功')) {
        this.getCourseInfo(this.data.id)
      }
    })
  },
  showBookCon () {
    this.setData({
      cancelShow: true
    })
  },
  cancelBook (e) {
    let b = e.currentTarget.dataset.b
    let cancelShow = () => {
      this.setData({
        cancelShow : false
      })
    }
    if (b === 'true') {
      // 异步取消预约
      this.setCourseReserve()
      cancelShow()
    } else {
      cancelShow()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 数据
    // console.log(options)
    this.setData({
      id: options.id
    })

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
        this.getCourseInfo(options.id)
      })
    } else {
      console.log(app.userId)
      // 页面动作
      this.getCourseInfo(options.id)
      this.setData({
        userId: app.userId,
        getTokenShow: true // 得到token
      })
    }
  },
  onPullDownRefresh: function () {
    this.getCourseInfo(this.data.id)
  },
  onShareAppMessage: function () {
    return {
      title: '私教邦-' + this.data.res.title,
      path: '/pages/project/project?id=' + this.data.id
    }
  }
})