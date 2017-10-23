var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/mobile';

module.exports = {
    //更新数据
    clientUpdate: function (name, update) {

        var dbname = name;
        var dbdata = update;

        var updateData = function (db, callback, data) {
            var collection = db.collection(dbname); //连接表

            collection.find({}).toArray(function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    if (result.length > 0) {
                        collection.updateOne({}, { $set: data }, function (err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                callback(result);
                            }
                        });
                    } else {
                        db.close();
                        module.exports.clientInsert(name, update);
                    }
                }
            });

        };

        MongoClient.connect(DB_CONN_STR, function (err, db) { //连接数据库
            updateData(db, function (data) {
                db.close();
                console.log('mongodb table - ' + dbname + ' - updata success');
            }, dbdata);
        });
    },
    //查询数据
    clientSelect: function (name, match, back) {
        var dbname = name;
        var dbmatch = match;
        var dbback = back;

        var selectData = function (db, callback) {
            var collection = db.collection(dbname); //连接表
            collection.find(dbmatch).toArray(function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    callback(result);
                }
            });
        };

        MongoClient.connect(DB_CONN_STR, function (err, db) { //连接数据库
            selectData(db, function (result) {
                if (dbback) {
                    dbback(result[0]);
                }
                db.close();
                console.log("mongodb table - " + dbname + " - query success！");
            });
        });
    },
    //插入数据
    clientInsert: function (name, data) {
        var dbname = name;
        var dbdata = data;

        var insertData = function (db, callback) {
            var collection = db.collection(dbname); //连接表
            collection.insert(dbdata, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    callback(result);
                }
            });
        };

        MongoClient.connect(DB_CONN_STR, function (err, db) { //连接数据库
            insertData(db, function (result) {
                db.close();
                console.log("mongodb table - " + dbname + " - insert success！");
            });
        });
    }
};