var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');

var markersData = [];
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    city: '',
    textData: {},
    cartype:'',
    infoheight:''
  },
  markertap: function (e) {
    var id = e.markerId;
    var that = this;
    console.log(e)
    this.showMarkerInfo(that.data.markers,id);
    that.setData({
      infoheight: 300
    });
  },
  showMarkerInfo: function (markers, id) {
    var that = this;
    console.log(markers)
    markers.forEach(function(e,i){
      if (e.id == id){
        that.setData({
          textData: {
            name: markers[i].name,
            address: markers[i].addredd,
            count: markers[i].count,
            price: markers[i].price,
            id: markers[i].id
          }
        });
        that.setData({
          cartype: markers[i].cartype
        });
      }
    })
  
  }, 
  maptap:function(){
    var that = this;
    console.log(this)
    that.setData({
      infoheight: 0
    });
  },
  regionchange:function(e){

  },
  onLoad: function (e) {
    var that = this;
    that.setData({
      infoheight: 0
    });
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    var params = {
      iconPath: '../../images/marker_checked.png',
      success: function (data) {
        console.log(data)
        markersData = data.markers;
        var poisData = data.poisData;
        var markers_new = [];

       /*个人*/
        wx.request({
          url: 'http://192.168.100.249:8080/spm/queryPublishData.do',
          data: {
            latitude: markersData[0].latitude,
            longitude: markersData[0].longitude,
            raidus: 0 //半径单位米
          },
          success: function (res) {
          
            for (var i = 0; i < res.data.length; i++) {
              this.publishdetailaddress = that.getNewline(res.data[i].publishdetailaddress)
              markers_new.push({
                id: res.data[i].publishid+"P",
                cartype: "P",
                name:res.data[i].publishtitle,
                addredd: res.data[i].publishdetailaddress,
                price: res.data[i].afterPrice,
                latitude: res.data[i].latitude,
                longitude: res.data[i].longitude,
                iconPath: "../../images/markernew.png",
                 width: 38,
                 height: 47
              })
            }
            that.setData({
              markers: markers_new
            });
            console.log(markers_new)
          }
        })   


         wx.request({
          url: 'http://192.168.100.249:8080/spm/queryCarParkPublishData.do',
          data: {
            latitude: markersData[0].latitude,
            longitude: markersData[0].longitude,
            raidus: 0 //半径单位米
          },
          success: function (res) {
          
            for (var i = 0; i < res.data.length; i++) {
              this.carParkAddress = that.getNewline(res.data[i].carParkAddress)
              markers_new.push({
                id: res.data[i].carParkId + "G",
                cartype: "G",
                name: res.data[i].carParkName,
                addredd: res.data[i].carParkAddress,
                count: res.data[i].count,
                latitude: res.data[i].latitude,
                longitude: res.data[i].longitude,
                iconPath: "../../images/markernew.png",
                 width: 38,
                 height: 47
              })
            }
            that.setData({
              markers: markers_new
            });
            console.log(markers_new)
          }
        })     
        
        if (markersData.length > 0) {
          that.setData({
            markers: markers_new
          });
          that.setData({
            city: poisData[0].cityname || ''
          });
          that.setData({
            latitude: markersData[0].latitude
          });
          that.setData({
            longitude: markersData[0].longitude
          });
          /*that.showMarkerInfo(markersData, 0);*/
        } else {
          wx.getLocation({
            success: function (res) {
              that.setData({
                latitude: res.latitude
              });
              that.setData({
                longitude: res.longitude
              });
             wx.request({  
                url: 'https://api.map.baidu.com/geocoder/v2/?ak=YYqAwaRbp78y8DKbborIC4FFn2oHqnv9&location=' + latitude + ',' + longitude + '&output=json',  
                data: {},  
                header: {  
                'Content-Type': 'application/json'  
                        },  
                success: function (res) {  
                  that.setData({
                  city:res.data.result.addressComponent.city
                              });
                                        },  
                fail: function () {  
                  that.setData({ city: "获取定位失败" });  
                                  }     
        
                })
            },
            fail: function () {
              that.setData({
                latitude: 39.909729
              });
              that.setData({
                longitude: 116.398419
              });
              that.setData({
                city: '北京市'
              });
            }
          })

          that.setData({
            textData: {
              name: '抱歉，未找到结果',
              desc: ''
            }
          });
        }

      },
      fail: function (info) {
        // wx.showModal({title:info.errMsg})
      }
    }

    if (e && e.keywords && e.location) {

      params.querykeywords = e.keywords;
      params.location = e.location;

    myAmapFun.getPoiAround(params)
    }else{
      //首次进入
      var markers_new = [];
      wx.getLocation({
        success: function (res) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          });

          wx.request({  
          url: 'https://api.map.baidu.com/geocoder/v2/?ak=YYqAwaRbp78y8DKbborIC4FFn2oHqnv9&location=' + res.latitude + ',' + res.longitude + '&output=json',  
          data: {},  
          header: {  
            'Content-Type': 'application/json'  
                  },  
        success: function (res) {  
           that.setData({
            city:res.data.result.addressComponent.city
          });
        // success     
        },  
      fail: function () {  
        that.setData({ city: "获取定位失败" });  
      }
     });

          wx.request({
            url: 'http://192.168.100.249:8080/spm/queryPublishData.do',
            data: {
              latitude: res.latitude,
              longitude: res.longitude,
              raidus: 0 //半径单位米
            },
            success: function (res) {
              console.log(res.data);
              
              for (var i = 0; i < res.data.length; i++) {
                this.publishdetailaddress = that.getNewline(res.data[i].publishdetailaddress)
                markers_new.push({
                  id: res.data[i].publishid + "P",
                  cartype: "P",
                  name: res.data[i].publishtitle,
                  addredd: res.data[i].publishdetailaddress,
                  price: res.data[i].afterPrice,
                  latitude: res.data[i].latitude,
                  longitude: res.data[i].longitude,
                  iconPath: "../../images/markernew.png",
                   width: 38,
                   height: 47
                })
              }
              that.setData({
                markers: markers_new
              });
            }
          })

/*停车场*/
          wx.request({
          url: 'http://192.168.100.249:8080/spm/queryCarParkPublishData.do',
          data: {
            latitude: res.latitude,
            longitude: res.longitude,
            raidus: 0 //半径单位米
          },
          success: function (res) {
          
            for (var i = 0; i < res.data.length; i++) {
              this.carParkAddress = that.getNewline(res.data[i].carParkAddress)
              markers_new.push({
                id: res.data[i].carParkId + "G",
                cartype: "G",
                name: res.data[i].carParkName,
                addredd: res.data[i].carParkAddress,
                count: res.data[i].count,
                latitude: res.data[i].latitude,
                longitude: res.data[i].longitude,
                iconPath: "../../images/markernew.png",
                 width: 38,
                 height:47
              })
            }
            that.setData({
              markers: markers_new
            });
            console.log(markers_new)
          }
        })


        },
      });

    }
  },
  bindInput: function (e) {
    var that = this;
    var url = '../inputtips/input';
    if (e.target.dataset.latitude && e.target.dataset.longitude && e.target.dataset.city) {
      var dataset = e.target.dataset;
      url = url + '?lonlat=' + dataset.longitude + ',' + dataset.latitude + '&city=' + dataset.city;
    }
    wx.navigateTo({
    
      url: url
    })
  },
 
  //气泡点击事件
  bindcallouttap: function(e){

    var dataid = this.data.textData.id
    var str = dataid.length
    console.log(dataid)
    var first = dataid.substring(0, str-1);
    var second = dataid.substring(str-1,str);
    if(second=="P"){
      wx.navigateTo({
      url:'../detail/detail?publishId=' + first
    })
    }
    if (second=="G") {
      wx.navigateTo({
      url:'../carParkingDetail/carParkingDetail?carParkId=' + first
    })
    }
    console.log(first)
    console.log(second)
    /* wx.navigateTo({
      url:'../detail/detail?publishId=' + e.markerId
    })*/
  },
  controltap:function(e){
   console.log(e)
  },
  getNewline:function(val){
    var str = new String(val);
    var bytesCount = 0;
    var s = "";
    for (var i = 0, n = str.length; i < n; i++) {
      var c = str.charCodeAt(i);
      //统计字符串的字符长度
      if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
        bytesCount += 1;
      } else {
        bytesCount += 2;
      }
      //换行
      s += str.charAt(i);
      if (bytesCount >= 30) {
        s = s + '\n';
        //重置
        bytesCount = 0;
      }
    }
    return s;  
  }

})