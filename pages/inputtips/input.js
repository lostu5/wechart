var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var lonlat;
var city;
Page({
  data: {
    tips: {},
    sugData: [],
    city:''

  },
  onLoad: function(e){
    var that =this
    lonlat = e.lonlat;
    city = e.city;
    
    qqmapsdk = new QQMapWX({
      key: 'DUNBZ-QF6HQ-OHB5Y-G72LT-UP4PO-A2BBX'
    });
    that.setData({
      city: city
    })
  },
  bindInput: function(e){
    var that = this;
    var keywords = e.detail.value; 
    var city = this.data.city;
    // 调用接口
    qqmapsdk.getSuggestion({
      keyword: keywords,
      region: this.data.city,
      region_fix: 1,
      success: function (res) {
        var sugData = [];
        for (var i = 0; i < res.data.length; i++) {
          sugData.push({
            data: res.data[i]
          })
        }
        that.setData({
          sugData: sugData
        });

      },
      fail: function (res) {
      },
      complete: function (res) {
      }
    });
  },
  bindSearch: function(event){
    var that = this
    var latitude = event.currentTarget.dataset.open.location.lat;
    var longitude = event.currentTarget.dataset.open.location.lng;
    var location = '' + longitude + ',' + latitude+'';
    var keywords = event.currentTarget.dataset.open.title;
    var url = '../grabParking/grabParking?keywords=' + keywords+'&location='+location;
    wx.redirectTo({
      url: url
    })
  }
  
})