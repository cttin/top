// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: 'test-cghig' // 环境ID
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { dbName, id } = event;
  return await db.collection(dbName).doc(id).remove() // options（回调）是必要参数，否则不会成功
    .then(res => {
      return {
        errCode: '200',
        errMsg: '操作成功！'
      }
    })
}