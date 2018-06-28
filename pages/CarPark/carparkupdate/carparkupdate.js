// pages/CarPark/carparkupdate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carparkId:'2341241'
  },

  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    var that = this;
    var carparkId = '2341241';
    wx.request({
      url: 'http://192.168.0.177/spm/carparkpublish/getCarParkPublish.do',
      data: {
        carparkid: carparkId
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          publishinfo: res.data
        })
      }
    })


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  updatepublishInfo: function (e) {
    var that = this;
    var formData = e.detail.value;
    console.log(formData)
    wx.request({
      method: 'POST',
      url: 'http://192.168.0.248/spm/carparkpublish/updateCarParkPublish.do',
      data: formData,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data == "success") {
          console.log("修改成功" + res.data)
          wx.navigateTo({
            url: '../carparkindex/carparkindex'
          })
        } else {
          console.log("修改失败" + res.data)
        }

      }
    })

  }
})