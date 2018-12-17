//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    showLogin: false,
    getTokenShow: true,
    shopArr: [],
    shopIndex: 0,
    titleHeight: 30,
    coverHeight: 150,
    coverPadding: 30,
    coverData: [],
    timeItemH: 0,
    timeData: [],
    menuListIndex: 0,
    swiperItem: 0,
    mediaRes: [],
    top: 0
  },
  // 事件处理函数
  getUserInfo: function(e) {
    // console.log(e)
    if (e.detail.userInfo) {
      wx.showTabBar()
      app.globalData.userInfo = e.detail.userInfo
      app.setuserinfo(e.detail)
      this.setData({
        showLogin: false
      })
    }
  },
  scancode () {
    wx.scanCode({
      success: (res) => {
        console.log(res)
        app.$('lockControl', {
          cmd: res.result.split('?')[1].split('=')[1]
        }).then(lockData => {
          wx.showToast({
            title: lockData.msg,
            icon: 'success',
            duration: 2000
          })
        })
      }
    })
  },
  // 测试选择器
  bindPickerChange (e) {
    this.setData({
      coverData: [],
      mediaRes: [],
      menuListIndex: 0,
      swiperItem: 0
    })
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.getShopInfo(this.data.shopArr[e.detail.value].id)
    this.setData({
      shopIndex: e.detail.value
    })
  },
  // 列表swiper
  swiperChange (e) {
    let time = this.data.timeData
    for (let i = 0; i < time.length; i++) {
      time[i].showMD = false
    }
    time[e.detail.current].showMD = true
    this.setData({
      timeData: time,
      swiperItem: e.detail.current
    })
  },
  changeMenu (e) {
    let data = e.currentTarget.dataset
    this.setData({
      menuListIndex: data.index
    })
  },
  getTime () {
    const doHandleMonth = (month) => {
      var m = month
      if (month.toString().length == 1) {
        m = "0" + month
      }
      return m
    }
    const dayCn = (day) => {
      let zhou = ['日', '一', '二', '三', '四', '五', '六']
      return zhou[day]
    }
    const dayCnFormat = (day, today) => {
      if (day === 0) {
        return '今天'
      } else {
        return '周' + today
      }
    }
    const getDay = (day) => {
      let today = new Date();
      let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
      today.setTime(targetday_milliseconds)
      let tMonth = doHandleMonth(today.getMonth() + 1)
      let tDate = doHandleMonth(today.getDate())
      return {
        id: day,
        num: today.getDay(),
        cn: dayCn(today.getDay()),
        showMD: false,
        month: tMonth + "." + tDate,
        day: dayCnFormat(day, dayCn(today.getDay()))
      }
    }
    let timeData = []
    for (let i = 0; i < 5; i++) {
      timeData.push(getDay(i))
    }
    timeData[0].showMD = true
    return timeData
  },
  onPageScroll:function(e){
    this.setData({
      top: e.scrollTop
    })
  },
  clearAll () {
    this.getTime()
    this.setData({
      coverData: [],
      mediaRes: [],
      menuListIndex: 0,
      swiperItem: 0,
      shopIndex: 0
    })
  },
  getShop () {
    this.clearAll()
    app.$('venuelist', {
      where: 1,
      pageindex: 1,
      pagesize: 1,
      ispage: false
    }).then(res => {
      wx.stopPullDownRefresh()
      // console.log(res)
      this.getShopInfo(res.data.venueDataList[0].id)
      this.setData({
        shopIndex: 0,
        shopArr: res.data.venueDataList
      })
    })
  },
  getShopInfo (id) {
    this.clearAll()

    app.$('VenueHomeInfo', {
      VenueId: id
    }).then(res => {
      // console.log(res)
      // 遍历课程
      if (res.code === 0) {
        let d = res.data.venueHomeCourseList // 课程
        let p = res.data.venuePhotoList.venueDataList // cover

        let timeNav = this.getTime()
        let mediaRes = []
        
        timeNav.forEach((m, n) => {
          let mediaResItemRes = []
          d.forEach((i, j) => {
            let weekTime = i.weekTime.split('-')[1] + '.' + i.weekTime.split('-')[2]
            if (m.month === weekTime) {
              i.courseList.forEach((x, y) => {
                mediaResItemRes.push({
                  id: x.courseId,
                  img: app.imgPath + x.coachPhoto,
                  title: x.courseName,
                  level: x.courseLevel,
                  levelInfo: `L${x.courseDifficultyMin}~L${x.courseDifficultyMax}`,
                  time: x.teachingTime,
                  status: app.courseReserve[x.courseReserve]
                })
              })
            }
          })

          mediaRes.push(mediaResItemRes)
        })

        // cover con height
        wx.getImageInfo({
          src: app.imgPath + p[0].photoPath,
          success: imgRes => {
            let ratio = imgRes.width / imgRes.height
            this.setData({
              coverHeight: (wx.getSystemInfoSync().windowWidth - this.data.coverPadding) / ratio
            })
          }
        })

        // cover data
        let cd = []
        if (p.length) {
          p.forEach((i, j) => {
            cd.push({
              img: app.imgPath + i.photoPath,
              w: 0,
              h: 0,
              jump: i.photoHref
            })
          })
        }

        this.setData({
          coverData: cd,
          mediaRes: mediaRes
        })
      }
      // 停止下拉状态
      wx.stopPullDownRefresh()
    }).catch(error => {
      // 停止下拉状态
      wx.stopPullDownRefresh()
    })
  },
  onLoad: function () {
    let _this = this
    // wx.navigateTo({
    //   url: '/pages/project/project' 
    // })

    /*
    @ 数据
    */
    app.login().then(() => {
      _this.setData({
        getTokenShow: false
      })
      this.getShop()
      app.getSetting().then(setData => {
        // 第二次得到授权，可以获取用户信息
        wx.showTabBar()
      }).catch(err => {
        // 第一次需要手动登陆得到用户信息，显示控制按钮
        _this.setData({
          showLogin: true
        })
      })
    })

    this.setData({
      timeItemH: (wx.getSystemInfoSync().windowWidth - 30) / 5,
      timeData: this.getTime()
    })

  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '私教邦训练营',
      path: '/pages/index/index'
    }
  },
  onPullDownRefresh: function () {
    this.getShop()
  }
})
