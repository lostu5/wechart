//app.js
App({
  data:{
    orderFlag:false
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var sessionId=wx.getStorageSync('sessionId')


// 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
              var code = res.code;
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              console.log('获取用户登录凭证：' + code);
              // --------- 发送凭证 ------------------
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx60e22249da4f9be3&secret=f1ead40b855a15ed0b7b6523e4b536eb&js_code='+ code +'&grant_type=authorization_code',
                data: {},
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  console.log("wx.request-onlogin-" + JSON.stringify(res));
                    wx.setStorageSync('openid', res.data.openid);
                    wx.setStorageSync('session_key', res.data.session_key);
                }
              });
              // ------------------------------------
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
        //结束
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
   
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      console.log(1111111)
      // 请求完新版本信息的回调
      console.log(res)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })

  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    address:null
  }
})