// 提交［电话号码］  
function submitPhoneNum(phoneNum){  
    // 此处调用wx中的网络请求的API，完成电话号码的提交  
     wx.request({
          url: 'http://192.168.0.177:8080/spm/sendIdentifyingCode.do',
          method: 'POST',
          header: {
          // 'content-type': 'application/json'
          'content-type': 'application/x-www-form-urlencoded'
           },
           data: {
           mobile: phoneNum                  
           },
           success: function (res){
           wx.setStorageSync('identifyingCodeReally', res.data);
            },
           fail: function (res) {
            console.log(res)
            }
           
                         });
     return true;
    
}  
  
//提交［验证码］  
function submitIdentifyCode(identifyCode){  
    // 此处调用wx中的网络请求的API，完成短信验证码的提交  
    if (identifyCode!=wx.getStorageSync('identifyingCodeReally')) {
	return false;
    }
    
    return true;
}  
  
// 提交［密码］,前一步保证两次密码输入相同  
function submitPassword(userAccount, password, phoneNum, status) {
  if (status == "1" && userAccount != null && userAccount != "" && password != null && password != "") {
    wx.request({
      url: 'http://192.168.0.177:8080/spm/addUserInfo.do',
      method: 'POST',
      header: {
        // 'content-type': 'application/json'
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userName: userAccount,
        userPwd: password,
        openId: wx.getStorageSync('openid'),
        nickName: getApp().globalData.userInfo.nickName,
        image: getApp().globalData.userInfo.avatarUrl,
        mobile: phoneNum
      },
      success: function (data) {

        wx.request({
          url: 'http://192.168.0.249:8080/spm/login.do',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            userName: userAccount,
            userPwd: password,
            session_key: wx.getStorageSync('session_key'),
          },
          success: function (res) {
            if (res.data.no == "no") {
              wx.showToast({
                title: '账号密码不对'
              });
            } else {
              console.log(res.data);
              wx.setStorageSync('Cookie', 'JSESSIONID=' + res.data.sessionIdReally);
              wx.setStorageSync('sessionId', res.data.sessionId);
              wx.setStorageSync('phone', res.data.phone);
              wx.setStorageSync('userId', res.data.userId);
              wx.setStorageSync('loginStatus', 'yes');
              wx.reLaunch({
                url: '../user/user'
              })

            }
          },
          fail: function (res) {
            wx.showToast({
              title: '网络错误'
            });

          }

        });
      },
      fail: function (res) {
        console.log(res)

      }
    })
    return true;
  } else {
    return false;
  }
}



// 找回密码
function updatePassword(password, phoneNum) {
  wx.request({
    url: 'http://192.168.0.177:8080/spm/updatePassword.do',
    method: 'POST',
    header: {
      // 'content-type': 'application/json'
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      userPwd: password,
      mobile: phoneNum
    },
    success: function (data) {
     
    }
  })
return true

}  

  
module.exports = {  
    submitPhoneNum : submitPhoneNum,  
    submitIdentifyCode : submitIdentifyCode,  
    submitPassword : submitPassword,
    updatePassword : updatePassword
}  