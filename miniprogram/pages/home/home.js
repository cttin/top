//home.js
const app = getApp();
Component({
  options: {
    addGlobalClass: true, // 引入全局样式
  },
  properties: {
    isFixed: {
      type: Boolean,
      value: false
    }
  },
  data: {
    CustomBar: app.globalData.CustomBar,
    placeHolder: wx.getStorageSync('currentCity'),
    inputVal: '',
    history: [],
    historyModalVisible: false,
    TabCur: 0,
    scrollLeft: 0,
    searchTabs: [{
      name: '综合',
      type: 'all',
      id: 1401
    }, {
      name: '景点',
      type: 'spot',
      id: 1402
    }, {
      name: '路线',
      type: 'route',
      id: 1403
    }, {
      name: '酒店',
      type: 'hotel',
      id: 1404
    }, {
      name: '笔记',
      type: 'notes',
      id: 1405
    }, {
      name: '游记',
      type: 'travels',
      id: 1406
    }, {
      name: '攻略',
      type: 'strategy',
      id: 1407
    }],
    destination: [{
    }],

    tabs: [{
      name: '推荐',
      type: 'recommend',
      id: 1501
    }, {
      name: wx.getStorageSync('currentCity') || '南京',
      type: 'local',
      id: 1502
    }, {
      name: '国内',
      type: 'internal',
      id: 1503
    }, {
      name: '国外',
      type: 'abroad',
      id: 1504
    }],
    // tabs: ['推荐', wx.getStorageSync('currentCity'), '国内', '国外'],
    currentActiveNavIndex: 0, // 当前激活的导航索引
    prevActiveNavIndex: -1, // 上一个激活的导航索引
    isRefreshing: false,
    pageIndex: 1,
    pageSize: 10,
    postsInfo: {
      data: [],
      hasMore: true
    }
  },
  lifetimes: {
    ready: function () {
      this.initData();
      const history = wx.getStorageSync('history') || [];
      this.setData({
        history
      })
    },
  },
  pageLifetimes: {
    show: function () {
      console.log(33)
     },
  },
  methods: {
    onReady() {
      console.log('sfs')
    },
    onShow() {
      console.log('show')
    },
    onLoad() {
      console.log('load')
    },
    topLoad() {
      console.log(111, 'helllllllll')
    },

    // 输入框获取焦点
    onFocus: function() {
      this.setData({
        // inputVal: '',
        historyModalVisible: true
      })
      console.log(this.data.inputVal, this.data.placeHolder, 'inputVal')
    },
    // 取消搜索
    cancelSearch: function() {
      this.setData({
        inputVal: '',
        historyModalVisible: false
      })
    },
    // 删除历史记录
    deleteHistory: function() {
      this.setData({
        history: []
      }, () => {
        wx.setStorageSync('history', this.data.history);
      }) 
    },
    // 点击历史tag
    onClickHistory: function(e) {
      console.log(e, 'eeeee')
      const tagVal = e.currentTarget.dataset.target || '';
      console.log(tagVal, 'tagVal')
      this.setData({
        inputVal: tagVal
      })
    },  
    // 搜索
    onSearch: function (e) {
      console.log(e, this.data, 'e')
      const val = e.detail.value || this.data.placeHolder;
      // if (!val) {
      //   this.data.inputVal = ;
      // }
      const targetIndex = this.data.history.indexOf(val);
      if (targetIndex != -1) { // 存在目标值，先删除再重新插入
        this.data.history.splice(targetIndex, 1);
        this.data.history.unshift(val);
      } else {
        this.data.history.unshift(val);
      }
      this.setData({
        inputVal: val,
        history: this.data.history,
        // historyModalVisible: false
      })
      wx.setStorageSync('history', this.data.history);
    },
    tabSelect(e) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id - 1) * 60
      })
    },

    // 获取列表数据
    initData(isPull = true) {
      if (this.data.isRefreshing) { // 当前正在请求，用户上拉操作，不应该再次发起请求
        return;
      }
      if (this.data.postsInfo.hasMore) {
        this.setData({
          isRefreshing: true
        })
        wx.showLoading({
          title: '数据加载中...',
          mask: true,
        })
        wx.cloud.callFunction({
          // 要调用的云函数名称
          name: 'recommendList',
          // 传递给云函数的event参数
          data: {
            dbName: 'recommend_collection',
            filter: {
              type: this.data.tabs[this.data.currentActiveNavIndex].type
            },
            pageIndex: this.data.pageIndex,
            pageSize: this.data.pageSize,
          }
        }).then(res => {
          const result = res.result;
          wx.hideLoading();
          this.data.postsInfo = {
            data: result.data,
            hasMore: result.hasMore
          };
          this.setData({
            postsInfo: this.data.postsInfo,
            isRefreshing: false
          })
          if (!this.data.postsInfo.data.length) {
            wx.showToast({
              title: '没有更多了',
              icon: 'none'
            })
          }else {
            this.fillData(isPull, this.data.postsInfo.data);
          }
        }).catch(err => {
          console.error(err)
        })
      }else {
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
      }
    },
    // 调用组件的fillData方法，渲染页面
    fillData: function (isPull, posts) {
      let view = this.selectComponent(`#${this.data.tabs[this.data.currentActiveNavIndex].type}`);
      console.log(view ,'view')
      if(view) {
        view.fillData(isPull, posts);
      }
    },
    /** 
     * 点击tab切换
     * 顶部导航改变事件，即被点击了 
     * 1、如果2次点击同一个当航，则不做处理 
     * 2、需要记录本次点击和上次点击的位置 
     */
    topNavChange: function (e) {
      const nextIndex = e.currentTarget.dataset.currentIndex;
      const currentIndex = this.data.currentActiveNavIndex;
      if (nextIndex !== currentIndex) {
        this.setData({
          currentActiveNavIndex: nextIndex,
          prevActiveNavIndex: currentIndex,
          pageIndex: 1,
          postsInfo: {
            data: [],
            hasMore: true
          }
        }, () => {
          this.initData();
        })
      }
    },
    
    /** 
     * swiper滑动时触发 
     * 1、prevIndex != currentIndex 表示的是用手滑动 swiper组件 
     * 2、prevIndex = currentIndex  表示的是通过点击顶部的导航触发的 
     */
    swiperChange(e) {
      const prevIndex = this.data.currentActiveNavIndex;
      const currentIndex = e.detail.current;
      this.setData({
        currentActiveNavIndex: currentIndex
      })
      if (prevIndex !== currentIndex) {
        this.setData({
          prevActiveNavIndex: prevIndex,
          pageIndex: 1,
          postsInfo: {
            data: [],
            hasMore: true
          }
        }, () => {
          this.initData();
        })
      }
    },
    // 给swiper设置高度
    handleHeight(e) {
      console.log(e.detail.wrapHeight, 3333);
      let wrapHeight = e.detail.wrapHeight;
      this.setData({
        wrapHeight
      });
    },
    // 处理页面下拉加载和上拉刷新事件
    handleRefreshAndLoad(isPull) {
      let pageIndex = this.pageIndex;
      // 下拉
      if(isPull) {
        pageIndex = 1;
        // this.data.postsInfo.hasMore = true;
        this.setData({
          pageIndex,
          'postsInfo.hasMore': true
        });
      }else {
        // 上拉
        pageIndex += 1;
        this.setData({
          pageIndex,
        });
      }
      this.initData(isPull);
    }
  }

})
