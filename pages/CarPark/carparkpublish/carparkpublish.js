
var carInfoData = {

}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: "2341241",
    address: "",
    detailAddress: "",
    latitude: "",
    longitude: "",
    province: "",
    city: "",
    district: "",
  },
  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorageInfo({
      success: function (res) {
        console.log(res);
      },
    })
  },
  insertpublishInfo: function (e) {
    var that = this;
    var formData = e.detail.value;
    console.log(formData)
    wx.request({
      method: 'POST',
      url: 'http://192.168.0.248/spm/carparkpublish/insertCarParkPublish.do',
      data: formData,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data == "success") {
          console.log("插入成功" + res.data)
          wx.navigateTo({
            url: '../carparkindex/carparkindex'
          })
        } else {
          console.log("插入失败" + res.data)
        }

      }
    })

  },
  chooseLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          address: res.name
        })
        that.setData({
          detailAddress: res.address + res.name
        })
        that.setData({
          latitude: res.latitude
        })
        that.setData({
          longitude: res.longitude
        })

        wx.request({
          url: 'https://api.map.baidu.com/geocoder/v2/?ak=YYqAwaRbp78y8DKbborIC4FFn2oHqnv9&location=' + that.data.latitude + ',' + that.data.longitude + '&output=json',
          data: {},
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            // success     
            that.setData({
              city: res.data.result.addressComponent.city
            })
            that.setData({
              province: res.data.result.addressComponent.province
            })
            that.setData({
              district: res.data.result.addressComponent.district
            })
          },
          fail: function () {
            that.setData({ currentCity: "获取定位失败" });
          }

        })
      }
    })





  }

})



