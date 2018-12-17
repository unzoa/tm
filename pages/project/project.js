// pages/project/project.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 1,
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
    msg: ''
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
        this.setData({
          res: pr
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
      VoucherId: 0
    }).then(res => {
      this.setData({
        msg: res.msg
      })
      this.selectComponent('#message').show()
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
    this.getCourseInfo(options.id)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onPullDownRefresh: function () {
    let r = this.data.res
    r.coverData = []
    this.setData({
      res: r,
      current: 0
    })
    this.getCourseInfo(this.data.id)
  }
})