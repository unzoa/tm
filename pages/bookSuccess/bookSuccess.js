// pages/bookSuccess/bookSuccess.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res: {
      name: '',
      level: 1,
      levelInfo: '',
      place: '',
      coach: '',
      time: '',
      bookNum: '',
      bookStatus: '',
      bookTime: ''
    },
    cancelShow: false,
    msg: '',
    id: ''
  },
  cancelShow () {
    this.setData({
      cancelShow : true
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
      app.$('CancelReserve', {
        ReserveId: this.data.id
      }).then(res => {
        this.setData({
          msg: res.msg
        })
        this.selectComponent('#message').show()

        if (res.code === 0) {
          let dr = this.data.res
          dr.bookStatus = app.voucherStatus['-1']
          this.setData({
            res: dr
          })
        }
      })
      cancelShow()
    } else {
      cancelShow()
    }
  },
  getReserveDetail (id) {
    app.$('GetReserveDetail', {
      ReserveId: id
    }).then(res => {
      let d = res.data
      let r= this.data.res
      r.name = d.courseName
      r.level = d.courseDifficulty
      r.levelInfo = `L${d.courseDifficultyMin}~L${d.courseDifficultyMax}`
      r.place = d.venueName
      r.coach = d.coachName
      r.time = d.schoolDatetime.split('T')[0] + ' ' + d.schoolDatetime.split('T')[1]
      r.bookNum = d.reserveId
      r.bookStatus = app.voucherStatus[d.voucherStatus]
      r.bookTime = d.reserveDate.split('T')[0] + ' ' + d.reserveDate.split('T')[1]
      this.setData({
        res: r
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 数据
    this.getReserveDetail(options.id)
    this.setData({
      id: options.id
    })
  }
})