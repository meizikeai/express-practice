const http = require("http");
const fs = require('fs');
const connection = require("./connection");

function runServiceData(params) {
    this.init();
}

runServiceData.prototype = {
    init: function () {
        this.setHomeDate();
        this.setUserCenterDate();
    },
    setHomeDate: function () {
        // console.log(__dirname);
        fs.readFile("data-home.json", function (error, data) {
            if (error) {
                console.log(error);
            } else {
                connection.clientUpdate('home', JSON.parse(data));
            }
        });
    },
    setUserCenterDate: function () {
        // console.log(__dirname);
        fs.readFile("data-users.json", function (error, data) {
            if (error) {
                console.log(error);
            } else {
                connection.clientUpdate('users', JSON.parse(data));
            }
        });
    },
    userCenterPage: function () {
        var getData = http.request({
            hostname: "m.yintai.com",
            port: "80",
            path: "/Services/Proxy.ashx?userid=123456",
            method: "get"
        }, function (record) {
            var result = "";

            record.setEncoding("utf8");
            record.on("data", function (data) {
                result += data;
            });

            record.on("end", function () {
                connection.clientUpdate('userhome', JSON.parse(result));
            });
        }).on("error", function (e) {
            console.log("problem with request: " + e.message);
        });

        getData.end();
    }
};

new runServiceData();