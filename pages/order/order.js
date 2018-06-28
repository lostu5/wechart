/*order.js*/
Page({
// 页面初始数据
  data: {
      casIndex:0,
      userId: wx.getStorageSync('userId'),
      daizhifuList: [],
      jinxingList:[],
      wanchengList:[],
      quxiaoList:[],
      currentTab: 0,
      winWidth: 0, 
      winHeight: 0
  },
   onLoad:function(){
    var that=this;
    this.getOrderInfo();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },
  onShow:function(){
    getApp().data.orderFlag = true
  },
  onHide: function () {
    console.log(getApp().data.orderFlag)
    if (getApp().data.orderFlag) {
      wx.navigateTo({
        url: '../index/index'
      })
    }
   },
   bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  getOrderInfo:function(){
  	var that=this;
  	 wx.request({  
      url: 'http://192.168.100.249:8080/spm/Order/getOrdersAboutMe.do',
      data: {
       userId:wx.getStorageSync('userId')
      },  
      header: {  
        'Content-Type': 'application/json'  
      },  
      success: function (res) {  
       console.log(res.data)
       that.setData({
       	jinxingList:res.data.jinxingList
       })
       that.setData({
        wanchengList:res.data.wanchengList
       })
       that.setData({
        quxiaoList:res.data.quxiaoList
       })
       that.setData({
        shensuList:res.data.shensuList
       })
      },  
      fail: function () {  
        page.setData({ currentCity: "获取定位失败" });  
      }
        
    })
  },
  navigateDetail:function(e){
    console.log(e.currentTarget.dataset.aid)
    console.log(e.currentTarget.dataset.tid)
    if (e.currentTarget.dataset.tid=="0"){
      wx.navigateTo({
        url: '../orderDetail_g/orderDetail?orderId=' + e.currentTarget.dataset.aid
      })
    }else{
      wx.navigateTo({
        url: '../orderDetail/orderDetail?orderId=' + e.currentTarget.dataset.aid
      })
    }
	
  },
  loadMore:function(e){
    console.log(e)
    
  }

})