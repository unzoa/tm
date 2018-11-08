// pages/bookList/bookList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mediaRes: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    @ 数据
    */
    let mediaRes = []
    for (let i = 0; i < 5; i++) {
      mediaRes.push({
        id: Number(String(i + 1)),
        img: '/img/img.png',
        title: '拓脉-训练 ' + i,
        level: String(Math.floor(Math.random() * 5 + 1)),
        time: '13:30-15:20',
        status: 2
      })
    }
    this.setData({
      mediaRes: mediaRes
    })
  }
})