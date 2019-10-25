// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: 'test-cghig' // 环境ID
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { dbName, filter = null } = event; // event为云函数调用时传递过来的参数
  return await db.collection(dbName).where(filter).get().then(res => {
    const data = res.data[0];
    data.detail.content.forEach(item => {
      item.text = item.text.replace(/\\n/g, "\n");
    });
    const detailRes = {
      // media: data.media,
      // content: data.content.replace(/\\n/g, "\n"),
      // detail: data.detail.map(item => {
      //   return {
      //     images: item.images,
      //     text: item.text.replace(/\\n/g, "\n")
      //   }
      // }),
      detail: data.detail,
      createtime: data.createtime,
      errCode: '200',
      errMsg: '操作成功！'
    };
    return detailRes;
  });
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}