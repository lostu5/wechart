//获取应用实例
const app = getApp()
var dateTimePicker = require('../../utils/dateTimePicker.js');

Page({
  data: {
    userId: wx.getStorageSync('userId'),
    userInfo:[],
    address:"",
    detailAddress:"",
    carInfo:[],
    casIndex:0,
    phone:"",
    latitude:"",
    longitude:"",
    province:"",
    city:"",
    district:"",
    startTime:"起始时间",
    endTime:"结束时间",
    placehst:true,
    placehed:true

  },
  onLoad: function () {
    this.getUserInfo();
    this.setData({
      phone:wx.getStorageSync('phone')
    });
    this.chooseCarCard();
  },
  getUserInfo: function(){
   this.setData({
      userInfo:app.globalData.userInfo
    })
  
  },
  chooseLocation: function(){
    var that=this;
    wx.chooseLocation({
        success: function (res) {
           that.setData({
             address:res.name
            })
            that.setData({
             detailAddress:res.address+res.name
            })
            that.setData({
             latitude:res.latitude
            })
            that.setData({
             longitude:res.longitude
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
        city:res.data.result.addressComponent.city
       })
       that.setData({
        province:res.data.result.addressComponent.province
       })
       that.setData({
        district:res.data.result.addressComponent.district
       })
      },  
      fail: function () {  
        that.setData({ currentCity: "获取定位失败" });  
      }
        
    })
        }
      }) 
     



    
  },
  chooseCarCard:function(){
      var that=this;
      wx.request({
        url: 'http://192.168.0.177:8080/spm/carInfo/getCarInfoByUserId.do',
                              method: 'POST',
                              header: {
                                   'content-type': 'application/x-www-form-urlencoded'
                              },
                              data: {
                                   userId: wx.getStorageSync('userId'),
                              },
                              success: function (res){
                                console.log(res.data)
                                    that.setData({
                                        carInfo:res.data
                                                })
                              },
                              fail: function (res) {
                                   wx.showToast({
                                      title: '网络错误'
                                    });
                                   
                              }
                                
                         });
 
    
  },
    formSubmit: function(e) {  
    var that = this;  
    var formData = e.detail.value;   
    console.log(formData)
    wx.request({  
      url: 'http://192.168.0.177:8080/spm/addPublishInfo.do',  
      data: formData,  
      header: {  
          'Content-Type': 'application/json'  
      },  
      success: function(res) {  
        wx.redirectTo({
          url: '../publishList/publishList'
                      }) 
      }  
    })
  },  
   //  点击时间组件确定事件  
  bindTimeChange: function (e) {  
    this.setData({  
      startTime: e.detail.value  
    })
    this.setData({
      placehst: false
    })  
  },  
   //  点击时间组件确定事件  
  bindTimeChangeTwo: function (e) {  
    this.setData({  
      endTime: e.detail.value  
    })  
    this.setData({
      placehed: false
    })  
  },  

  //草稿
  draftBtn:function(){

  },

 //类别切换
    bindCasPickerChange:function(e){
    this.setData({
      casIndex: e.detail.value
    })
  }

  
})
