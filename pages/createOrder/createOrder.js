// pages/creatOrder/creatOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderById(this.options.orderId);
  },
  getOrderById: function (orderId) {
    var that = this;
    wx.request({
      url: 'http://192.168.0.177:8080/spm/Order/getOrdersByOrderId.do',
      data: {
        orderId: orderId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          order: res.data
        })
      }
    });
  },
  pay: function (e) {
    var that = this;
    wx.login({
      success: function (res) {
        console.log(res.code)
        that.getOpenId(res.code);
      }
    });

  },
  //获取openid
  getOpenId: function (code) {
    var that = this;
    wx.request({
      url: 'http://192.168.0.177:8080/spm/getOpenId.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 'code': code },
      success: function (res) {
        var openId = res.data.openid;
        that.xiadan(openId);
      }
    })
  },
  //下单
  xiadan: function (openId) {
    var that = this;
    wx.request({
      url: 'http://192.168.0.177:8080/spm/xiadan.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'openid': openId,
        'orderShowPrice': that.data.order.orderShowPrice,
        'orderType': that.data.order.orderType,
        'orderId': that.data.order.orderId
      },
      success: function (res) {
        console.log(res)
        var prepay_id = res.data.prepay_id;
        console.log("统一下单返回 prepay_id:" + prepay_id);
        if (prepay_id == 'undefined' || prepay_id == null) {
          wx.showToast({
            title: '支付失败,请重新支付!',
            icon: 'none'
          })
        } else {
          that.sign(prepay_id);
        }
      }
    })
  },
  //签名
  sign: function (prepay_id) {
    var that = this;
    wx.request({
      url: 'http://192.168.0.177:8080/spm/sign.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 'repay_id': prepay_id },
      success: function (res) {
        that.requestPayment(res.data);

      }
    })
  },
  //申请支付
  requestPayment: function (obj) {
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': function (res) {
        console.log(res)
        支付成功跳转
        if (res.errMsg =='requestPayment:ok') {
            wx.showToast({
              title: '支付成功',
              icon:'success',
              
            })
              wx.switchTab({
                url: '../order/order',
              })
        }

      },
      'fail': function (res) {
        //网络错误,请重新支付
        wx.showToast({
          title: '支付失败',
          icon: 'loading',
          duration: 4000
        })
      }
    })
  }
})