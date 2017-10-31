const page = require("../control/page");

module.exports = function (app) {
    app.get("/", page.home); // 首页
    app.get("/user", page.userhome); // 用户中心-首页
    app.get("/login", page.login); // 登录页
    app.get("/register", page.register) // 注册页

    app.post("/checklogin", page.checklogin); // 验证登录
    app.post("/checklogout", page.checklogout); // 退出登录
    app.post("/checkregister", page.checkregister); // 验证注册

    app.get("/data", page.getHomeData); // 返回首页数据
};