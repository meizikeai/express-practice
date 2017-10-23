var pages = require('../routes/home');

module.exports = function (app) {

    //首页
    app.get('/', pages.load);

    //返回首页数据
    app.get('/data', pages.homedata);

};