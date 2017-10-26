const http = require("http");
const fs = require('fs');
const Client = require("../lib/client");

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
        fs.readFile("../lib/home-data.json", function (error, data) {
            if (error) {
                console.log(error);
            } else {
                Client.clientUpdate('home', JSON.parse(data));
            }
        });
    },
    setUserCenterDate: function () {
        // console.log(__dirname);
        fs.readFile("../lib/usercenter-data.json", function (error, data) {
            if (error) {
                console.log(error);
            } else {
                Client.clientUpdate('usercenter', JSON.parse(data));
            }
        });
    }
};

new runServiceData();