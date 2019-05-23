const router = require("koa-router")();
const DB = require("../../db/db");

const db = new DB();
router.post("/list", async (ctx, next) => {
    await db.query("users", ctx.request.body).then((res) => {
        ctx.body = {
            "cookie:": ctx.cookies.get("user"),
            "ctx.request": ctx.request.body,
            "ctx.query": ctx.query,
            "ctx.querystring": ctx.querystring.body,
            "data": res
        };
    }).catch((err) => {
        ctx.body = {
            "cookie:": ctx.cookies.get("user"),
            "ctx.request": ctx.request.body,
            "ctx.query": ctx.query,
            "ctx.querystring": ctx.querystring.body,
            "error": err
        };
    })
})

router.post("/add", async (ctx, next) => {
    await db.insert("users", ctx.request.body).then((res) => {
        ctx.body = {
            "cookie:": ctx.cookies.get("user"),
            "ctx.request": ctx.request.body,
            "ctx.query": ctx.query,
            "ctx.querystring": ctx.querystring.body,
            "data": res
        };
    }).catch((err) => {
        ctx.body = {
            "cookie:": ctx.cookies.get("user"),
            "ctx.request": ctx.request.body,
            "ctx.query": ctx.query,
            "ctx.querystring": ctx.querystring.body,
            "error": err
        };
    })
})


module.exports = router.routes();