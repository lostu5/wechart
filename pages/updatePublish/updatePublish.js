// pages/updatePublish/updatePublish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  userId: wx.getStorageSync('userId'),
  publishId:'',
  publishInfo:[],
  startTime:'',
  endTime:'',
  carInfo:[],
  casIndex:0,
  latitude:'',
  longitude:'',
  address:"",
  detailAddress:"",
  items: [],
  province:"",
  city:"",
  district:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.setData({
    publishId:options.publishid
  })
  this.getPublishInfoById(options.publishid);
  
  },
  getPublishInfoById:function(publishId){
    var that=this;
    wx.request({
                url: 'http://192.168.0.249:8080/spm/getPublishInfoById.do',
                data: {publishId:publishId},
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                            that.setData({
                        publishInfo:res.data,
                        startTime:res.data.publishstarttime.substring(11, 16),
                        endTime:res.data.publishendtime.substring(11, 16),
                        address:res.data.publishaddressname,
                        detailAddress:res.data.publishdetailaddress,
                        province:res.data.publishpro,
                        city:res.data.publishcity,
                        district:res.data.publishcounty,
                        latitude:res.data.latitude,
                        longitude:res.data.longitude
                                })    
                        if (res.data.publishstatus=='0') {
                          that.setData({
                            items:[{
                            name: '0', value: '草稿', checked: true
                            },{
                            name: '1', value: '发布', checked: false
                            }]
                          })
                        }else{
                          that.setData({
                            items:[{
                            name: '0', value: '草稿', checked: false
                            },{
                            name: '1', value: '发布', checked: true
                            }]
                          })
                        }
                    that.chooseCarCard();                  
                }
              });
  },
  chooseCarCard:function(){
      var that=this;
      wx.request({
      url: 'http://192.168.0.249:8080/spm/carInfo/getCarInfoByUserId.do',
                              method: 'POST',
                              header: {
                                   'content-type': 'application/x-www-form-urlencoded'
                              },
                              data: {
                                   userId: wx.getStorageSync('userId'),
                              },
                              success: function (res){
                                    that.setData({
                                        carInfo:res.data
                                                })
                                    res.data.forEach(function(item,index){
                                      if (item.carNumber==that.data.publishInfo.publishcarcard) {
                                        that.setData({
                                          casIndex:index
                                        })
                                      }
                                    })
                              },
                              fail: function (res) {
                                   wx.showToast({
                                      title: '网络错误'
                                    });
                                   
                              }
                                
                         });
 
    
  },
  //  点击时间组件确定事件  
  bindTimeChange: function (e) {  
    this.setData({  
      startTime: e.detail.value  
    })  
  },  
   //  点击时间组件确定事件  
  bindTimeChangeTwo: function (e) {  
    this.setData({  
      endTime: e.detail.value  
    })  
  },  


 //类别切换
    bindCasPickerChange:function(e){
    this.setData({
      casIndex: e.detail.value
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
             detailAddress:res.address
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
        page.setData({ currentCity: "获取定位失败" });  
      }
        
    })
        }
      }) 
     



    
  },
  formSubmit: function(e) {  
    var that = this;  
    var formData = e.detail.value;   
    console.log(formData)
    wx.request({  
      url: 'http://192.168.0.249:8080/spm/updatePublishById.do',  
      data: formData,  
      header: {  
          'Content-Type': 'application/json'  
      },  
      success: function(res) {  
         wx.navigateTo({
          url: '../publishList/publishList'
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
  
  }
})