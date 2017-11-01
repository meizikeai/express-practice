## 失败的试验品-构建方式：

* 实现方式：nodejs + express + swig + mongodb
* 运行地址：http://localhost:3008
* mongodb：https://www.npmjs.com/package/mongodb

## 目录结构说明：

### `bin目录为node站点入口目录，具体见package.json`
*   --updata-to-mongodb.js数据存到Mongodb的入口文件
*   --server.js站点启动文件

### `pack目录为站点资源目录`

帮助文档 -- https://github.com/ruanyf/webpack-demos/blob/master/README.md

*   -- webpack 直接打包
*   -- webpack -w 提供watch方法，实时进行打包更新
*   -- webpack -p 对打包后的文件进行压缩
*   -- webpack -d 提供SourceMaps，方便调试
*   -- webpack --colors 输出结果带彩色，比如：会用红色显示耗时较长的步骤
*   -- webpack --profile 输出性能数据，可以看到每一步的耗时
*   -- webpack --display-modules 默认情况下 node_modules 下的模块会被隐藏，加上这个参数可以显示这些被隐藏的模块

### `public目录为静态文件目录，如样式、图片、脚本`

### `website目录为站点相关文件`

### `views目录为模块目录`

-------------------------------------------------------------------

## 启动说明：
* 一、请安装Mongodb数据库并启动，端口为默认27017 -- 命令 mongod --dbpath C:\Data
* 二、请在APP根目录安依赖文件，执行shell命令：npm install
* 三、进到bin目录，执行shell命令：node client.js - 获取数据，存到数据库
* 四、执行 set DEBUG=express-practice:* & npm start 或进到bin目录，执行shell命令：node server.js - 启动站点
* 五、访问http://localhost:3008

-------------------------------------------------------------------

## NodeJS常用模块：

### `前端模板`

* -- EJS  - http://www.embeddedjs.com/
* -- Jade - http://jade-lang.com/
* -- handlebarsjs - http://handlebarsjs.com/installation.html
* -- swig - https://www.npmjs.com/package/swig 、https://github.com/node-swig/swig-templates - 已不推荐

### `数据库驱动`

* -- Mongoose - http://mongoosejs.com/
*    - Mongoose是MongoDB的对象模型工具，通过Mongoose框架，可以进行非常方便的访问MongoDB的操作。
* -- mongodb - https://www.npmjs.com/package/mongodb
*    - 功能相对较少，比较底层一些，其实Mongoose就是基于它构建的

### `Web Socket`

* -- Socket.IO  - http://socket.io/
                - Socket.IO则Socket模块的不二选择，可以用于构建聊天室、客服系统等。

### `日志 `

* -- morgan  - https://github.com/expressjs/morgan


### `异步流程控制`

* -- Async - https://www.npmjs.org/package/async
*    - NodeJS中大量的异步callback嵌套估计让很多人头疼，尤其是多个异步函数要求一定的调用顺序时更是让代码失控，Async可以非常好的解决这些问题，它可以使异步流程同步化。
* -- Q - https://www.npmjs.com/package/q
*    - 一种非常不错的选择，它是实现了promises接口。
* -- promise - http://javascript.ruanyifeng.com/advanced/promise.html
*    - 建议直接使用ES6提供的Promise方法
  
### `进程守护`

* -- supervisor - https://www.npmjs.com/package/supervisor
*    -w | --watch          //要监控的文件夹或js文件，默认为'.'
*    -i | --ignore         //要忽略监控的文件夹或js文件
*    -p | --poll-interval  //监控文件变化的时间间隔（周期），默认为Node.js内置的时间
*    -e | --extensions     //要监控的文件扩展名，默认为'node|js'
*    -x | --exec           //要执行的主应用程序，默认为'node'
*    --debug               //开启debug模式（用--debug flag来启动node）
*    -q | --quiet          //安静模式，不显示DEBUG信息

```js
*   Examples:
*     supervisor myapp.js
*     supervisor myapp.coffee
*     supervisor -w scripts -e myext -x myrunner myapp
*     supervisor -w lib,server.js,config.js server.js
*     supervisor -- server.js -h host -p port
*     supervisor -w bin,website,views ./bin/server.js
```

* -- forever    - https://www.npmjs.com/package/forever
*    - forever可以看做是一个nodejs的守护进程，能够启动，停止，重启我们的app应用，运行稳定，支持高并发，启动/停止命令简单，支持热部署，宕机重启，监控界面和日志，集群环境。
* -- nodemon    - http://nodemon.io/

### `定时任务`

* -- Cron  - https://www.npmjs.com/package/cron
*    - cron是一个小巧的定时任务管理模块，可以满足我们绝大部分需求，它支持标准的cron patterns,熟悉linux cron tab的语法就可以很容易上手。
* -- Later - http://bunkat.github.io/later/index.html
*    - 另外一个名气比较大且功能比较强大的定时模块是Later，对于功能要求比较高的可用用它，later的缺点是有点复杂，不像cron只要拿来就会用了。
* -- crontab

### `单元测试`

* -- Mocha   - https://www.npmjs.org/package/mocha
* -- Karma   - https://www.npmjs.org/package/karma
* -- Jasmine - https://www.npmjs.org/package/jasmine


### `cookie`
* -- cookie-parser - https://github.com/expressjs/cookie-parser