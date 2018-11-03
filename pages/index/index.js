//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navH: 0,
    timeItemH: 0,
    timeData: [],
    mediaRes: [
      [{
        id: 11,
        img: '/img/img.png',
        title: 'this is title11',
        level: '1',
        time: '12:30-13:20',
        status: 1
      }, {
        id: 12,
        img: '/img/img.png',
        title: 'this is title12',
        level: '2',
        time: '13:30-15:20',
        status: 2
      }, {
        id: 13,
        img: '/img/img.png',
        title: 'this is title13',
        level: '2',
        time: '13:30-15:20',
        status: 2
      }, {
        id: 14,
        img: '/img/img.png',
        title: 'this is title14',
        level: '2',
        time: '13:30-15:20',
        status: 2
      }, {
        id: 15,
        img: '/img/img.png',
        title: 'this is title15',
        level: '2',
        time: '13:30-15:20',
        status: 2
      }, {
        id: 16,
        img: '/img/img.png',
        title: 'this is title16',
        level: '2',
        time: '13:30-15:20',
        status: 2
      }, {
        id: 17,
        img: '/img/img.png',
        title: 'this is title17',
        level: '2',
        time: '13:30-15:20',
        status: 2
      }, {
        id: 18,
        img: '/img/img.png',
        title: 'this is title18',
        level: '2',
        time: '13:30-15:20',
        status: 2
      }, {
        id: 19,
        img: '/img/img.png',
        title: 'this is title19',
        level: '2',
        time: '13:30-15:20',
        status: 2
      }],
      [{
        id: 21,
        img: '/img/img.png',
        title: 'this is title21',
        level: '2',
        time: '12:30-13:20',
        status: 1
      }, {
        id: 22,
        img: '/img/img.png',
        title: 'this is title22',
        level: '3',
        time: '13:30-15:20',
        status: 2
      }],
      [{
        id: 31,
        img: '/img/img.png',
        title: 'this is title31',
        level: '3',
        time: '12:30-13:20',
        status: 1
      }, {
        id: 32,
        img: '/img/img.png',
        title: 'this is title32',
        level: '4',
        time: '13:30-15:20',
        status: 2
      }],
      [{
        id: 41,
        img: '/img/img.png',
        title: 'this is title41',
        level: '4',
        time: '12:30-13:20',
        status: 1
      }, {
        id: 42,
        img: '/img/img.png',
        title: 'this is title42',
        level: '5',
        time: '13:30-15:20',
        status: 2
      }],
      [{
        id: 51,
        img: '/img/img.png',
        title: 'this is title51',
        level: '5',
        time: '12:30-13:20',
        status: 1
      }, {
        id: 52,
        img: '/img/img.png',
        title: 'this is title52',
        level: '1',
        time: '13:30-15:20',
        status: 2
      }]
    ],
    top: 0,
    swiperItem: 0
  },
  //事件处理函数
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
      let cn = '一'
      switch (Number(day)) {
        case 1:
          cn = '一'
          break
        case 2:
          cn = '二'
          break
        case 3:
          cn = '三'
          break
        case 4:
          cn = '四'
          break
        case 5:
          cn = '五'
          break
        case 6:
          cn = '六'
          break
        case 0:
          cn = '日'
          break
      }
      return cn
    }
    const dayCnFormat = (day, today) => {
      if (day === 0) {
        return '今天'
      } else {
        return '星期' + today
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
  onLoad: function () {
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
    // 设置数据
    this.setData({
      navH: app.globalData.navHeight,
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
      title: '标题栏目可以自定义了',
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
  },
  onPageScroll:function(e){
    this.setData({
      top: e.scrollTop
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
