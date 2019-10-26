const common = require('../../common/index')
const app = getApp();
const userInfo = wx.getStorageSync('userInfo') || '';
console.log(userInfo, app, 'app')
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    // Custom: app.globalData.Custom,
    userInfo: wx.getStorageSync('userInfo') || '',
    // avatar: userInfo ? userInfo.avatarUrl : '',
    id: '', // postId
    openId: '', // 用户openid
    cardCur: 0,
    ellipsis: true,
    detail: {}, // 详情信息
    likeInfo: {}, // 喜欢信息
    commentInfo: {}, // 评论信息
    // focus: false,
    placeholder: '来了也不说一句嘛',
    commentId: '', // 选中到的该条评论的id
    addComment: {}, // 评论的信息
    commentDrawerModal: false, // 评论抽屉框
    deleteMainModal: false, // 主页底部删除对话框
    deleteDrawerModal: false, // 抽屉底部删除对话框
    drawerInputBottom: 0
  },
  onLoad: function(options) {
    // this.data.id = options.id;
    // this.data.openId = options.openId;
    if(!this.userInfo) {
      this.data.userInfo = wx.getStorageSync('userInfo');
      this.setData({
        id: options.id,
        openId: options.openId,
        userInfo: this.data.userInfo
      })
    }else {
      this.setData({
        id: options.id,
        openId: options.openId
      })
    }
    this.getDetail();
    this.getLikeInfo();
  },
  onShow() {
    this.getCommentInfo();
  },
  onReady() {
    console.log('ready')
  },  
  // 获取数据
  getDetail() {
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
    })
    wx.cloud.callFunction({
      name: 'recommendDetail',
      data: {
        dbName: 'recommend_collection',
        filter: {
          _id: this.data.id || 'd61458e3-ec4e-4e19-bd1c-5a1ad8b833a3',
          // _openid: options.openId || 'op9H-47XKV43E8LQngM2ToSJV44g'
        }
      }
    })
    .then(res => {
      wx.hideLoading();
      let detail = {...res.result};
      detail.createtime = common.utils.dateFormat(new Date(detail.createtime), 'yyyy-MM-dd');
      this.setData({
        detail
      })
    })
    .catch(err => {
      console.error(err);
    })
  },
  // 获取❤️情况
  getLikeInfo() {
    wx.cloud.callFunction({
      name: 'likeList',
      data: {
        dbName: 'like_collection',
        filter: {
          post_id: this.data.id || 'd61458e3-ec4e-4e19-bd1c-5a1ad8b833a3',
        }
      }
    })
    .then(res => {
      this.data.likeInfo = {...res.result}; // 前端显示最多显示五个头像
      this.setData({
        likeInfo: this.data.likeInfo
      })
    })
    .catch(err => {
      console.error(err);
    })
  },
  // 获取回复列表
  getCommentInfo() {
    wx.cloud.callFunction({
      name: 'commentList',
      data: {
        dbName: 'comment_collection',
        filter: {
          post_id: this.data.id
        }
      }
    })
    .then(res => {
      res = res.result;
      if (res.errCode === '200') {
        this.data.commentInfo = res.data.map(item => {
          return {
            ...item,
            createtime: common.utils.dateFormat(new Date(item.createtime), 'MM-dd'),
          }
        });
        this.setData({
          commentInfo: this.data.commentInfo
        })
      }
    })
    .catch(err => {
      console.error(err);
    })
  },
  // ❤️点击
  onLikeClick(event) {
    // 判断之前是否❤️
    console.log(this.data.likeInfo, 'this.data.likeInfo')
    if(this.data.likeInfo.status) {
      this.removeLike();
    }else {
      this.addLike();
    }
  },
  /**
   * 从喜欢集合中移除
   */
  removeLike() {
    // 删除当前用户的那条点赞记录
    wx.cloud.callFunction({
      name: 'remove',
      data: {
        dbName: 'like_collection',
        id: this.data.likeInfo._id
      }
    })
    .then(res => {
      // 刷新icon及数量状态
      res = res.result;
      if (res.errCode === '200') {
        this.getLikeInfo();
      }
    })
    .catch(err => {
      console.error(err);
    })
  },
  /**
   * 添加到喜欢集合中
   */
  addLike() {
    wx.cloud.callFunction({
      name: 'add',
      data: {
        dbName: 'like_collection',
        data: {
          post_id: this.data.id,
          avatar: this.data.userInfo.avatarUrl,
          name: this.data.userInfo.nickName,
          type: 1, // 推荐
        }
      }
    })
    .then(res => {
      res = res.result;
      // 刷新icon及数量状态
      if (res.errCode === '200') {
        this.getLikeInfo();
      }
    })
    .catch(err => {
      console.error(err);
    })
  },
  replyComment(e) {
    // console.log(this.data.focus)
    const _openId = e.currentTarget.dataset.openid;
    // 为了放方便调试。这里写死
    const openId = this.data.openId;
    console.log(_openId, openId, 'deleteModal')
    // 如果是自己回复的，则不能再回复，只能进行删除
    if (_openId === openId) { 
      const deleteModal = e.currentTarget.dataset.target;
      console.log(deleteModal, 'deleteModal')
      this.setData({
        [deleteModal]: true,
        commentId: e.currentTarget.dataset.id,
        mainFocus: false,
        drawerFocus: false,
        placeholder: '来了也不说一句嘛',
        addComment: {
          to_open_id: '',
          to_user_name: '',
          to_user_avatar: '',
        }
      })
    }else {
      const focusName = e.currentTarget.dataset.target === 'deleteMainModal' ? 'mainFocus' : 'drawerFocus';
      const addComment = {
        to_open_id: _openId,
        to_user_name: e.currentTarget.dataset.name,
        to_user_avatar: e.currentTarget.dataset.avatar,
      };
      this.setData({
        addComment,
        [focusName]: true,
        placeholder: `回复${addComment.to_user_name}：`
      })
    }
  },
  // 删除自己的评论或者回复
  removeComment(e) {
    // 删除当前用户的那条点赞记录
    wx.cloud.callFunction({
      name: 'remove',
      data: {
        dbName: 'comment_collection',
        id: this.data.commentId
      }
    })
      .then(res => {
        // 刷新评论列表
        res = res.result;
        if (res.errCode === '200') {
          this.getCommentInfo();
          this.hideModal(e);
        }
      })
      .catch(err => {
        console.error(err);
      })
  },
  // 发送按钮
  formSubmit(e) {
    const comment = this.data.addComment.comment;
    if (comment == undefined || comment == null || comment == "") {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    const data = {
      post_id: this.data.id, // 调试完了记得删除
      // _openid: this.data.openId || openId, 
      name: this.data.userInfo.nickName,
      avatar: this.data.userInfo.avatarUrl,
      content: comment,
      status: 1, // 正常
      createtime: Date.now(),
      to_open_id: this.data.addComment.to_open_id || '',
      to_user_avatar: this.data.addComment.to_user_avatar || '',
      to_user_name: this.data.addComment.to_user_name || '',
    }
    this.addComment(data);
  },
  addComment(data) {
    wx.cloud.callFunction({
      name: 'add',
      data: {
        dbName: 'comment_collection',
        data
      }
    })
    .then(res => {
      const addComment = {
        comment: '',
        to_open_id: '',
        to_user_name: '',
        to_user_avatar: '',
      };
      this.setData({
        addComment,
        placeholder: '来了也不说一句嘛'
      }, () => {
        res = res.result;
        // 刷新评论列表
        if (res.errCode === '200') {
          this.getCommentInfo();
        }
      })
    })
    .catch(err => {
      console.error(err);
    })
  },
  // 评论框失去焦点事件
  onCommentBlur(e) {
    // console.log(this.data.focus, 'blur')
    const text = e.detail.value.trim();
    if (!text) {
      const focusName = e.currentTarget.dataset.target;
      const addComment = {
        comment: '',
        to_open_id: '',
        to_user_name: '',
        to_user_avatar: '',
      };
      this.setData({
        addComment,
        [focusName]: false,
        placeholder: '来了也不说一句嘛'
      })
    }
  },
  //  input框赋值
  getCommentText(e) {
    this.setData({
      'addComment.comment': e.detail.value
    })
  },
  showModal(e) {
    // 原本想的跳转到另一个页面，但是没有想到好的方式共用这些很多类似的方法
    // const commentInfo = encodeURIComponent(JSON.stringify(this.data.commentInfo));
    // wx.navigateTo({
    //   url: `/components/chat/chat?commentInfo=${commentInfo}`
    // })
    const modalName = e.currentTarget.dataset.target;
    this.setData({
      [modalName]: true
    })
  },
  hideModal(e) {
    const modalName = e.currentTarget.dataset.target
    this.setData({
      [modalName]: null
    })
  },
  inputFocus(e) {
    this.setData({
      drawerInputBottom: e.detail.height,
      // focus: true
    })
  },
  inputBlur(e) {
    this.setData({
      drawerInputBottom: 0
    })
    this.onCommentBlur(e);
  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  ellipsis() {
    let ellipsis = !this.data.ellipsis;
    this.setData({
      ellipsis
    })
  },
})