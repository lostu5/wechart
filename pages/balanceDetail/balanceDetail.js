var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recharge :[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
 
    wx.request({
      url: 'http://192.168.0.177:8080/spm/selectRechargeList.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: wx.getStorageSync("userId")
      },
      success: function (res) {
        console.log(res.data.rechargeList)
        if (res.errMsg =='request:ok'){
          that.setData({
            recharge: res.data.rechargeList
            
          })

        }else{
          wx.showToast({
            title: '网络错误',
            icon: 'loading',
            })
        }
        
      },
      fail: function (res) { console.log(res) }
    })
  }
})