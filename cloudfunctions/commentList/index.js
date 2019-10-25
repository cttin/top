// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database({
  env: 'test-cghig' // 环境ID
});

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise(async (resolve, reject) => {
    try{
      const wxContext = cloud.getWXContext()
      const { dbName, filter } = event;
      filter.status = 1;
      const result = await db.collection(dbName)
        .where(filter).orderBy('createtime', 'desc').get()
        .then(res => {
          res.errCode = '200';
          return res;
        });
      resolve(result);
    }catch(error) {
      if (!error.code) reject(error);
      resolve(error);
    }
  })
}