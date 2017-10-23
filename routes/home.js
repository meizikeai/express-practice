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

    template = swig.compileFile('./views/blocks/home/' + filename + '.html');
    fraction = template({ content: data });

    return fraction;
};

module.exports = {
    load: function (req, res, next) {

        client.clientSelect('home', {}, function (data) {

            let fullhtml = "";
            const result = data;
            const pagesinfo = result.data;

            if (result.isSuccessful && pagesinfo) {

                if (pagesinfo.templatelist && pagesinfo.templatelist.length > 0) {
                    fullhtml = CreateTemplate("bannerlist", pagesinfo.bannerlist);
                }

                if (pagesinfo.templatelist && pagesinfo.templatelist.length > 0) {
                    for (let i = 0; i < pagesinfo.templatelist.length; i++) {
                        let storey = pagesinfo.templatelist[i];
                        fullhtml += CreateTemplate(storey.templatetype, storey);
                    }
                }

            } else {
                fullhtml = "<div>服务器忙，请稍后再试！（H00001）</div>";
            }

            res.render("./pages/home.html", {
                title: "",
                data: fullhtml
            });

        });

    },
    homedata: function (req, res, next) {

        client.clientSelect('home', {}, function (data) {

            res.type('application/json');   // => 'application/json'

            // res.set({
            //     'Content-Type': 'application/json; charset=utf-8'
            // });
            res.send(data);

        });

    }
};