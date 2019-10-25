const setVideoSize = Behavior({
  behavior: [],
  properties: {
    totalMargin: {  // 外部的间距，即是否为全屏
      type: Number,
      value: 0
    },
    part: { // 几等分
      type: Number,
      value: 1
    }
  },
  data: {
    videoWidth: 300,
    videoHeight: 225
  },
  attached: function() {
    wx.getSystemInfo({
      success: res => {
        let windowWidth = res.windowWidth; 
        let percent = 750 / res.windowWidth; // 750rpx / 屏幕宽度
        let margin = this.properties.totalMargin / percent; // 转化为px
        let videoWidth = (windowWidth - margin) / this.properties.part;
        console.log(margin)
        let videoHeight = (225 / 300) * videoWidth; // 屏幕高宽比
        console.log(videoHeight, 'videoHeight')
        this.setData({
          videoWidth: videoWidth,
          videoHeight: videoHeight
        })
      }
    })
  },
  methods: {

  }
})
export {
  setVideoSize
}