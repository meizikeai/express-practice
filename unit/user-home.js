var pages = require('../routes/user-home');

module.exports = function (app) {

    //用户中心-首页
    app.get('/UserCenter', pages.load);

    //返回用户中心-首页数据
    app.get('/UserCenter/data', pages.homedata);

};