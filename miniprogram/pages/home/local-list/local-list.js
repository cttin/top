//home.js
const app = getApp()

Page({
  data: {
    tabs: ['推荐', '深圳', '国内', '国外'],
    currentActiveNavIndex: 0, //当前激活的导航索引
    prevActiveNavIndex: -1, // 上一个激活的导航索引
  },
  properties: {
    maxHeight: String
  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  onShow: function () {
    const data = [
      {
        id: 0,
        width: 50,
        height: 100,
        url: 'http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50'
      }, {
        id: 1,
        width: 50,
        height: 100,
        url: 'https://images.unsplash.com/photo-1562655966-663054e42737?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
      }, {
        id: 2,
        width: 50,
        height: 100,
        url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
      }, {
        id: 3,
        width: 50,
        height: 100,
        url: 'https://images.unsplash.com/photo-1564425230164-1e63b4922d3f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
      }, {
        id: 4,
        width: 60,
        height: 120,
        url: 'https://images.unsplash.com/photo-1522850959516-58f958dde2c1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
      }, {
        id: 5,
        width: 416,
        height: 555,
        url: 'https://images.unsplash.com/photo-1545966239-6fe31602f152?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
      }
    ]
    this.fillData(false, data)
  },
  fillData: function (isFull, goods) {
    let view = this.selectComponent('#water-fall');
    console.log(view, 'view');
    view.fillData(isFull, goods);
  },

  topNavChange: function (e) {
    const prevActiveNavIndex = this.currentActiveNavIndex;
    const currentActiveNavIndex = e.currentTarget.dataset.id;
    if (prevActiveNavIndex !== currentActiveNavIndex) {
      this.setData({
        currentActiveNavIndex: e.currentTarget.dataset.id
      })
    }
  },
  swiperChange(e) {
    // 如果prev === cur，则是滑动swiper组件，反之，则是点击scroll-view
    const prevActiveNavIndex = this.currentActiveNavIndex;
    const currentActiveNavIndex = e.detail.current;
    if (prevActiveNavIndex !== currentActiveNavIndex) {
      this.setData({
        currentActiveNavIndex
      })
    }
  },
  handleHeight(e) {
    console.log(e.detail.wrapHeight, 3333);
    let wrapHeight = e.detail.wrapHeight;
    this.setData({
      wrapHeight
    });
  },


  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
