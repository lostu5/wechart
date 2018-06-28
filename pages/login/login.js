Page({
  data: {
    userName: '',
    userPwd: ''
  },

  // 获取输入账号  
  phoneInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },

  // 获取输入密码  
  passwordInput: function (e) {
    this.setData({
      userPwd: e.detail.value
    })
  },

  // 登录  
  login: function () {
    var that = this
    if (that.data.userName.length == 0 || that.data.userPwd.length == 0) {
      wx.showModal({
        title: '登陆提示',
        content: '账号或密码不能为空,请检查输入是否正确!',
        showCancel : false,
        success: function (res) {
          if (res.confirm) {        
          }
        }
      })
    } else {
      wx.request({
        url: 'http://192.168.100.177:8080/spm/login.do',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          userName: that.data.userName,
          userPwd: that.data.userPwd,
          session_key: wx.getStorageSync('session_key'),
        },
        success: function (res) {
          if (res.data.msg == "NoUser") {
            wx.showToast({
              title: '账号不存在,请重新输入',
              icon: 'none',
            });
          } else if (res.data.msg == "NoPWD"){
            wx.showToast({
              title: '密码输入不正确,请重新输入',
              icon: 'none',
            });
          } else {
            console.log(res.data);
            wx.setStorageSync('Cookie', 'JSESSIONID=' + res.data.sessionIdReally);
            wx.setStorageSync('sessionId', res.data.sessionId);
            wx.setStorageSync('phone', res.data.phone);
            wx.setStorageSync('userId', res.data.userId);
            wx.setStorageSync('loginStatus', 'yes')
         
            wx.reLaunch({
              url: '../user/user',
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          });

        }

      });

    }
    // wx.switchTab({
    //   url: '../index/index',
    // })
  }
})  