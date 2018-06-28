
var publishInfoData = {
  publishinfo: '',
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    publishInfoData
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //var userId = wx.getStorageSync('userId');
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
  addpublishinfo: function () {
    wx.navigateTo({
      url: '../carparkpublish/carparkpublish'
    })
  },
  addchargerule: function () {
    wx.navigateTo({
      url: '../addchargerule/addchargerule'
    })
  },
  //点击修改信息
  updatepublishinfo: function (event) {
    wx.navigateTo({
      url: '../carparkupdate/carparkupdate?'
    })
  },
  //删除该条信息
  deletepublishinfo: function (event) {
    wx.showModal({
      title: '提示',
      content: '确定删除该条信息？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var that = this;
          var carInfoid = event.currentTarget.dataset.aid;
          wx.request({
            url: 'http://192.168.0.177/spm/carInfo/deleteCarInfo.do',
            data: {
              carInfoId: carInfoid
            },
            success: function (res) {
              console.log(res.data)
              if (res.data == "success") {
                console.log("删除成功" + res.data)
                wx.navigateTo({
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

  }

  


})



