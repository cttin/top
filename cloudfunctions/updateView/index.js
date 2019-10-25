// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: 'test-cghig' // 环境ID
})

const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { dbName, _id } = event; // event为云函数调用时传递过来的参数
  return await db.collection(dbName).doc(_id)
    .update({
      data: {
        view: _.inc(1)
      }
    })
    .then(res => {
      return {
        errCode: '200',
        errMsg: '操作成功！'
      }
    })
    .catch(err => {
      console.log(error);
    })
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}