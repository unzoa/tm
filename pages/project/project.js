// pages/project/project.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res: {
      title: 'BODYPUMP 杠铃塑形',
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
      coach: '阿哲',
      time: '2018.10.15 20:30-21:30',
      placeName: '温州市哦欧呗xxxxxx',
      placeLatitude: 23.099994,
      placeLongitude: 113.324520,
      booked: {
        has: 8,
        max: 12,
        headImg: ['/img/img.png']
      },
      level: 3,
      levelFit: '初级',
      content: '<h1>content title</h1><p>content this ...</p>'
    },
    coverHeight: 150,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 数据
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})