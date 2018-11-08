//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    titleHeight: 25,
    coverHeight: 150,
    coverData: [
      {
        img: '/img/aa.jpg',
        w: 0,
        h: 0
      },
      {
        img: '/img/bb.jpg',
        w: 0,
        h: 0
      } 
    ],
    timeItemH: 0,
    timeData: [],
    mediaRes: [],
    top: 0,
    swiperItem: 0
  },
  //事件处理函数
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
  onLoad: function () {
    wx.navigateTo({
      url: '/pages/bookList/bookList' 
    })
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
    let mediaRes = []
    let mediaResItem = [10, 5, 7, 6, 4]
    for (let i = 0; i < 5; i++) {
      let mediaResItemRes = []
      for (let j = 0; j < mediaResItem[i]; j++) {
        mediaResItemRes.push({
          id: Number(String(i + 1) + String(j)),
          img: '/img/img.png',
          title: '拓脉-训练 ' + i + j,
          level: String(Math.floor(Math.random() * 5 + 1)),
          time: '13:30-15:20',
          status: 2
        })
      }
      mediaRes.push(mediaResItemRes)
    }
    this.setData({
      timeItemH: (wx.getSystemInfoSync().windowWidth - 30) / 5,
      timeData: this.getTime(),
      mediaRes: mediaRes
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
    // wx.showLoading({
    //   title: 'haha',
    // })
    // wx.showToast({
    //   title: 'loading...',
    //   icon: 'loading',
    //   duration: 2000
    // })
    // setTimeout(() => {
    //   wx.stopPullDownRefresh()
    // }, 2000)
  }
})
