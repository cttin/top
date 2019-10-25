// const bmap = require('../../libs/bmap-wx/bmap-wx.min')

Page({
  data: {
    city: '',
    PageCur: 'home',
    update: false,// 用于发布动态后的强制刷新标记
    ak: 'FZGLYKh7RsTI2IkOP6EhzrodMyL9Mi3d', // 百度地图ak
    weatherData: {},
    isFixed: false
  },
  onLoad() {
    // const BMap = new bmap.BMapWX({
    //   ak: this.data.ak
    // });
    // BMap.weather({
    //   success: data => {
    //     const weatherData = data.currentWeather[0];
    //     this.setData({
    //       weatherData
    //     });
    //   },
    //   fail: (err) => {
    //     console.log(err)
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if(this.data.update) {
      wx.startPullDownRefresh();
      // this.refresh() 如何调用不同组件的更新数据方法
      this.setData({
        update: false,
      })
      // wx.getStorage({
      //   key: 'userInfo',
      //   success: () => {

      //   },
      //   fail: () => {
      //     this.userInfoAuthorize();
      //   }
      // })
    }
  },
  

  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onPageScroll(e) {
    console.log(e.scrollTop)
    if (e.scrollTop > 0) {
      this.setData({
        isFixed: true
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh(e) {
    // wx.showNavigationBarLoading() //在标题栏中显示加载
    const pageCur = this.selectComponent(`#${this.data.PageCur}`);
    pageCur.handleRefreshAndLoad(true);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    const pageCur = this.selectComponent(`#${this.data.PageCur}`);
    pageCur.initData();
  },
})