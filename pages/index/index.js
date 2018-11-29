//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hideAd: true,
    act: '',
    shopArr: [],
    shopIndex: 0,
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    titleHeight: 25,
    coverHeight: 150,
    coverData: [],
    timeItemH: 0,
    timeData: [],
    menuListIndex: 0,
    swiperItem: 0,
    mediaRes: [],
    top: 0
  },
  // 事件处理函数
  scancode () {
    wx.scanCode({
      success: (res) => {
        console.log(res)
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (res) => {
        // wx.showToast({
        //   title: '失败',
        //   icon: 'none',
        //   duration: 2000
        // })
      },
      complete: (res) => {
      }
    })
  },
  // 测试选择器
  bindPickerChange (e) {
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
  getShop () {
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
        shopArr: res.data.venueDataList
      })
    }).catch(res => {
      // alert(JSON.stringify(res))
    })
  },
  getShopInfo (id) {
    this.setData({
      mediaRes: [],
      menuListIndex: 0,
      swiperItem: 0
    })

    let hideAd = () => {
      let _this = this
      setTimeout(() => {
        _this.setData({
          hideAd: false
        })
        wx.showTabBar()
      }, 2000)
    }
    app.$('VenueHomeInfo', {
      VenueId: id
    }).then(res => {
      // console.log(res)
      // 遍历课程
      if (res.code === 0) {
        let d = res.data.venueHomeCourseList
        let p = res.data.venuePhotoList.venueDataList

        let timeNav = this.getTime()
        let mediaRes = []
        
        timeNav.forEach((m, n) => {
          let mediaResItemRes = []
          d.forEach((i, j) => {
            let weekTime = i.weekTime.split('-')[1] + '.' + i.weekTime.split('-')[2] // (new Date(i.weekTime).getMonth() + 1) + '.' + new Date(i.weekTime).getDate()
            if (m.month === weekTime) {
              i.courseList.forEach((x, y) => {
                mediaResItemRes.push({
                  id: x.courseId,
                  img: app.imgPath + x.coursePhoto,
                  title: x.courseName,
                  level: x.courseLevel,
                  time: x.teachingTime,
                  status: app.courseReserve[x.courseReserve]
                })
              })
            }
          })

          mediaRes.push(mediaResItemRes)
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
      hideAd()
      // 停止下拉状态
      wx.stopPullDownRefresh()
    }).catch(error => {
      hideAd()
      // 停止下拉状态
      wx.stopPullDownRefresh()
    })
  },
  onLoad: function () {
    // wx.navigateTo({
    //   url: '/pages/project/project' 
    // })

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
    /*
    @ 数据
    */
    // 由于是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    if (Boolean(app.token)) {
      this.getShop()
    } else {
      app.tokenCallback = token => {
        this.getShop()
      }
    }

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
      title: 'Welcome to the SHOP TuoMai',
      path: '/pages/index/index'
    }
  },
  onPullDownRefresh: function () {
    this.setData({
      coverData: [],
      mediaRes: [],
      menuListIndex: 0,
      swiperItem: 0
    })
    this.getShop()
  }
})
