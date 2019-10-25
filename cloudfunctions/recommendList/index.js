// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: 'test-cghig' // 环境ID
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { dbName, filter = null, pageIndex = 1, pageSize = 10 } = event; // dbName：集合名称，pageIndex： 当前页码，pageSize：一页多少条
  const totalResult = await db.collection(dbName).where(filter).count(); // 获取集合中总记录数
  const totalCount = totalResult.total; // 总的条数
  const totalPage = Math.ceil(totalCount/10); // 计算需要多少页
  let hasMore = true;
  if (pageIndex > totalPage || pageIndex === totalPage) {
    hasMore = false;
  }else {
    hasMore = true;
  }
  return await db.collection(dbName).where(filter).skip((pageIndex - 1) * pageSize).limit(pageSize).orderBy('hot', 'desc').get().then(res => {
    res.hasMore = hasMore;
    res.errCode = '200'
    // res.wxContext = wxContext;
    return res;
  })
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}