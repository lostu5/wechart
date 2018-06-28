var app = getApp()
// var step = 1 // 当前操作的step  
var maxTime = 60
var currentTime = maxTime //倒计时的事件（单位：s）  
var interval = null
var hintMsg = null // 提示  

var check = require("../../utils/check.js")
var webUtils = require("../../utils/registerWebUtil.js")
var step_g = 1

var phoneNum = null, identifyCode = null, password = null, rePassword = null, userAccount = null, timer = 1, phoneExist = null;

Page({
  data: {
    windowWidth: 0,
    windoeHeight: 0,
    icon_phone: "../../images/icon_phone.png",
    input_icon: "../../images/edit.png",
    icon_password: "../../images/key.png",
    icon_user: "../../images/name.png",
    location: "中国",
    nextButtonWidth: 0,
    step: step_g,
    time: currentTime,
    disabled: false,
    getmsg: "获取短信验证码",
    phoneExist: ""
  },
  onLoad: function () {
    step_g = 1
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          nextButtonWidth: res.windowWidth - 20
        })
      }
    })
  },
  onUnload: function () {
    currentTime = maxTime
    if (interval != null) {
      clearInterval(interval)
    }
  },
  nextStep: function () {
    var that = this
    var a = false;

    if (step_g == 1) {
      if (firstStep()) {

        wx.request({
          url: 'http://192.168.0.177:8080/spm/phoneExist.do',
          header: {
            // 'content-type': 'application/json'
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            phoneNum: phoneNum
          },
          success: function (res) {
            phoneExist = res.data.msg
            if (phoneExist != "NoUser") {
              step_g = 2
              that.setData({
                step: step_g
              })
              hintMsg = null;
            } else {
              hintMsg = "该手机号未注册！";
              step_g = 1;
              that.setData({
                step: step_g
              })
            }

          },
          complete: function (res) {
            if (hintMsg != null) {
              wx.showToast({
                title: hintMsg,
                icon: 'none',
                duration: 1000
              })
            }
            hintMsg = null
          }

        });






      } else {
        if (hintMsg != null) {
          wx.showToast({
            title: hintMsg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    } else if (step_g == 2) {
      if (secondStep()) {
        step_g = 3
        clearInterval(interval)
      }
      if (hintMsg != null) {
        wx.showToast({
          title: hintMsg,
          icon: 'none',
          duration: 1000
        })
      }
      this.setData({
        step: step_g
      })
    } else {
      if (thirdStep()) {
        // 完成注册  
        wx.redirectTo({
          url: '../login/login'
        })
      }
      if (hintMsg != null) {
        wx.showToast({
          title: hintMsg,
          icon: 'none',
          duration: 1000
        })
      }
    }

  },
  input_phoneNum: function (e) {
    phoneNum = e.detail.value
  },
  input_identifyCode: function (e) {
    identifyCode = e.detail.value
  },
  input_user: function (e) {
    userAccount = e.detail.value
  },
  input_password: function (e) {
    password = e.detail.value
  },
  input_rePassword: function (e) {
    rePassword = e.detail.value
  },
  sendmessg: function (e) {
    if (webUtils.submitPhoneNum(phoneNum)) {
      hintMsg = "发送成功"
    }
    if (timer == 1) {
      timer = 0
      var that = this
      var time = 60
      that.setData({
        disabled: true
      })
      var inter = setInterval(function () {
        that.setData({
          getmsg: time + "s后重新发送",
        })
        time--
        if (time < 0) {
          timer = 1
          clearInterval(inter)
          that.setData({
            disabled: false,
            getmsg: "获取短信验证码",
          })
        }
      }, 1000)
    }

    return true
  }
})

function firstStep() { // 提交电话号码，获取［验证码］
  var that = this;

  if (!check.checkPhoneNum(phoneNum)) {
    console.log(phoneNum)
    hintMsg = "请输入正确的电话号码!"
    return false
  }
  return true
}

function secondStep() { // 提交［验证码］  
  if (!check.checkIsNotNull(identifyCode)) {
    hintMsg = "请输入验证码!"
    return false
  }

  if (webUtils.submitIdentifyCode(identifyCode)) {
    hintMsg = null
    return true
  }
  hintMsg = "提交错误，请稍后重试!"
  return false
}

function thirdStep() { // 提交［密码］和［重新密码］  


  if (!check.isContentEqual(password, rePassword)) {
    hintMsg = "两次密码不一致！"
    return false
  }

  if (webUtils.updatePassword(password, phoneNum)) {
    hintMsg = "密码修改成功"
    return true
  }
  hintMsg = "提交错误，请稍后重试!"
  return false
}  