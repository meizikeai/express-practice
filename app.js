var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var swig = require('swig');
var mongoose = require('mongoose');
// express-session

var connect = function () {
    mongoose.connect("mongodb://localhost:27017/mobile", {
        useMongoClient: true,
        socketTimeoutMS: 0,
        keepAlive: true,
        reconnectTries: 30
    });
}
connect();

mongoose.connection.on("open", function () {
    console.log("mongodb connection is success！");
});

mongoose.connection.on("error", function (error) {
    console.log("mongodb connection is failure！ " + error);
});

mongoose.connection.on('disconnected', function () {
    console.log('mongodb connection is disconnected！ ');
    connect();
});

var models_path = __dirname + '/website/models';
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) { require(models_path + '/' + file); }
});

var app = express();

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
app.use(express.static(path.join(__dirname, 'public')));

var routes_path = __dirname + '/website/routes';
fs.readdirSync(routes_path).forEach(function (file) {
    if (~file.indexOf('.js')) { require(routes_path + '/' + file)(app); }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
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