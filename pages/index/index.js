//index.js
//获取应用实例
var app = getApp()
var fileData = require('../../utils/data.js')
var filter = require('../../utils/filter.js')
Page({
  // 页面初始数据
  data: {
    //用户
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: [],
    loginStatus: "",
    casArray: ['全部', '车位', '停车场'],
    casIndex: 0,
    colors: ['red', 'orange', 'yellow', 'green', 'purple'],
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
    selected0: 0,
    //下方list数据
    fabuList: [],
    fabuList1: [],
    navTopTopItems: fileData.getTopIndexNavData(),
    navTopItems: fileData.getIndexNavData(),
    curNavId: 1,
    currentCity: "",
    distance: [],
    afterPrice: [],
    personParking: [],
    newPersonParkingList: [],
    carParking: [],
    carParkingList: [],
    winWidth: 0,
    winHeight: 0,
    city: "",
    i: 0,
    n: 5,
    searchLoading: false,
    searchLoadingComplete: false
  },

  onLoad: function () {
    var that = this
    getApp().data.orderFlag = false
    that.getSessionId();
    that.getMainInfo();
    //获取会员信息
    that.setData({
      loginStatus: wx.getStorageSync('loginStatus')
    })
    that.getUserInfo()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
  },

  getSessionId: function () {

    //获取session
    wx.request({
      url: 'http://192.168.100.177:8080/spm/getSessionId.do',
      data: { sessionId: wx.getStorageSync('sessionId') },
      header: {
        'Cookie': wx.getStorageSync('Cookie')
      },
      success: function (res) {
        console.log(res)
        if (res.data == 'no') {
          wx.setStorageSync('loginStatus', 'no')
        } else {
          wx.setStorageSync('loginStatus', 'yes')
        }

      }
    });
  },
  getMainInfo: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: function (res) {
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
        that.setData({
          city: res.data.result.addressComponent.city
        })
        that.searchMessage(that.data.i, that.data.n, that.data.city)
        that.searchCarPark(that.data.i, that.data.n, that.data.city)
      },
      fail: function () {
        page.setData({ currentCity: "获取定位失败" });
      }

    })
  },
  searchMessage: function (start, size, city) {

    var that = this
    wx.request({
      url: 'http://192.168.100.177:8080/spm/getPublishInfo.do',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        city: city,
        start: start,
        row: size
      },
      success: function (res) {
        if (res.data.length < that.data.n) {
          that.setData({
            searchLoading: true,  //把"上拉加载"
            searchLoadingComplete: false //把“没有数据”
          })
        } else {
          that.setData({
            searchLoading: false,  //把"上拉加载"的变量设为true，显示
            searchLoadingComplete: true //把“没有数据”设为false，隐藏
          })
        }
        if (start == '0') {
          that.setData({
            newPersonParkingList: res.data
          })
        } else {
          that.setData({
            personParking: res.data
          })
          var array = that.data.personParking;
          that.setData({
            newPersonParkingList: that.data.newPersonParkingList.concat(array)
          })

        }
        that.setData({
          i: that.data.i + res.data.length
        })

      },
      fail: function () {
        that.setData({ currentCity: "获取定位失败" });
      }

    })
  },
  searchCarPark: function (start, size, city) {
    var that = this;
    wx.request({
      url: 'http://192.168.100.177:8080/spm/carparkpublish/getCarPark.do',
      data: {
        city: city,
        start: start,
        row: size
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.length < that.data.n) {
          that.setData({
            searchLoading: true,  //把"上拉加载"的变量设为true，显示
            searchLoadingComplete: false //把“没有数据”设为false，隐藏
          })
        } else {
          that.setData({
            searchLoading: false,  //把"上拉加载"的变量设为true，显示
            searchLoadingComplete: true //把“没有数据”设为false，隐藏
          })
        }
        if (start == '0') {
          that.setData({
            carParkingList: res.data
          })
        } else {
          that.setData({
            carParking: res.data
          })
          var list = that.data.carParking;
          that.setData({
            carParkingList: that.data.carParkingList.concat(list)
          })

        }


        // success   
        that.setData({
          i: that.data.i + res.data.length
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
  bindCasPickerChange: function (e) {
    this.setData({
      casIndex: e.detail.value
    })
  },
  //顶部标签切换
  switchTopTab: function (e) {
    let id = e.currentTarget.dataset.id
    if (!filter.identityFilter() && id != '2') {
      console.log(1)
      wx.reLaunch({
        url: '../user/user'
      })
    } else {


      let url = ''
      if (id == '1') {
        url = '../publish/publish'
        wx.navigateTo({
          url: url
        })
      } else if (id == '2') {
        url = '../grabParking/grabParking'
        wx.navigateTo({
          url: url
        })
      } else {
        this.recharge();
      }
    }

  },
  //中部标签切换
  switchMidTab: function (e) {
    let id = e.currentTarget.dataset.id
    if (!filter.identityFilter()) {
      wx.reLaunch({
        url: '../user/user'
      })
    } else {
      let url = ''
      if (id != '3') {

        if (id == '1') {
          url = '../publishList/publishList'
        } else if (id == '2') {
          url = '../movecar/movecar'
        } else if (id == '4') {
          url = '../publishList/publishList'
        }
        wx.navigateTo({
          url: url
        })
      } else {
        wx.showModal({
          title: '友情提示',
          content: '工程师正在努力开发中....',
          showCancel: false,
        })
      }
    }
  },
  //下部标签切换
  tab_lists: function (e) {
    let id = e.currentTarget.dataset.index

    var that = this
    if (id == '0') {
      //第一个标签显示
      this.setData({
        selected0: 0,
        i: 0
      })
      that.searchCarPark(that.data.i, that.data.n, that.data.city)

    } else {
      //第二个标签显示
      this.setData({
        selected0: 1,
        i: 0
      })
      that.searchMessage(that.data.i, that.data.n, that.data.city)
    }
  },
  //标签切换
  switchTab: function (e) {
    let id = e.currentTarget.dataset.id,
      index = parseInt(e.currentTarget.dataset.index)
    this.curIndex = parseInt(e.currentTarget.dataset.index)
    var that = this
    this.setData({
      curNavId: id
    })

  },
  // 跳转至详情页
  navigateDetail: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../detail/detail?publishId=' + e.currentTarget.dataset.aid
    })
  },
  navigateCarParkDetail: function (e) {
    console.log(e.currentTarget.dataset.aid)
    wx.navigateTo({
      url: '../carParkingDetail/carParkingDetail?carParkId=' + e.currentTarget.dataset.aid
    })
  },
  // 加载更多
  loadMore: function (e) {
    var that = this;


    this.searchMessage(that.data.i, that.data.n, that.data.city)
    this.searchCarPark(that.data.i, that.data.n, that.data.city)

  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '快停停车,邀请你共享车位',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})
