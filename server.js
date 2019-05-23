var Koa = require("koa");
var Router = require("koa-router");
var Bodyparser = require("koa-bodyparser");
var MongoClient = require("mongodb");
const session = require("koa-session");

var app = new Koa();
var router = new Router();



app.keys = ["keys"];
const CONFIG = {
    keys: "kos:sess",
    maxAge: 500000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: true
}

console.time("start");
MongoClient.connect(dbUrl, { useNewUrlParser: true }, (err, client) => {
    
    if (err) {
        console.log(err);
        return;
    }
    var db = client.db(dbName);
    db.collection("news").insertOne({ "username": "张三", "age": 12, "sex": "nan", "status": 0 }, (err, result) => {
        if(!err){
            console.log("添加数据成功");
        }else{
            console.log(err, result);
        }
        console.timeEnd("start");
    });
})


app.use(session(CONFIG, app));
app.use(router.routes, router.allowedMethods);
app.listen(3000);

