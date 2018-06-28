Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',
    userInfo:[],
    rechargeID:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let object = JSON.parse(options.str);  
    console.log(object)
    that.setData({
      userInfo: object
    })
  },
  bindInput:function(e){
    this.setData({
      money: e.detail.value
    })
  },
  charge: function(){
    var that = this
    wx.request({
      url: 'http://192.168.0.177:8080/spm/rechargeToOrder.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        money: that.data.money,
        userId: that.data.userInfo.userId,
        status:'0'
      },
      success: function (res) {
        that.setData({
          rechargeID: res.data.rechargeId
        })
        //调用支付
        that.pay()
         console.log(res)},
      fail: function (res) { console.log(res) }
    })
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
        'orderShowPrice': that.data.money,
        'orderType': '2',
        'orderId': that.data.rechargeID
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
    var that = this
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': function (res) {
        console.log(res)
        
        if (res.errMsg == 'requestPayment:ok') {
          //更新数据到客户信息
          wx.request({
            url: 'http://192.168.0.177:8080/spm/updateMoney.do',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: { 
              'money': that.data.money,
              'rechargeID': that.data.rechargeID,
              'userId': that.data.userInfo.userId,
              'status': '1'
              
              },
            success: function (res) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',

              })
              wx.reLaunch({
                url: '../user/user',
              })

            },fail: function (res){
              wx.showToast({
                title: '数据错误,请联系客服',
                icon: 'none',

              })
            }
            
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
  },
  balanceDetail : function(){
    wx.navigateTo({
      url: '../balanceDetail/balanceDetail',
    })
  }
})