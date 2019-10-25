// components/area/area.js
const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  // properties: {
  //   weatherData: {
  //     type: Object,
  //     value: {}
  //   }
  // },
  data: {
    areas: false,
    areaList: app.globalData.areaList,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    load: true
  },
  methods: {
    showArea() {
      this.initArea();
    },
    initArea() {
      // 创建动画
      const animation = wx.createAnimation({
        duration: 500, // 动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
        timingFunction: 'linear'
      })
      this.setData({
        animation
      });
      // 先在y轴偏移，然后用step()完成一个动画
      animation.translateY(1000).step();
      // 用setData改变当前动画
      this.setData({
        // 通过export()方法导出数据
        animationData: animation.export(),
        // 改变view里面的wx：if
        areas: true
      })
      // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动 滑动时间
      setTimeout(() => { // 对话框内容弹出
        animation.translateY(0).step();
        this.setData({
          animationData: animation.export(),
          clearcart: false
        })
      }, 100)
    },
    hideModal() {
      const animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'linear'
      });
      this.animation = animation;
      animation.translateY(700).step();
      this.setData({
        animationData: animation.export()
      });
      setTimeout(() => { 
        animation.translateY(0).step();
        this.setData({
          animationData: animation.export(),
          areas: false // 遮罩层隐藏
        })
      }, 500)
    },
    tabSelect(e) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        MainCur: e.currentTarget.dataset.id,
        VerticalNavTop: (e.currentTarget.dataset.id - 1) * 45
      })
    },
    VerticalMain(e) {
      const areaList = this.data.areaList;
      let tabHeight = 0;
      if (this.data.load) {
        for (let i = 0; i < areaList.length; i++) {
          let view = this.createSelectorQuery().select('#main-' + i);
          console.log(view)
          view.fields({
            size: true
          }, data => {
            areaList[i].top = tabHeight;
            tabHeight = tabHeight + data.height;
            areaList[i].bottom = tabHeight;
          }).exec();
        }
        this.setData({
          areaList,
          load: false
        })
      }

      let scrollTop = e.detail.scrollTop + 20;
      for (let i = 0; i < areaList.length; i++) {
        if (scrollTop > areaList[i].top && scrollTop < areaList[i].bottom) {
          this.setData({
            TabCur: i,
            VerticalNavTop: (i - 1) * 45
          })
        }
      }
    },
    areaSelect(e) { // 选择好了动画之后
      this.triggerEvent('selectArea', e.currentTarget.dataset.info);
      this.hideModal();
    }
  }
})
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     areas: false
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {

//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
// })