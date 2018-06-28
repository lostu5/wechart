Page({
  data: {
    items: [
      { name: '0', value: '管理员', checked: 'true' },
      { name: '1', value: '操作员' }
    ]
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var that = this;
    that.setData({
      role: e.detail.value
    })
  },
  login: function (e) {
    var that = this;
    var formData = e.detail.value;
    console.log(formData)
    wx.request({
      method: 'POST',
      url: 'http://192.168.0.248/spm/CarPark/CarParkLogin.do',
      data: formData,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data == "0") {
          console.log("管理员登录成功" + res.data)
          wx.navigateTo({
            url: '../carparkindex/carparkindex'
          })
        } else if (res.data == "1"){
          console.log("操作员登录成功" + res.data)
        }else{
          console.log("账号或密码错误" + res.data)
        }

      }
    })
  }
})
