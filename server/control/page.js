const swig = require("swig");
const mongoose = require("mongoose");
// const connection = require("../../bin/connection");

let Personal = mongoose.model("Personal");
let Page = mongoose.model("Page");

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
        Page.find({}).sort({ createtime: -1 }).limit(1).exec(function (error, db) {
            let structure = "";

            if (error) {
                console.log(error);
            }

            if (db.length > 0) {
                const template = db[0].template || [];
                if (template && template.length > 0) {
                    for (let i = 0; i < template.length; i++) {
                        structure += CreateTemplate("home", template[i].templatetype, template[i]);
                    }
                } else {
                    structure = '<div class="user-error">页面数据不存在~</div>';
                }
            } else {
                structure = '<div class="user-error">服务器忙，请稍后再试！（H00001）</div>';
            }

            res.render("./pages/home.html", {
                title: "Home",
                data: structure
            });
        });
    },
    userhome: function (req, res, next) {
        const express = req.session.express;

        if (typeof req.session.express !== "object") {
            res.redirect("/login");
            return false;
        }
        if (express.kid === "") {
            res.redirect("/login");
            return false;
        }

        Personal.findOne({ kid: express.kid }, function (error, db) {
            let structure = "";

            if (error) {
                console.log(error);
            }

            if (db) {
                structure += CreateTemplate("users", "main", db);
            } else {
                structure = '<div class="user-error">服务器忙，请稍后再试！（H00001）</div>';
            }

            res.render("./pages/user-home.html", {
                title: "User Center",
                data: structure
            });
        });
    }
};