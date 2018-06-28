Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginStatus: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  set: function (){
    wx.setStorageSync('loginStatus', 'no');
    wx.setStorageSync('Cookie', 'JSESSIONID=""' );
    wx.setStorageSync('sessionId', '');
    wx.setStorageSync('phone', '');
    wx.setStorageSync('userId', '');
    wx.reLaunch({
      url: '../user/user',
    })
  },
  changepsw:function(){
    wx.navigateTo({
      url: '../changepsw/changepsw'
    })
  },
  modalcnt: function () {
    wx.showModal({
      title: '将清空所有缓存记录',
      confirmText:'清空',
      success: function (res) {
        if (res.confirm) {
          var res = wx.getStorageInfoSync()
          console.log(res.keys)
          console.log(res.currentSize)
          console.log(res.limitSize)
    //wx.clearStorageSync()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})