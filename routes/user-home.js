"use strict";

var swig = require('swig');
var client = require("../lib/client");

var CreateTemplate = function (filename, data) {
    var template = null;
    var fraction = "";

    if (typeof filename != 'string') {
        return false;
    } else if (typeof data != 'object') {
        return false;
    }

    template = swig.compileFile('./views/blocks/user-home/' + filename + '.html');
    fraction = template({ content: data });

    return fraction;
};

module.exports = {
    load: function (req, res, next) {

        client.clientSelect('usercenter', {}, function (data) {

            let fullhtml = "";
            const result = data;
            const pagesinfo = result.data;

            if (result.isSuccessful && pagesinfo) {

                fullhtml += CreateTemplate("content", pagesinfo);

            } else {
                fullhtml = '<div class="user-error">服务器忙，请稍后再试！（H00001）</div>';
            }

            res.render("./pages/user-home.html", {
                title: "用户中心",
                data: fullhtml
            });

        });

    },
    homedata: function (req, res, next) {
        client.clientSelect('usercenter', {}, function (data) {

            res.type('application/json');   // => 'application/json'

            // res.set({
            //     'Content-Type': 'application/json; charset=utf-8'
            // });
            res.send(data);

        });
    }
};