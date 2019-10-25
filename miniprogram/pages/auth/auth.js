// pages/login/login.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // authorize: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.getUserInfo({
    //   success: res => {
    //     wx.navigateTo({
    //       url: '/pages/index/index'
    //     })
    //   },
    //   fail: err => {
    //     this.setData({
    //       authorize: true
    //     })
    //   }
    // })
  },
  // 授权
  onGetUserInfo(e) {
    if (e.detail.userInfo) {
      wx.setStorageSync('userInfo', e.detail.userInfo);
      console.log("点击了同意授权");
      wx.login({
        success: res => {
          this.getPlaceData();
        }
      })
    } else {
      console.log("点击了拒绝授权");
      // this.setData({
      //   authorize: false
      // })
      wx.navigateBack();
      return;
    }
  },

  // 获取地理信息
  getPlaceData() {
    this.getLocation().then(val => {
      return this.getCityName(val);
    }).then(() => {
      wx.navigateTo({
        url: '/pages/index/index'
      })
    })
    .ca
  },

  // 获取获取经纬度
  getLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84',
        success: res => {
          // this.setData({
          //   authorize: true
          // })
          const latitude = res.latitude
          const longitude = res.longitude
          let location = latitude + ',' + longitude
          console.log(location)
          resolve(location) //获取城市名字
        },
        fail: err => {
          console.log('获取城市信息失败')
          wx.navigateBack();
          return;
          // this.setData({ userInfo: false })
        }
      })
    })
  },

  // 获取城市名字
  getCityName(location) {
    return new Promise((resolve, reject) => {
      const e = {
        coordtype: "wgs84ll",
        output: "json",
        pois: 0,
        ak: 'FZGLYKh7RsTI2IkOP6EhzrodMyL9Mi3d',
        sn: "",
        timestamp: ""
      };
      e.location = location;
      wx.request({
        url: "https://api.map.baidu.com/reverse_geocoding/v3",
        data: e,
        header: {
          "content-type": "application/json"
        },
        method: "GET",
        success: t => {
          let currentCity = t.data.result.addressComponent.city;
          if (currentCity.slice(currentCity.length - 1) == "市") {
            currentCity = currentCity.slice(0, currentCity.length - 1)
          }
          wx.setStorageSync('currentCity', currentCity);
          resolve(currentCity) //通过城市名字 请求城市数据
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 个人信息
    // wx.getUserInfo({
    //   success: res => {
    //     this.setData({ userInfo: true })
    //   },
    //   fail: err => {
    //     this.setData({ userInfo: false })
    //   }
    // })
    // // 位置信息
    // wx.getLocation({
    //   success: res => {
    //     this.setData({ locationInfo: true })
    //   },
    //   fail: err => {
    //     this.setData({ locationInfo: false })
    //   }
    // })
    // 全部授权
    //因为页面一开始默认进去的是首页，如果能进入这个页面一定是未完全授权的情况，所以不需要下面的方法了
    // let timer = setInterval(() => {
    //   this.authorizeInfo();
    //   if (this.data.userInfo && this.data.locationInfo) {
    //     clearInterval(timer)
    //   }
    // }, 100)
  },

  // authorizeInfo() {
  //   if (this.data.userInfo && this.data.locationInfo) {
  //     this.setData({ authorizeInfo: true })
  //     //reLaunch
  //     wx.showLoading({
  //       title: '加载中',
  //     })
  //     wx.reLaunch({
  //       url: '/pages/index/index'
  //     })
  //   } else {
  //     this.setData({ authorizeInfo: false })
  //   }
  // },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})