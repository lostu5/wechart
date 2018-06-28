var app = getApp()
Page({
  data: {
    latitude: "",
    longitude: "",
    publishInfo: [],
    locationLatitude: "",
    locationLongitude: "",
    markers: [{
      iconPath: "../../images/markernew.png",
      id: 0,
      latitude: "",
      longitude: "",
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: "",
        latitude: ""
      }, {
        longitude: "",
        latitude: ""
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }]
  },
  onLoad: function (options) {
    this.getPublishInfoById(options.publishId);
    this.getLocation();
  },
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: function (res) {
        that.setData({
          'polyline[0].points[1].latitude': res.latitude
        })
        that.setData({
          'polyline[0].points[1].longitude': res.longitude
        })


        //把经纬度转换成当前城市
      }
    })
  },
  getPublishInfoById: function (publishId) {
    var that = this;
    wx.request({
      url: 'http://192.168.0.177:8080/spm/getPublishInfoById.do',
      data: { publishId: publishId },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          publishInfo: res.data
        })
        that.setData({
          latitude: Number(res.data.latitude)
        })
        that.setData({
          longitude: Number(res.data.longitude)
        })
        that.setData({
          'markers[0].latitude': Number(res.data.latitude)
        })
        that.setData({
          'markers[0].longitude': Number(res.data.longitude)
        })
        that.setData({
          'polyline[0].points[0].latitude': Number(res.data.latitude)
        })
        that.setData({
          'polyline[0].points[0].longitude': Number(res.data.longitude)
        })
      }
    });
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  parkWar: function () {
    var that = this
    console.log(that.data.publishInfo)
    wx.request({
      url: 'http://192.168.0.177:8080/spm/Order/publishToOrder.do',
      data: {
        publishInfo: that.data.publishInfo,
        userId: wx.getStorageSync('userId'),
        phone: wx.getStorageSync('phone')
      },
      success: function (res) {
        wx.navigateTo({
          url: '../createOrder/createOrder?orderId=' + res.data
        })
      }
    });
  }
})