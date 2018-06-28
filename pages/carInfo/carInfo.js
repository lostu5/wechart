
var carInfoData = {
  carinfo: '',
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carInfoData
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userId  = wx.getStorageSync('userId');
    if(userId!=""){
      wx.request({
        url: 'http://192.168.0.248/spm/carInfo/getCarInfoByUserId.do',
        data: {
          userId: userId
        },
        success: function (res) {
          console.log(res.data)
          that.setData({
            carinfo: res.data
          })
        }
      })
    }else{
      wx.redirectTo({
        url: '../login/login',
      })
    }
  },
  //点击切换隐藏和显示
  toggleBtn: function (event) {
    var that = this;
    var toggleBtnVal = that.data.uhide;
   // console.log(toggleBtnVal);
    var itemId = event.currentTarget.id;
    if (toggleBtnVal == itemId) {
      that.setData({
        uhide: 0
      })
    } else {
      that.setData({
        uhide: itemId
      })
    }
  },
  //点击修改车辆信息
  updatecarinfo: function (event) {
    console.log(event.currentTarget)
    var that = this;
    var carInfoid = event.currentTarget.dataset.aid;
    wx.navigateTo({
      url: '../updatecarInfo/updatecarInfo?carInfoid=' + carInfoid
    })
  },
  //删除该条信息
  deletecarinfo: function (event) {
   var userId = wx.getStorageSync('userId');
    wx.showModal({
      title: '提示',
      content: '确定删除该条信息？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var that = this;
          var carInfoid = event.currentTarget.dataset.aid;
          wx.request({
            url: 'http://192.168.0.248/spm/carInfo/deleteCarInfo.do',
            data: {
              carInfoId: carInfoid,
              userId: userId
            },
            success: function (res) {
              console.log(res.data)
              if (res.data == "success") {
                console.log("删除成功" + res.data)
                wx.redirectTo({
                  url: '../carInfo/carInfo'
                })
              } else {
                console.log("删除失败" + res.data)
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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

  addcarinfo: function () {
    wx.navigateTo({
      url: '../addcarInfo/addcarInfo'
    })
  }

  
})



