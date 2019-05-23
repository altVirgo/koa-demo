const config = require("./config");
const MongoClient = require("mongodb");

var connectList = [];
var pendingQueue = [];
class db {
    constructor() {
        this.initConnect();
    }
    // 根据config 配置文件初始化链接数
    initConnect() {
        for (let i = 0; i < config.connectNum; i++) {
            // console.time("init"+i);
            if (connectList[i]) {
                return connectList[i];
            } else {
                this.createConnect().then((client) => {
                    connectList[i] = {
                        index: i,
                        status: 0,
                        connect: client
                    }
                    // console.timeEnd("init"+i);
                }).catch((err) => {
                    console.log(err);
                    this.connect();
                })
            }
        }
    }
    // 创建连接
    createConnect() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(config.dbUrl, { useNewUrlParser: true }, (err, client) => {
                if (!err) {
                    resolve(client);
                } else {
                    reject(err);
                }
            })
        })
    }
    // 获取所有的连接
    getConnect() {
        return connectList;
    }
    // 按连接创建的顺序获取第一个空闲状态的连接
    // 如果一个空闲状态的连接都没有，进入下一次轮询；
    async getOneConnect() {
        let connection = null;
        for (let i = 0; i < config.connectNum; i++) {
            if (connectList[i] && connectList[i].status === 0) {
                connection = connectList[i];
                break;
            }
        }
        while (connection === null) {
            await this.getOneConnect();
        }
        return connection;
    }
    // 根据查询条件查询数据
    async query(tableName, json, option) {
        option = Object.assign({ limit: config.defaultLimit }, option);
        const connection = await this.getOneConnect();
        connection.status = 1;
        return new Promise(async (resolve, reject) => {
            const db = connection.connect.db(config.dbName);
            const collection = db.collection(tableName);
            collection.find(json, option || {}).toArray((err, result) => {
                connection.status = 0;
                console.log((err, result));
                if (err === null) {
                    resolve(result);
                } else {
                    reject(err);
                }
            })

        })

    }
    // 根据查询条件查询数据总数
    async count(tableName, json, option) {
        option = Object.assign({ limit: config.defaultLimit }, option);
        const connection = await this.getOneConnect();
        connection.status = 1;
        return new Promise(async (resolve, reject) => {
            const db = connection.connect.db(config.dbName);
            const collection = db.collection(tableName);
            collection.countDocuments(json, (err, count) => {
                if (err === null) {
                    resolve(count);
                } else {
                    reject(err);
                }
            })
        })
    }
    // 删除数据
    async delete(tableName, json, option) {
        option = Object.assign({ limit: defaultLimit }, option);
        const connection = await this.getOneConnect();
        connection.status = 1;
        return new Promise((resolve, reject) => {
            const db = connection.connect.db(config.dbName);
            const collection = db.collection(tableName);
            collection.deleteOne(json, (err, result) => {
                connection.status = 0;
                if (err === null) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        })
    }
    // 更新数据
    async update(tableName, json, newJson, option) {
        option = Object.assign({ limit: defaultLimit }, option);
        const connection = await this.getOneConnect();
        connection.status = 1;
        return new Promise((resolve, reject) => {
            const db = connection.connect.db(config.dbName);
            const collection = db.collection(tableName);
            collection.updateOne(json, newJson, (err, result) => {
                connection.status = 0;
                if (err === null) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        })
    }
    // 插入数据
    async insert(tableName, json, option) {
        option = Object.assign({ limit: defaultLimit }, option);
        const connection = await this.getOneConnect();
        connection.status = 1;
        return new Promise((resolve, reject) => {
            const db = connection.connect.db(config.dbName);
            const collection = db.collection(tableName);
            collection.insertOne(json, (err, result) => {
                connection.status = 0;
                console.log(result.result.n, result.ops.length);
                if (err === null) {
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        })
    }
}
// var a = new db();
// setTimeout(() => {
//     // console.log(connectList);
//     console.log("============================================================")
//     console.time("query");
//     a.query("news", { username: "huangyuling" }).then((res) => {
//         // console.log("query success", res);
//         console.log("query success,total:", res.length);
//         console.timeEnd("query");
//     }).catch((err) => {
//         // console.log("query error", err);
//         console.log("query error");
//         console.timeEnd("query");
//     });

//     // console.time("delete");
//     // a.delete("news", { username: "huangyuling" }).then((res) => {
//     //     // console.log("delete success", res);
//     //     console.log("delete success");
//     //     console.timeEnd("delete");
//     // }).catch((err) => {
//     //     // console.log("delete error", err);
//     //     console.log("delete error");
//     //     console.timeEnd("delete");
//     // });

//     // console.time("update");
//     // a.update("news", { username: "huangyuling1" }, { $set: { age: 45 } }).then((res) => {
//     //     // console.log("update success", res);
//     //     console.log("update success");
//     //     console.timeEnd("update");
//     // }).catch((err) => {
//     //     // console.log("update error", err);
//     //     console.log("update error");
//     //     console.timeEnd("update");
//     // });

//     // console.time("insert");
//     // a.insert("news", { "username": "huangyuling", "age": 12, "sex": "男", "status": 0 }).then((res) => {
//     //     // console.log("insert success", res);
//     //     console.log("insert success");
//     //     console.timeEnd("insert");
//     // }).catch((err) => {
//     //     // console.log("insert error", err);
//     //     console.log("insert error");
//     //     console.timeEnd("insert");
//     // });

//     // let n = 100000;
//     // for (let i = 0; i <= n; i++) {
//     //     console.time("insert" + i);
//     //     a.insert("news", { "username": "huangyuling", "age": 12, "sex": "男", "status": 0, "index": i }).then(async (res) => {
//     //         // console.log("insert success", res);
//     //         console.log("insert success");
//     //         // console.timeEnd("delete" + i);
//     //     }).catch((err) => {
//     //         // console.log("insert error", err);
//     //         console.log("insert error");

//     //     });
//     //     console.timeEnd("insert" + i);
//     // }
// }, 2000)

module.exports = db;
