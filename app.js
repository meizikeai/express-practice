const fs = require('fs');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const swig = require('swig');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);

const config = {
    db: "mongodb://localhost:27017/mobile"
};

const connect = () => {
    mongoose.connect(config.db, {
        useMongoClient: true,
        socketTimeoutMS: 0,
        keepAlive: true,
        reconnectTries: 30
    });
}
connect();

mongoose.connection.on("open", function () {
    // console.log("mongodb connection is success！");
});

mongoose.connection.on("error", function (error) {
    console.log("mongodb connection is failure！ " + error);
});

mongoose.connection.on('disconnected', function () {
    console.log('mongodb connection is disconnected！ ');
    connect();
});

const models_path = __dirname + '/website/models';
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) { require(models_path + '/' + file); }
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'swig');
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('view cache', false);
swig.setDefaults({ cache: false });

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("love"));
app.use(session({
    secret: 'love',
    resave: false,
    saveUninitialized: true,
    name: "express",
    cookie: {
        path: "/",
        signed: true,
        maxAge: 1000 * 60 * 1 // 有效时间
    },
    store: new mongoStore({
        url: config.db,
        collection: "sessions"
    })
}));
app.use(express.static(path.join(__dirname, 'public')));

const routes_path = __dirname + '/website/routes';
fs.readdirSync(routes_path).forEach(function (file) {
    if (~file.indexOf('.js')) { require(routes_path + '/' + file)(app); }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;