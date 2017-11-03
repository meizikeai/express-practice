const swig = require("swig");
const mongoose = require("mongoose");
const connection = require("../../bin/connection");

let Personal = mongoose.model("Personal");

let CreateTemplate = function (where, filename, data) {
    let template = null;

    if (typeof filename != "string") {
        return false;
    } else if (typeof data != "object") {
        return false;
    }

    template = swig.compileFile("./views/blocks/" + where + "/" + filename + ".html");

    return template({ content: data });
};

module.exports = {
    home: function (req, res, next) {

        connection.clientSelect("home", {}, function (data) {
            const result = data;
            const pageinfo = result.data;

            let fullhtml = "";

            if (result.success && pageinfo) {
                if (pageinfo.templatelist && pageinfo.templatelist.length > 0) {
                    fullhtml = CreateTemplate("home", "bannerlist", pageinfo.bannerlist);
                }

                if (pageinfo.templatelist && pageinfo.templatelist.length > 0) {
                    for (let i = 0; i < pageinfo.templatelist.length; i++) {
                        let storey = pageinfo.templatelist[i];
                        fullhtml += CreateTemplate("home", storey.templatetype, storey);
                    }
                }
            } else {
                fullhtml = '<div class="user-error">服务器忙，请稍后再试！（H00001）</div>';
            }

            res.render("./pages/home.html", {
                title: "Home",
                data: fullhtml
            });

        });
    },
    userhome: function (req, res, next) {
        const express = req.session.express;

        if (typeof req.session.express !== "object") {
            res.redirect("/login");
            return false;
        }
        if (express.cid === "") {
            res.redirect("/login");
            return false;
        }

        Personal.findOne({ cid: express.cid }, function (error, data) {
            let fullhtml = "";

            if (error) {
                fullhtml = '<div class="user-error">服务器忙，请稍后再试！（H00001）</div>';
            } else {
                fullhtml += CreateTemplate("users", "main", data);

                res.render("./pages/user-home.html", {
                    title: "User Center",
                    data: fullhtml
                });
            }
        });
    },
    getHomeData: function (req, res, next) {

        connection.clientSelect("home", {}, function (data) {

            res.type("application/json");   // => "application/json"

            // res.set({
            //     "Content-Type": "application/json; charset=utf-8"
            // });
            res.send(data);

        });
    }
};