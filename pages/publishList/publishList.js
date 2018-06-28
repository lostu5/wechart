/*publishList.js*/

//获取应用实例
var app = getApp()

Page({
  // 页面初始数据
  data: {
      shixiaoList: [],
      caogaoList: [],
      fabuList: [],
      jinxingList: [],
      wanchengList: [],
      winWidth: 0, 
      winHeight: 0,
    // tab切换  
      currentTab: 0,
      currenttext:"已发布"
  },
   
  onLoad:function(){
    var that = this;
    this.getPublishList();
    wx.setNavigationBarTitle({
      title: this.data.currenttext
    })

     /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },
  getPublishList:function(){
    var that=this;
    wx.request({
      url: 'http://192.168.0.177:8080/spm/getPublishAboutMe.do',
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
                                        shixiaoList:res.data.shixiaoList
                                                })
                                    that.setData({
                                        caogaoList:res.data.caogaoList
                                                })
                                    that.setData({
                                        fabuList:res.data.fabuList
                                                })
                                    that.setData({
                                        jinxingList:res.data.jinxingList
                                                })
                                    that.setData({
                                        wanchengList:res.data.wanchengList
                                                })
                              },
                              fail: function (res) {
                                   wx.showToast({
                                      title: '网络错误'
                                    });
                                   
                              }
                                
                         });
  },
  addPublish:function(){
    wx.navigateTo({
      url:'../publish/publish'
    })
  },
  // 跳转至详情页
  navigateDetail: function(e){
    wx.navigateTo({
      url:'../updatePublish/updatePublish?publishid=' + e.currentTarget.dataset.arid
    })
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
      that.setData({
        currenttext: e.target.dataset.currenttext
      })
      wx.setNavigationBarTitle({
        title: this.data.currenttext
      })
    }
  }

  
})
