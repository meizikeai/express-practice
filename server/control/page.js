const swig = require("swig");
const mongoose = require("mongoose");

const CreateTemplate = (where, filename, data) => {
    let template = null;

    if (typeof filename != "string") {
        return false;
    } else if (typeof data != "object") {
        return false;
    }

    template = swig.compileFile("./views/blocks/" + where + "/" + filename + ".html");

    return template({ content: data });
};
const error = {
    "500": '<div class="user-err">服务器忙，请稍后再试！（H00001）</div>',
    "404": '<div class="user-err">页面数据不存在~</div>'
};

let Personal = mongoose.model("Personal");
let Page = mongoose.model("Page");
let City = mongoose.model("City");

module.exports = {
    home(req, res, next) {
        Page.load((err, db) => {
            let structure = "";

            if (err) {
                console.log(err);
                structure = error["500"];
            }

            if (db.length > 0) {
                const template = db[0].template || [];
                if (template && template.length > 0) {
                    for (let i = 0; i < template.length; i++) {
                        structure += CreateTemplate("home", template[i].templatetype, template[i]);
                    }
                } else {
                    structure = error["404"];
                }
            } else {
                structure = error["404"];
            }

            res.render("./pages/home.html", {
                title: "Home Page",
                data: structure
            });
        });
    },
    userhome(req, res, next) {
        const express = req.session.express;

        if (typeof req.session.express !== "object") {
            res.redirect("/login");
            return false;
        }
        if (express.kid === "") {
            res.redirect("/login");
            return false;
        }

        Personal.load(express.kid, (err, db) => {
            let structure = "";

            if (err) {
                console.log(err);
                structure = error["500"];
            }

            if (db) {
                structure += CreateTemplate("users", "main", db);
            } else {
                structure = error["404"];
            }

            res.render("./pages/user-home.html", {
                title: "User Center Page",
                data: structure
            });
        });
    },
    city(req, res, next) {
        City.load((err, db) => {
            let structure = "";

            if (err) {
                console.log(err);
                structure = error["500"];
            }
            if (db.length > 0) {
                structure = CreateTemplate("users", "city", db[0]);
            } else {
                structure = error["404"];
            }

            res.render("./pages/city.html", {
                title: "City Page",
                data: structure
            });
        });
    },
    sale(req, res, next) {
        res.render("./pages/sale.html", {
            title: "Sale Page",
            data: ""
        });
    }
};