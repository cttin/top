// pages/trending/trending.js
const bmap = require('../../libs/bmap-wx/bmap-wx.min')
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    ak: 'FZGLYKh7RsTI2IkOP6EhzrodMyL9Mi3d', // 百度地图ak
    weatherData: {},
    // site: wx.getStorageSync('currentCity'),
    selectedAreaInfo: {
      name: wx.getStorageSync('currentCity'),
      logo: 'https://cdn.pixabay.com/photo/2019/09/18/07/09/meadow-4485609__480.jpg'
    },
    placeData: {
      travels: {
        Info: [
          {
            nickName: 'bob',
            avatar: 'https://i.loli.net/2019/09/28/ZkvM87nLhHxUiVb.jpg'
          }, {
            nickName: '酸奶酸不酸',
            avatar: 'https://i.loli.net/2019/09/28/xOBYwV8qkrs5imM.jpg'
          }
        ],
        numbers: 2324242
      },
    },
    topics: [
      {
        name: '景点',
        field: 'spot',
        icon: 'cameraaddfill',
        color: 'red'
      }, {
        name: '路线',
        field: 'route',
        icon: 'evaluate_fill',
        color: 'olive'
      }, {
        name: '住宿',
        field: 'hotel',
        icon: 'homefill',
        color: 'cyan'
      }, {
        name: '美食',
        field: 'food',
        icon: 'upstagefill',
        color: 'purple'
      }, {
        name: '购物',
        field: 'shop',        
        icon: 'goodsfill',
        color: 'mauve'
      }
    ],
    currentActive: 'spot'
  },
  getAreaInfo(e) {
    // const { name, logo } = e.detail;
    console.log(e.detail)
    this.setData({
      selectedAreaInfo: e.detail
    })
  },
  handleTopicshange(e) {
    this.setData({
      currentActive: e.currentTarget.dataset.topic
    })
  },
  showArea() {
    const area = this.selectComponent('#area');
    area.showArea();
    // this.triggerEvent('showArea');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(333)
    const BMap = new bmap.BMapWX({
      ak: this.data.ak
    });
    BMap.weather({
      success: data => {
        const weatherData = data.currentWeather[0];
        this.setData({
          weatherData
        });
        console.log(data, 'data')
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('ready')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('show')

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})