// components/video/video.js
// 此组件中默认的视频宽度为容器大小，有需要更改的地方再设置totalMargin进行覆盖即可
const common = require('../../common/index')
import {
  setVideoSize
} from '../behaviors/setVideoSize';
Component({
  behaviors: [setVideoSize],
  properties: {
    totalMargin: { // 覆盖behaviors中计算的高度
      type: Number,
      value: 0
    },
    videoUrl: {
      type: String,
      value: ''
    },
    coverUrl: {
      type: String,
      value: 'https://cdn.pixabay.com/photo/2014/05/03/01/04/manhattan-336708__480.jpg'
    },
    muted: {
      type: Boolean,
      value: true
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    // listVideoInfo: {
    //   coverUrl: 'https://cdn.pixabay.com/photo/2019/09/11/19/26/sunset-4469682__480.jpg',
    //   videoUrl: 'https://mazwai.com/videvo_files/video/free/2014-06/small_watermarked/ben_pierce--black-necked_stilt_preview.webm?v=1745060'
    // },
    autoplay: false,
    controls: true,
    play: false,
    fullScreen: false,
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
          const networkType = res.networkType;
          console.log(networkType)
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
      // let that = this;
      wx.createIntersectionObserver(this)
        .relativeToViewport()
        .observe('.video-wrap', res => {
          if (res && res.intersectionRatio > 0) {
            this.videoPlay();
          } else {
            this.videoPause();
          }
        });
    }
  }
})