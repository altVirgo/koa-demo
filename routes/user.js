const router = require("koa-router")();
const DB = require("../db/db");

const db = new DB();
router.post("/list", async (ctx, next) => {
    let data = {};
    await db.query("news", ctx.request.body, { skip: 0, limit: 10 }).then((res) => {
        data.data = res;
        console.log(res);
    }).catch((err) => {
        ctx.body = {
            "cookie:": ctx.cookies.get("user"),
            "ctx.request": ctx.request.body,
            "ctx.query": ctx.query,
            "ctx.querystring": ctx.querystring.body,
            "error": err
        };
    })
    await db.count("news", ctx.request.body).then((count) => {
        data.count = count;
    }).catch((err) => {
        ctx.body = {
            "cookie:": ctx.cookies.get("user"),
            "ctx.request": ctx.request.body,
            "ctx.query": ctx.query,
            "ctx.querystring": ctx.querystring.body,
            "error": err
        };
    })

    console.log(data,"dataEnd");
    
    ctx.set("Content-Type", "application/json");
    ctx.response.body = {
        "cookie:": ctx.cookies.get("user"),
        "ctx.request": ctx.request.body,
        "ctx.query": ctx.query,
        "ctx.querystring": ctx.querystring.body,
        "data": data
    };
})



module.exports = router.routes();