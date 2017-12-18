## Express Practice - Test failed
* 实现方式：nodejs + express + swig + mongodb
* 访问地址：[http://localhost:3008](http://localhost:3008) - 可访问首页、抢先、登录、注册、找回密码、用户中心（需要注册帐号）、订单管理、专题页面、详情页等~


## 启动说明
* 请在Mongodb中的bin目录启动数据库，执行 mongod --dbpath C:\Data
* 请在根目录安依赖文件，执行 npm install
* 请在根目录把假数据更新到数据库，执行 npm run base
* 请在根目录生成相关的脚本、样式文件，执行 npm run pack
* 站点启动，执行 npm start


## 效果预览
![image](https://github.com/meizikeai/express-practice/blob/master/public/preview/preview-01.png)
![image](https://github.com/meizikeai/express-practice/blob/master/public/preview/preview-02.png)
![image](https://github.com/meizikeai/express-practice/blob/master/public/preview/preview-03.png)
![image](https://github.com/meizikeai/express-practice/blob/master/public/preview/preview-04.png)
![image](https://github.com/meizikeai/express-practice/blob/master/public/preview/preview-05.png)
![image](https://github.com/meizikeai/express-practice/blob/master/public/preview/preview-06.png)
![image](https://github.com/meizikeai/express-practice/blob/master/public/preview/preview-07.png)


## 目录结构

**1、bin**
> fake.js、server.js、update-to-mongodb.js
```
假数据文件、站点启动文件、假数据存到数据库的入口文件（所有数据的关系存不合理的情况）~
```

**2、pack**
> 资源文件 - 脚本、样式等文件，使用[webpack](https://github.com/ruanyf/webpack-demos/blob/master/README.md)进行打包

**3、public**
> 静态文件 - 存放最终生成的静态文件如脚本、样式、图片等

**server**
> 站点文件 - 配置、路由、数据模板等

**5、views**
> 模块文件 - 页头、页尾、各页面及相关的模块等


## 常用模块

**模板**
> [EJS](http://www.embeddedjs.com/)、
> [handlebarsjs](http://handlebarsjs.com/installation.html)、
> [Jade](http://jade-lang.com/)、
> [swig](https://www.npmjs.com/package/swig) and [swig-templates](https://github.com/node-swig/swig-templates) - 不推荐

**数据库驱动**
> [Mongoose](http://mongoosejs.com/)、[mongodb](https://www.npmjs.com/package/mongodb)

**日志**
> [morgan](https://github.com/expressjs/morgan)

**异步流程**
> [promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)、[Async](https://www.npmjs.org/package/async)、[Q](https://www.npmjs.com/package/q)

**进程守护**
> [supervisor](https://www.npmjs.com/package/supervisor)、[forever](https://www.npmjs.com/package/forever)、[nodemon](https://www.npmjs.com/package/nodemon)

**定时任务**
> [node-schedule](https://github.com/node-schedule/node-schedule)

**cookie**
> [cookie-parser](https://github.com/expressjs/cookie-parser)、[express-session](https://github.com/expressjs/session)、[connect-mongo](https://github.com/jdesboeufs/connect-mongo)


## 未用模块

**Web Socket**
> [Socket.IO](http://socket.io/)

**单元测试**
> [Mocha](https://www.npmjs.org/package/mocha)、[Karma](https://www.npmjs.org/package/karma)、[Jasmine](https://www.npmjs.org/package/jasmine)