let leftList = new Array();
let rightList = new Array();
let leftHeight = 0, rightHeight = 0, itemWidth = 0, maxHeight = 0;
Component({
  properties: {
    commendInfo: {
      type: Object,
      default: {}
    }
  },
  data: {
    leftList: [],
    rightList: []
  },
  lifetimes: {
    attached: function() {
      console.log(leftList, rightList, this.data.commendInfo)
      wx.getSystemInfo({
        success: (res) => {
          console.log(res, 'res')
          let percentage = 750 / res.windowWidth; //750rpx/屏幕宽度
          let margin = 60 / percentage; // 60 => 三个margin间距
          itemWidth = (res.windowWidth - margin) / 2; // px
          maxHeight = itemWidth / 0.8;
        }
      })
    },
    detached: function() {

    }
  },
  methods: {
    fillData: function(isPull, listData) { 
      console.log(listData, 'listData')
      // this.setData({
      //   leftList: [],
      //   rightList: [],
      // });
      console.log(isPull, listData, 'fsf')
      if (isPull) { //是否下拉刷新，是的话清除之前的数据
        leftList.length = 0;
        rightList.length = 0;
        leftHeight = 0;
        rightHeight = 0;
      }
      for(let i = 0; i < listData.length; i++) {
        const temp = listData[i]; // 图片信息在cover对象里面
        const image = temp.cover;
        image.width = parseInt(image.width) || 50;
        image.height = parseInt(image.height) || 60;
        image.itemWidth = itemWidth;
        let per = image.width / image.itemWidth; // 图片宽高比
        image.itemHeight = image.height / per; //image 高度
        if (image.itemHeight > maxHeight) {
          image.itemHeight = maxHeight;
        }
        // temp.image = image;
        if(leftHeight === rightHeight) {
          leftList.push(temp);
          leftHeight = leftHeight + temp.cover.itemHeight * 2 + 100  + 20; // 底部文字和间距高度
        }else if (leftHeight < rightHeight) {
          leftList.push(temp);
          leftHeight = leftHeight + temp.cover.itemHeight * 2 + 100 + 20; // 底部文字和间距高度
        }else {
          rightList.push(temp);
          rightHeight = rightHeight + temp.cover.itemHeight * 2 + 100 + 20; // 底部文字和间距高度
        }
        console.log(rightHeight, leftHeight, 'leftHeight')
      }
      let wrapHeight = Math.max(leftHeight, rightHeight);
      this.setData({
        leftList: leftList,
        rightList: rightList,
      });
      this.triggerEvent('getHeight', { wrapHeight });
      console.log(leftList, rightList, maxHeight, wrapHeight, 'height')
    },
    onDetailTap(e) {
      const postId = e.currentTarget.dataset.postid;
      const openId = e.currentTarget.dataset.openid;
      // 阅读数更新
      wx.cloud.callFunction({
        name: 'updateView',
        data: {
          dbName: 'recommend_collection',
          _id: postId
        }
      })
      .then(res => {
        console.log(res.data)
      })
      .catch(err => {
        console.error(err);
      })
      console.log(postId)
      wx.navigateTo({
        url: `/components/recommendDetail/recommendDetail?id=${postId}&openId=${openId}`
      })
    }
  },
})