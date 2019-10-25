// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: 'test-cghig' // 环境ID
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { dbName, filter = null } = event;
  return await db.collection(dbName).where(filter).get().then(res => {
    const userLike = res.data.filter(item => item._openid === wxContext.OPENID); // 获取当前用户的记录
    res.status = userLike.length ? 1 : 0; // 点赞状态  0--取消赞   1--有效赞
    res._id = res.status ? userLike[0]._id : ''; // 当前用户点赞记录的id
    res.count = res.data.length;
    res.errCode = '200';
    return res;
  })
}