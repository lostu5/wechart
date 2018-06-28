
//获取应用实例
var app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: [],
    loginStatus: ""
  },
  onLoad: function () {
    var that = this
    that.setData({
      loginStatus: wx.getStorageSync('loginStatus')
    })
    that.getUserInfo()
  },
  getUserInfo: function () {
    var that = this
    that.data.userInfo.push()
    wx.request({
      url: 'http://192.168.0.177:8080/spm/selectByuserId.do',
      header: {
        // 'content-type': 'application/json'
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { userId: wx.getStorageSync('userId') },
      success: function (res) {
        console.log(res)
        if (res.data.msg == 'NoUser') {
          that.setData({
            loginStatus: 'no'
          })
        } else {
          that.setData({
            userInfo: res.data.userInfo
          })
        }
      },
      fail: function (res) {
      }

    })
  },
  bindGetUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo;
    if (app.globalData.userInfo) {
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  //充值
  recharge: function () {
    var that = this 
    let str = JSON.stringify(that.data.userInfo);  
    if (that.data.loginStatus == "yes") {

      wx.navigateTo({
        url: '../recharge/recharge?str=' + str,
      })
    } else {
      wx.showModal({
        title: '访问错误',
        content: '您还没有登陆,请先登录',
      })
    }
  },
  //提现
  //版本更新
  updateManager:function(){
    wx.navigateTo({
      url: '../updateManager/updateManager',
    })
  },
  //车辆管理
  carinfo:function(){
    wx.navigateTo({
      url: '../carInfo/carInfo',
    })
  },
  help: function () {
    wx.navigateTo({
      url: '../help/help',
    })
  },
  aboutus:function(){
    wx.navigateTo({
      url: '../aboutus/aboutus',
    })
  },
  //设置
  set: function () {
    var that = this
    if (that.data.loginStatus == "yes") {


    } else {
      wx.navigateTo({
        url: '../set/set',
      })

      wx.showModal({
        title: '访问错误',
        content: '您还没有登陆,请先登录',
      })
    }
  },
  //功能维护中
  weihu: function(){
    wx.showModal({
      title: '维护提醒',
      content: '功能维护中,敬请期待!',
      showCancel: false,
      cancelText: '',
      cancelColor: '',
      confirmText: '',
      confirmColor: '',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }

})