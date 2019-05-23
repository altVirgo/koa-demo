const Koa = require("koa");
const router = require("koa-router")();
const cors = require('@koa/cors');    // 该中间件必须在启用路由之前启用，否则会导致web端无法获取结果集
const koaBody = require("koa-body");  // 支持  1、multipart/form-data  2、application/x-www-urlencoded 3、application/json
const koaBodyparser = require("koa-bodyparser"); // 默认支持json form类型的数据，但是不支持form-data类型的数据

const RouterUser = require("./routes/user");
const RouterNews = require("./routes/news");
const session = require("koa-session");

const app = new Koa();


app.use(koaBody());
app.use(cors());

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


router.use("/users", RouterUser);
router.use("/news", RouterNews);

app.use(router.routes(), router.allowedMethods());

app.listen(9000, () => {
    console.log("server started");
});

