var pages = require('../routes/user-home');

module.exports = function (app) {

    //用户中心-首页
    app.get('/user', pages.load);

    //返回用户中心-首页数据
    app.get('/user/data', pages.homedata);

};