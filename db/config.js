var config = {
    dbUrl: "mongodb://localhost:27017",  // 数据库地址
    dbName: "koa",                       // 表名
    connectNum: 10,                      // 初始化的连接数
    timeout: 2000,                       // 连接超时
    defaultLimit: 10                     // 默认查询列表的条数
}

module.exports = config;