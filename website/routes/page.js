var page = require("../control/page");

module.exports = function (app) {
    app.get("/", page.home); // 首页
    app.get("/user", page.userhome); // 用户中心-首页
    app.get("/login", page.login); //登录页

    app.post("/checkonline", page.logincheck); // 登录验证
    // app.get("/data", page.getHomeData); // 返回首页数据
    // app.get("/user/data", page.getUserHomeData); // 返回用户中心-首页数据
};