
var router = require("koa-router")();
var study = require("./news/study");
var food = require("./news/food");
var DB = require("../db/db");

var db = new DB();
router.use("/study", study);
router.use("/food", food);
module.exports = router.routes();