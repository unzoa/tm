// pages/bookSuccess/bookSuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res: {
      name: 'className what',
      level: 2,
      place: 'xxxxxxx',
      coach: 'Abama',
      time: '2018.12.20 14:30',
      bookNum: 1234567,
      bookStatus: '2018.12.15 15:31 '
    },
    cancelShow: false
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
    if (b) {
      // 异步取消预约
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
  }
})