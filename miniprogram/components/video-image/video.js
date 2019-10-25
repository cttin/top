// components/video/video.js
const common = require('../../common/index')
import {
  setVideoSize
} from '../behaviors/setVideoSize';
Component({
  behaviors: [setVideoSize],
  properties: {
    swiperList: {
      type: Array,
      value: [{
        id: 0,
        type: 'image',
        url: 'https://cdn.pixabay.com/photo/2019/06/10/18/42/plant-4264952__480.jpg'
      }, {
        id: 1,
        type: 'image',
        url: 'https://cdn.pixabay.com/photo/2017/10/14/22/04/mosque-hassan-2852007__480.jpg',
      }]
    },
    totalMargin: { // 覆盖behaviors计算高度
      type: Number,
      value: 0
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    listVideoInfo: {
      coverUrl: 'https://cdn.pixabay.com/photo/2019/09/11/19/26/sunset-4469682__480.jpg',
      videoUrl: 'http://mazwai.com/system/posts/videos/000/000/229/preview_mp4_2/omote_iceland__an_iceland_venture.mp4?1528050680'
    },
    autoplay: false,
    controls: true,
    play: false,
    fullScreen: false,
    video: true,
    left: false,
  },
  ready() {
    this.initData();
    this.getNetworkType();
    this.subscribePosition();
  },
  methods: {
    initData() {
      let videoContext = wx.createVideoContext('video', this);
      this.setData({
        videoContext
      })
    },
    getNetworkType() {
      wx.getNetworkType({ // 获取网络环境，WIFI情况下自动播放
        success: (res) => {
          const networkType = res.newworkType;
          if (networkType === 'wifi') {
            this.videoPlay();
          }
        }
      })
    },
    videoPlay() { // 播放
      const {
        videoContext
      } = this.data;
      this.setData({
        play: true,
        autoplay: true
      }, () => {
        videoContext.play();
      })
    },
    videoPause() { // 暂停
      const {
        videoContext
      } = this.data;
      this.setData({
        play: false,
        autoplay: false
      }, () => {
        videoContext.pause();
      })
    },
    handleVideoEnded() { // 播放完成
      const {
        videoContext
      } = this.data;
      this.setData({
          play: false,
          autoplay: false,
        },
        () => {
          videoContext.stop();
        }
      );
    },
    controlVideo() { // 点击播放按钮
      this.videoPlay();
    },
    handleFullScreenChange() { // 全屏
      const {
        fullScreen
      } = this.data;
      this.setData({
        fullScreen: !fullScreen,
      });
    },
    handleSwapeShow(e) { // 点击视频/图片
      const {
        dataset
      } = e.target;
      const {
        videoContext
      } = this.data;
      if (dataset.target === 'video') {
        this.setData({
          video: true,
          left: false,
          play: false,
        });
      } else {
        this.setData({
          video: false,
          left: true,
        });
      }
      videoContext.pause();
    },
    subscribePosition() { // 视频不在可视范围，停止播放
      let that = this;
      wx.createIntersectionObserver(that)
        .relativeToViewport()
        .observe('.video-wrap', res => {
          if (res && res.intersectionRatio > 0) {
            that.videoPlay();
          } else {
            that.videoPause();
          }
        });
    },
    DotStyle(e) { // 轮播样式
      this.setData({
        DotStyle: e.detail.value
      })
    },
    touchStart(e) {
      this.setData({
        startX: e.changedTouches[0] && e.changedTouches[0].clientX,
        startY: e.changedTouches[0] && e.changedTouches[0].clientY
      })
    },
    touchMove(e) {
      const startX = this.data.startX, // 开始X坐标
            startY = this.data.startY, // 开始Y坐标
            touchMoveX = e.changedTouches[0] && e.changedTouches[0].clientX, // X轴滑动后坐标
            touchMoveY = e.changedTouches[0] && e.changedTouches[0].clientY; // Y轴滑动后坐标
      const angle = common.utils.GetSlideDrection(startX, startY, touchMoveX, touchMoveY);
      console.log(angle)
      if (angle === 3) { // 向左
        this.setData({
          left: true,
          video: false,

        })
      }else if(angle === 4) { // 向右
        this.setData({
          left: false,
          video: true
        })
      }
    }
  }
})