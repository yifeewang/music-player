const path = require('path'); // 核心对象
module.exports = {
  viewDir:path.resolve('./views'),
  staticDir:path.resolve('./public'),
  uploadDir:path.resolve('./public/files'),
  appPort:8888,
  dbConfig:{
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '123456',
    database        : 'user_db'
  }
}