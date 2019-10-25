// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise(async (resolve, reject) => {
    try {
      const wxContext = cloud.getWXContext()
      let { dbName, data } = event;
      data = { ...data, _openid: wxContext.OPENID };
      const result = await db.collection(dbName).add({
        data
      })
        .then(res => {
          return {
            errCode: '200',
            errMsg: '操作成功！'
          }
        })
      resolve(data);
    } catch (error) {
      if (!error.code) reject(error);
      resolve(error);
    }
  })
}