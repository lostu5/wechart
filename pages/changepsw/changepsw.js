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
  fogot: function () {
    wx.showModal({
      title: '你的账号当前已经绑定手机号，可以通过短信验证码重置账号密码，是否发送验证码到17703341142？',
      confirmText:'发送',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})