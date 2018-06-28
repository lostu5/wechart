//index.js
//获取应用实例
var app = getApp()
var fileData = require('../../utils/data.js')
var header=wx.getStorageSync('Cookie')
var sessionId=wx.getStorageSync('sessionId')
Page({
  // 页面初始数据
  data: {
    //用户
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: [],
    loginStatus: "",
      casArray: ['全部','车位','停车场'],
      casIndex:0,
      colors:['red','orange','yellow','green','purple'],
      // banner 初始化
      banner_url: fileData.getBannerData(),
      indicatorDots: true,
      vertical: false,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      //上方和中部 nav 初始化
      getTopNavData: fileData.getTopNavData(),
      getmidNavData: fileData.getmidNavData(),
      //停车场类型
      placeitems: [
        { name: 'park', value: '停车场' },
        { name: 'person', value: '共享车位' }
      ],
      //下方的显示与否
      selected0 : 0,
      //下方list数据
      fabuList: [],
      fabuList1: [],
      navTopTopItems: fileData.getTopIndexNavData(),
      navTopItems: fileData.getIndexNavData(),
      navSectionItems: fileData.getIndexNavSectionData(),
      curNavId: 1,
      currentCity:"",
      distance:[],
      afterPrice:[]

  },
   
  onLoad:function(){
    getApp().data.orderFlag = false
    var that = this
    // that.setData({
    //   list: that.data.navSectionItems
    // })
    that.getSessionId();
    that.getMainInfo();
    that.getPublishList();
    //获取会员信息
    that.setData({
      loginStatus: wx.getStorageSync('loginStatus')
    })
    that.getUserInfo()
  }, 
 onShow:function(){
   getApp().data.orderFlag = false
 },
  getSessionId: function(){
    console.log(wx.getStorageSync('Cookie'));
    //获取session
    wx.request({
                url: 'http://192.168.100.249:8080/spm/getSessionId.do',
                data: {sessionId:sessionId},
                header: {
                  'Cookie':header
                },
                success: function (res) {
                  console.log(res);
                   if(res.data=='no'){
                    wx.setStorageSync('loginStatus', 'no')
                   }else{
                     wx.setStorageSync('loginStatus', 'yes')
                   }
                   console.log(wx.getStorageSync('loginStatus'))
                }
              });
  },
  getMainInfo:function(){
    var that = this
    wx.getLocation({
        type: 'wgs84',
        altitude:true,
        success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        //把经纬度转换成当前城市
        that.loadCity(longitude, latitude)  
  }
})
     
  },
  //会员
  getUserInfo: function () {
    var that = this
    that.data.userInfo.push()
    wx.request({
      url: 'http://192.168.100.177:8080/spm/selectByuserId.do',
      header: {
        // 'content-type': 'application/json'
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { userId: wx.getStorageSync('userId') },
      success: function (res) {
        console.log(res)
        if (res.data.msg == 'NoUser') {
          that.setData({
            loginStatus: 'no'
          })
        } else {
          that.setData({
            userInfo: res.data.userInfo
          })
        }
      },
      fail: function (res) {
      }

    })
  },
  //跳转登录页面
  bindGetUserInfo: function (e) {
    wx.navigateTo({
      url: '../login/login'
    })
  //  app.globalData.userInfo = e.detail.userInfo;
 //   if (app.globalData.userInfo) {
  //    wx.navigateTo({
  //      url: '../login/login'
   //   })
 //   }
  },
  //充值方法
  recharge: function () {
    var that = this
    let str = JSON.stringify(that.data.userInfo);
    if (that.data.loginStatus == "yes") {
      wx.navigateTo({
        url: '../recharge/recharge?str=' + str,
      })
    } else {
      wx.showModal({
        title: '访问错误',
        content: '您还没有登陆,请先登录',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.bindGetUserInfo()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
 loadCity: function (longitude, latitude) { 
    var that = this  
    wx.request({  
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=YYqAwaRbp78y8DKbborIC4FFn2oHqnv9&location=' + latitude + ',' + longitude + '&output=json',  
      data: {},  
      header: {  
        'Content-Type': 'application/json'  
      },  
      success: function (res) {  
        // success     
        console.log(res.data.result.addressComponent)
        var city = res.data.result.addressComponent.city;  
        that.searchMessage(longitude,latitude,city)
      },  
      fail: function () {  
        page.setData({ currentCity: "获取定位失败" });  
      }
        
    })  
  },
   searchMessage: function (longitude,latitude,city) { 
    var that = this  
    wx.request({  
      url: 'http://192.168.100.177:8080/spm/getPublishInfo.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        city:city,
        longitude:longitude,
        latitude:latitude
      }, 
      success: function (res) { 
     
        // success     
        that.setData({
          distance:res.data.distance
        })
        that.setData({
          afterPrice:res.data.afterPrice
        })
        that.setData({
          fabuList: res.data.distance
        })
        that.setData({
          fabuList1: res.data.afterPrice
        })
      },  
      fail: function () {  
        that.setData({ currentCity: "获取定位失败" });  
      }
        
    })  
  },
  //多选框change事件
  checkboxChange: function (e) {
    var that = this;
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    that.getPublishList(e.detail.value)
  },
  //获取下方list函数
  getPublishList: function () {
    var that = this;
    wx.request({
      url: 'http://192.168.100.177:8080/spm/getPublishAboutMe.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: wx.getStorageSync('userId'),
      },
      success: function (res) {
        console.log("fabuList" + res.data.fabuList)
        that.setData({
          fabuList: res.data.fabuList
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '网络错误'
        });

      }

    });
  },




  //类别切换
    bindCasPickerChange:function(e){
    console.log('Category picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      casIndex: e.detail.value
    })
  },
  //顶部标签切换
  switchTopTab: function(e) {
      let id = e.currentTarget.dataset.id
      console.log(id);
      let url=''
      if(id=='1'){
        url = '../publishList/publishList'
        wx.navigateTo({
          url: url
        })
      }else if (id == '2') {
        url = '../grabParking/grabParking'
        wx.navigateTo({
          url: url
        })
      }else{
        this.recharge();
                }
      
    },
    //中部标签切换
    switchMidTab: function (e) {
      let id = e.currentTarget.dataset.id
      console.log(id);
      let url = ''
      if (id == '1') {
        url = '../publishList/publishList'
      } else if (id == '2') {
        url = '../movecar/movecar'
      } else if (id == '3') {
        url = '../publishList/publishList'
      } else if (id == '4') {
        url = '../publishList/publishList'
      }
      wx.navigateTo({
        url: url
      })
    },
    //下部标签切换
    tab_lists: function (e) {
      let id = e.currentTarget.dataset.index
      console.log(id);
      var that = this
      if (id == '0') {
        //第一个标签显示
        this.setData({
          selected0: 0
        })
        
      } else {
        //第二个标签显示
        this.setData({
          selected0: 1
        })
      }
    },
  //标签切换
  switchTab: function(e) {
      let id = e.currentTarget.dataset.id,
      index = parseInt(e.currentTarget.dataset.index)
      this.curIndex = parseInt(e.currentTarget.dataset.index)
      console.log(e)
      console.log(id)
      var that = this
      this.setData({
        curNavId: id
      })
      
  },
  // 跳转至详情页
  navigateDetail: function(e){
    wx.navigateTo({
      url:'../detail/detail?publishId=' + e.currentTarget.dataset.aid
    })
  },
  // 加载更多
  loadMore: function (e) {
    console.log('加载更多')
    var curid = this.data.curIndex

    if (this.data.navSectionItems[curid].length === 0) return
    
    var that = this
    that.data.navSectionItems[curid] = that.data.navSectionItems[curid].concat(that.data.navSectionItems[curid])
    that.setData({
      list: that.data.navSectionItems,
    }) 
  },
  // book
  bookTap: function(e){
    wx.navigateTo({
      url:'../book/book?aid='+e.currentTarget.dataset.aid
    })
  }
  
})
