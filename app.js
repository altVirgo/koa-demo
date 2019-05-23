var Koa = require("koa");
var Router = require("koa-router");
var view = require("koa-views");
var koaStatic = require("koa-static");
var bodyparser = require("koa-bodyparser");
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
app.use(session(CONFIG, app));

// app.use(view("views", {
//     extension: "ejs"
// }))

app.use(view(__dirname + "/views", {
    map: { html: "ejs" }
}))
app.use(koaStatic("views"));
app.use(bodyparser());
router.get("/hah", async (ctx, next) => {

    console.log("1", __dirname);
    ctx.cookies.set("user", "huangyuling");
    ctx.session.sessionUser="sessionhuangyuling";
    await ctx.render("index.html", {
        title: "加载index.html"
    });

    // next();
})
// app.use((ctx, next) => {
//     console.log(1);
//     next();
//     console.log(11);
//     if (ctx.status === 404) {
//         ctx.body = "这是一个404";
//     }
// })

router.get("/news", async (ctx, next) => {
    ctx.body = {
        "cookie:": ctx.cookies.get("user"),
        "ctx.request": ctx,
        "ctx.query": ctx.query,
        "ctx.querystring": ctx.querystring
    };
    console.log(3);
    console.log(ctx.session.sessionUser);
    // next();
})
router.post("/login", async (ctx, next) => {
    ctx.body = ctx.request.body;
    console.log(ctx.session.sessionUser);
})

// app.use((ctx, next) => {
//     console.log(2);
//     next();
// })
// app.use(async (ctx) => {
//     // ctx.body = "hello";
// })

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000,()=>{
    console.log("server start");
});