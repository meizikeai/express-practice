const page = require("../control/page");
const admin = require("../control/admin");

module.exports = function (app) {
    // 页面
    app.get("/", page.home); // 首页
    app.get("/user", page.userhome); // 用户中心-首页
    
    app.get("/data", page.getHomeData); // 返回首页数据


    // 用户中心
    app.get("/login", admin.login); // 登录页
    app.get("/register", admin.register) // 注册页

    app.post("/checklogin", admin.checklogin); // 验证登录
    app.post("/checklogout", admin.checklogout); // 退出登录
    app.post("/checkregister", admin.checkregister); // 验证注册
};