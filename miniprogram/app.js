//app.js
const app = getApp();
App({
  navigateToLogin: false,
  onLaunch: function () {
    if (wx.cloud) {
      wx.cloud.init({
        traceUser: true
      })
    }
    // 页面授权
    this.userInfoAuthorize(); 
    // 获取顶部导航栏数据
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    // 检测新版本
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: res => {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    });
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success: res => {
        const networkType = res.networkType
        if (networkType === 'none') {
          this.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange((res) => {
      if(!res.isConnected) {
        this.globalData.isConnected = false;
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000,
          complete: function () {
            this.goStartIndexPage()
          }
        })
      }else {
        this.globalData.isConnected = true;
        wx.hideToast();
      }
    })

    // this.globalData = {}
  },
  /**
   * 用户授权
   */
  userInfoAuthorize() {
    wx.getSetting({
      success: res => {
        // 判断是否有用户信息权限 & 地理位置权限
        console.log(res.authSetting)
        if (res.authSetting['scope.userInfo'] && res.authSetting['scope.userLocation']) { // 已经授权，可以直接调用 getUserInfo 获取头像昵称及地理位置
          // this.globalData.authorize = true;
          // wx.getUserInfo({
          //   success: res => {
          //     wx.setStorageSync('userInfo', res.userInfo);
          //     // this.globalData.userInfo = res.userInfo;
          //   }
          // })
        } else { // 跳转到授权页面 
          // this.globalData.authorize = false;
          wx.navigateTo({
            url: '/pages/auth/auth'
          })
        }
      },

    })
  },
  globalData: {
    // share: false, // 分享默认为false
    // height: 0, // 顶部高度
    isConnected: true,
    areaList: [{
      "country": "中国",
      "city": [
        {
          "name": "云南",
          "logo": "https://cdn.pixabay.com/photo/2017/05/09/03/46/alberta-2297204__480.jpg"
        }, {
          "name": "四川",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "北京",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "内蒙古",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "香港",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "浙江",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "新疆",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "广东",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "江苏",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "上海",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "福建",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "台湾",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "山东",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "青海",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "西藏",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "海南",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "广西",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "重庆",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "陕西",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "湖南",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "河北",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "贵州",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "澳门",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "湖北",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "安徽",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "甘肃",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "黑龙江",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }
        , {
          "name": "辽宁",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "江西",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "河南",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "山西",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "天津",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "吉林",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }, {
          "name": "宁夏",
          "logo": "http://p4-q.mafengwo.net/s11/M00/F0/1C/wKgBEFpH4qmACjOmAD7CtgZ5LlY23.jpeg?imageView2%2F2%2Fw%2F600%2Fq%2F50"
        }
      ]
    }, {
      "country": "亚洲",
      "city": [
        {
          "name": "泰国",
          "logo": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1569661424&di=06f782dbcbdaddc154b17dc4625d2eca&imgtype=jpg&er=1&src=http%3A%2F%2Fp1.ifengimg.com%2F2019_10%2FD358FF778DF5971C2C8D786776671C393A91D2A9_w1000_h668.jpg"
        }, {
          "name": "日本",
          "logo": ""
        }, {
          "name": "马来西亚",
          "logo": ""
        }, {
          "name": "新加坡",
          "logo": ""
        }, {
          "name": "越南",
          "logo": ""
        }, {
          "name": "韩国",
          "logo": ""
        }, {
          "name": "马尔代夫",
          "logo": ""
        }, {
          "name": "印度尼西亚",
          "logo": ""
        }, {
          "name": "菲律宾",
          "logo": ""
        }, {
          "name": "土耳其",
          "logo": ""
        }, {
          "name": "柬埔寨",
          "logo": ""
        }, {
          "name": "斯里兰卡",
          "logo": ""
        }, {
          "name": "尼泊尔",
          "logo": ""
        }, {
          "name": "印度",
          "logo": ""
        }, {
          "name": "阿联酋",
          "logo": ""
        }, {
          "name": "缅甸",
          "logo": ""
        }, {
          "name": "老挝",
          "logo": ""
        }, {
          "name": "以色列",
          "logo": ""
        }, {
          "name": "伊朗",
          "logo": ""
        }, {
          "name": "格鲁吉亚",
          "logo": ""
        }, {
          "name": "文莱",
          "logo": ""
        }, {
          "name": "朝鲜",
          "logo": ""
        }, {
          "name": "约旦",
          "logo": ""
        }, {
          "name": "蒙古",
          "logo": ""
        }, {
          "name": "巴基斯坦",
          "logo": ""
        }, {
          "name": "卡塔尔",
          "logo": ""
        }, {
          "name": "哈萨克斯坦",
          "logo": ""
        }, {
          "name": "亚美尼亚",
          "logo": ""
        }, {
          "name": "阿萨拜疆",
          "logo": ""
        }
      ]
    }, {
      "country": "欧洲",
      "city": [
        {
          "name": "英国",
          "logo": ""
        }, {
          "name": "意大利",
          "logo": ""
        }, {
          "name": "法国",
          "logo": ""
        }, {
          "name": "俄罗斯",
          "logo": ""
        }, {
          "name": "西班牙",
          "logo": ""
        }, {
          "name": "德国",
          "logo": ""
        }, {
          "name": "瑞士",
          "logo": ""
        }, {
          "name": "希腊",
          "logo": ""
        }, {
          "name": "捷克",
          "logo": ""
        }, {
          "name": "荷兰",
          "logo": ""
        }, {
          "name": "奥地利",
          "logo": ""
        }, {
          "name": "冰岛",
          "logo": ""
        }, {
          "name": "挪威",
          "logo": ""
        }, {
          "name": "芬兰",
          "logo": ""
        }
      ]
    }, {
      "country": "北美洲",
      "city": [
        {
          "name": "美国",
          "logo": ""
        }, {
          "name": "加拿大",
          "logo": ""
        }, {
          "name": "墨西哥",
          "logo": ""
        }, {
          "name": "古巴",
          "logo": ""
        }, {
          "name": "巴哈马",
          "logo": ""
        }, {
          "name": "多米尼亚",
          "logo": ""
        }, {
          "name": "巴拿马",
          "logo": ""
        }, {
          "name": "哥斯达黎加",
          "logo": ""
        }, {
          "name": "牙买加",
          "logo": ""
        }, {
          "name": "安提瓜和巴布达",
          "logo": ""
        }, {
          "name": "巴巴多斯",
          "logo": ""
        }, {
          "name": "萨尔瓦多",
          "logo": ""
        }, {
          "name": "多米尼克",
          "logo": ""
        }, {
          "name": "特立尼达和多巴哥",
          "logo": "格林纳达"
        }
      ]
    }, {
      "country": "大洋洲",
      "city": [
        {
          "name": "澳大利亚",
          "logo": ""
        }, {
          "name": "新西兰",
          "logo": ""
        }, {
          "name": "斐济",
          "logo": ""
        }, {
          "name": "瓦努阿图",
          "logo": ""
        }, {
          "name": "库克群岛",
          "logo": ""
        }, {
          "name": "汤加",
          "logo": ""
        }, {
          "name": "巴布纳斯几内亚",
          "logo": ""
        }, {
          "name": "萨摩亚",
          "logo": ""
        }, {
          "name": "纽埃",
          "logo": ""
        }, {
          "name": "密克罗尼西亚联邦",
          "logo": ""
        }
      ]
    }, {
      "country": "非洲",
      "city": [
        {
          "name": "毛里求斯",
          "logo": ""
        }, {
          "name": "埃及",
          "logo": ""
        }, {
          "name": "摩洛哥",
          "logo": ""
        }, {
          "name": "南非",
          "logo": ""
        }, {
          "name": "肯尼亚",
          "logo": ""
        }, {
          "name": "赛舌瓜",
          "logo": ""
        }, {
          "name": "坦桑尼亚",
          "logo": ""
        }, {
          "name": "突尼斯",
          "logo": ""
        }, {
          "name": "纳米比亚",
          "logo": ""
        }, {
          "name": "埃塞俄比亚",
          "logo": ""
        }, {
          "name": "加纳",
          "logo": ""
        }, {
          "name": "马达加斯加",
          "logo": ""
        }, {
          "name": "阿尔及利亚",
          "logo": ""
        }, {
          "name": "赞比亚",
          "logo": ""
        }, {
          "name": "乌干达",
          "logo": ""
        }, {
          "name": "马拉维",
          "logo": ""
        }, {
          "name": "津巴布韦",
          "logo": ""
        }, {
          "name": "尼日利亚",
          "logo": ""
        }, {
          "name": "博茨瓦纳",
          "logo": ""
        }, {
          "name": "莫桑比克",
          "logo": ""
        }, {
          "name": "尼日尔",
          "logo": ""
        }, {
          "name": "安哥拉",
          "logo": ""
        }
      ]
    }, {
      "country": "南美洲",
      "city": [
        {
          "name": "秘鲁",
          "logo": ""
        }, {
          "name": "巴西",
          "logo": ""
        }, {
          "name": "阿根廷",
          "logo": ""
        }, {
          "name": "智利",
          "logo": ""
        }, {
          "name": "玻利维亚",
          "logo": ""
        }, {
          "name": "厄瓜多尔",
          "logo": ""
        }, {
          "name": "哥伦比亚",
          "logo": ""
        }, {
          "name": "乌拉圭",
          "logo": ""
        }, {
          "name": "委内瑞拉",
          "logo": ""
        }, {
          "name": "苏里南",
          "logo": ""
        }, {
          "name": "奎亚那",
          "logo": ""
        }
      ]
    }, {
      "country": "南极洲",
      "city": [{
        "name": "南极洲",
        "logo": ""
      }]
    }]
  }
})
