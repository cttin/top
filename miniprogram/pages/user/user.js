// pages/user/user.js
const app = getApp();
Component({
  options: {  
    addGlobalClass: true,
  },
  data: {
    rankInfo: [
      {
        name: '我的收藏',
        field: 'favor',
        icon: 'favorfill',
        color: 'orange'
      }, {
        name: '我的订单',
        field: 'order',
        icon: 'formfill',
        color: 'blue'
      }, {
        name: '我的历史',
        field: 'history',
        icon: 'timefill',
        color: 'green'
      }
    ],
    tourism: [
      {
        name: '笔记',
        field: 'note',
        number: 23,
        icon: 'edit',
        color: 'cyan'
      }, {
        name: '游记',
        field: 'travel',
        number: 64,
        icon: 'read',
        color: 'purple'
      }, {
        name: '视频',
        field: 'video',
        number: 7,
        icon: 'videofill',
        color: 'olive'
      }, {
        name: '点评',
        field: 'comment',
        number: 94,
        icon: 'commentfill',
        color: 'brown'
      }
    ],
    info: {
      note: 2323,
      travel: 64,
      video: 7,
      comment: 92434,
    },
    // noteCount: 0,
    // travelCount: 0,
    // videoCount: 0,
    // commentCount: 0
    
  },
  lifetimes: {
    attached: function() {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.setData({
          userInfo
        })
      }
      wx.showLoading({
        title: '数据加载中',
        mask: true,
      })
      let init = 0;
      console.log(this, 'this')
      this.numDH(init = 0);
      wx.hideLoading();
    }
  },
  methods: {
    getUserInfo(e) {
      if (!e.detail.userInfo) {
        wx.showToast({
          title: '您已取消登录',
          icon: 'none',
        })
        return;
      }
      if (app.globalData.isConnected) {
        wx.setStorageSync('userInfo', e.detail.userInfo);
        // AUTH.login(this);
      } else {
        wx.showToast({
          title: '当前无网络',
          icon: 'none',
        })
      }
    },
    numDH(init) {
      const tourism = this.data.tourism;
      if(init < 20) {
        setTimeout(() => {
          console.log(tourism, 'tourism')
          tourism.forEach(item => {
            item.number = init
          })
          this.setData({
            tourism
            // noteCount: init,
            // travelCount: init,
            // videoCount: init,
            // commentCount: init
          })
          init++;
          this.numDH(init);
        }, 20)
      }else {
        tourism.forEach(item => {
          item.number = this.coutNum(this.data.info[item.field]);
        })
        this.setData({
          tourism
          // noteCount: this.coutNum(this.note),
          // travelCount: this.coutNum(this.travel),
          // videoCount: this.coutNum(this.video),
          // commentCount: this.coutNum(this.comment)
        })
      }
    },
    coutNum(number) {
      if(number > 1000 && number < 10000) {
        number = (number / 1000).toFixed(1) + 'K';
      }
      if(number > 10000){
        number = (number / 10000).toFixed(1) + 'W'
      }
      return number;
    }
  }
  

  // /**
  //  * 生命周期函数--监听页面加载
  //  */
  // onLoad: function (options) {
  //   console.log(1)
  // },

  // /**
  //  * 生命周期函数--监听页面初次渲染完成
  //  */
  // onReady: function () {
  //   console.log(2)

  // },

  // /**
  //  * 生命周期函数--监听页面显示
  //  */
  // onShow: function () {
  //   console.log(3)

  // },

  // /**
  //  * 生命周期函数--监听页面隐藏
  //  */
  // onHide: function () {
  //   console.log(4)
  // },

  // /**
  //  * 生命周期函数--监听页面卸载
  //  */
  // onUnload: function () {

  // },

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {

  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {

  // },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})