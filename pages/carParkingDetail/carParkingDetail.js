var app = getApp()
Page( {
  data: {
    carPark:[],
    carParkName:"",
    address:"",
    carParkInfo:{},
    banner_url: ['../../images/carparking.png', '../../images/carparking.png','../../images/carparking.png'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
  },
  onLoad: function (options) {
    this.getCarParkingInfoById(options.carParkId);
    this.setData({
    carParkInfo:JSON.parse(options.carPark),
                })
    

  },

  getCarParkingInfoById:function(carParkId){
    var that=this;
    wx.request({
                url: 'http://192.168.0.249:8080/spm/carparkpublish/selectByCarparkId.do',
                data: {carParkId:carParkId},
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                            that.setData({
                        carPark:res.data
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
  goToPlace:function(){
    var that=this;
    wx.openLocation({
      latitude: Number(that.data.carParkInfo.latitude),
      longitude: Number(that.data.carParkInfo.longitude),
      name:that.data.carParkInfo.carParkAddress,
      scale: 28
    })
  

  }
})