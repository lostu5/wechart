
var carInfoData = {

}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: wx.getStorageSync('userId'),
    item1: ["京", "沪", "浙", "苏", "粤", "鲁", "晋", "冀",
      "豫", "川", "渝", "辽", "吉", "黑", "皖", "鄂",
      "津", "贵", "云", "桂", "琼", "青", "新", "藏",
      "蒙", "宁", "甘", "陕", "闽", "赣", "湘"],
    item2: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
      "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
      "A", "S", "D", "F", "G", "H", "J", "K", "L",
      "Z", "X", "C", "V", "B", "N", "M"],
    hidden1: true,
    hidden2: true,
    carNo: ''
  
  },
  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  },
   d1: function () {
    var that = this;
    if (that.data.carNo == '') {
      that.setData({
        hidden1: false,
        hidden2: true
      })
    } else {
      that.setData({
        hidden1: true,
        hidden2: false
      })
    }

  },
  //车牌输入失去焦点  
  d2: function () {
    var that = this;
    that.setData({
      hidden1: true,
      hidden2: true
    })
  },
  //获取车牌省份  
  sheng: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.sh);
    that.setData({
      carNo: e.currentTarget.dataset.sh
    })
    if (that.data.carNo != '') {
      that.setData({
        hidden1: true,
        hidden2: false
      })
    }
  },
  //获取车牌号码  
  other: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.ot);
    var carNo = that.data.carNo + e.currentTarget.dataset.ot;
    that.setData({
      carNo: carNo
    })
  },
  //回删车牌  
  del: function () {
    var that = this;
    var ss = that.data.carNo;
    console.log(ss);
    var s = ss.split('');
    console.log(s);
    console.log(s.slice(0, -1));
    if (s.slice(0, -1).length == 0) {
      that.setData({
        hidden1: false,
        hidden2: true
      })
    }
    console.log(s.join('').slice(0, -1));
    var s = s.join('').slice(0, -1);
    that.setData({
      carNo: s
    })
    console.log(that.data.carNo.length);

  },
  //确认输入  
  ok: function () {
    var that = this;
    that.setData({
      hidden1: true,
      hidden2: true
    })
  },

  isVehicleNumber: function (vehicleNumber) {
    var result = false;
    if (vehicleNumber.length == 7) {
      var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
      result = express.test(vehicleNumber);
    }
    return result;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var carInfoid = options.carInfoid;
    console.log("233333"+carInfoid);
   var userId = wx.getStorageSync('userId');
    var that = this
    that.setData({
      userId: userId,
      carInfoid: carInfoid
    })

    wx.request({
      url: 'http://192.168.0.248/spm/carInfo/getCarInfoBycarInfoId.do',
      data: {
        carInfoId: carInfoid,
        userId: userId
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          info: res.data,
          carNo:res.data[0].carNumber
        })
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
   updatecarInfo: function (e) {
    var that = this;
    var formData = e.detail.value;
    console.log(formData);

    if (e.detail.value.userTel == 0 || e.detail.value.carNumber == 0 || e.detail.value.carType == 0 || e.detail.value.carColor == 0 || e.detail.value.userName == 0) {
      wx.showToast({
        title: '请将信息填写完整',
        icon: 'none',
        duration: 2000
      })
    } else if (!that.isVehicleNumber(e.detail.value.carNumber)) {
      wx.showToast({
        title: '车牌号格式错误',
        icon: 'none',
        duration: 2000
      })

    }else{
      wx.request({
        method: 'POST',
        url: 'http://192.168.0.248/spm/carInfo/updateCarInfo.do',
        data: formData,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data == "success") {
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000
            })
            wx.navigateTo({
              url: '../carInfo/carInfo'
            })
          } else {
            wx.showToast({
              title: '车牌号存在',
              icon: 'none',
              duration: 2000
            })
          }

        }
      })
    }
  }

})



