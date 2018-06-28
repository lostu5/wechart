var app = getApp()
Page( {
  data: {
    latitude:"",
    longitude:"",
    orderInfo:[]
  },
  onLoad: function (options) {
    this.getPublishInfoById(options.orderId);
  },
  // 路线
  /*polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color:"#FF0000DD",
      width: 2,
      dottedLine: true
    }],*/
  getLocation:function(){
    wx.navigateTo({
      url:'../location/location'
    })
  },
  getPublishInfoById:function(orderId){
    var that=this;
    wx.request({
      url: 'http://192.168.0.177:8080/spm/Order/getOrdersByOrderId.do',
                data: {orderId:orderId},
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  that.setData({
                    orderInfo:res.data
                  })
               console.log(res.data)
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
  }
})