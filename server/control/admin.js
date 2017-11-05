const swig = require("swig");
const mongoose = require("mongoose");
const env = process.env.NODE_ENV || "dev";
const config = require("../config/config")[env];

let User = mongoose.model("User");
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
    login: function (req, res, next) {
        res.render("./pages/login.html", {
            title: "Login",
            data: CreateTemplate("login", "main", {})
        });
    },
    register: function (req, res, next) {
        res.render("./pages/register.html", {
            title: "Register",
            data: CreateTemplate("register", "main", {})
        });
    },
    checklogin: function (req, res, next) {
        const result = req.body;
        const state = { //结合code查看
            "01": "帐号或密码长度不符合要求~",
            "02": "数据库查询失败~",
            "03": "帐号或密码错误~",
            "04": "帐号或密码缺失~",
            "05": "登录成功~"
        }

        const failure = (code, text) => {
            res.type("application/json");
            res.send({ success: false, code: code, url: "", description: text ? text : "" });
        };

        if (result.username && result.password) {

            if (result.username.lenght < 4 || result.password.lenght < 6) {
                return failure("01", state["01"]);
            }

            User.findOne({ loginname: result.username }, function (error, db) {
                if (error) {
                    return failure("02", state["02"] + error);
                }

                if (!db) {
                    return failure("02", state["02"]);
                }

                if (db.authenticate(result.password)) {
                    req.session.express = {
                        kid: db._id,
                        name: db.loginname
                    };

                    res.cookie("practice", JSON.stringify({ kid: db._id, name: db.loginname }), {
                        maxAge: config.maxAge,
                        signed: false
                    });

                    res.type("application/json");
                    res.send({ success: true, code: "05", url: "/user", description: state["05"] });
                } else {
                    failure("04", state["04"]);
                }
            });
        } else {
            failure("03", state["03"]);
        }
    },
    checklogout: function (req, res, next) {
        const result = req.body;

        // sessionStore、sessionID
        req.sessionStore.destroy(req.sessionID, function (error, db) {
            if (error) {
                return res.send({ success: false, code: "01", url: "", description: "sessionID有误~" });
            }

            if (req.session.express) {
                res.clearCookie("express", JSON.stringify(req.session.express), {
                    maxAge: config.maxAge,
                    signed: true
                });
            }
            if (req.cookies.practice) {
                res.clearCookie("practice", JSON.stringify(req.cookies.practice), {
                    maxAge: config.maxAge,
                    signed: false
                });
            }

            res.type("application/json");
            res.send({ success: true, code: "02", url: "", description: "退出登录成功~" });
        });
    },
    checkregister: function (req, res, next) {
        const result = req.body;

        const state = { //结合code查看
            "01": "账号已存在，请更换后再试",
            "02": "数据库查询失败~",
            "03": "数据库更新失败~~",
            "04": "帐号或密码缺失~",
            "05": "登录成功~"
        }

        const failure = (code, text) => {
            res.send({ success: false, code: code, url: "", description: text ? text : "" });
        };

        res.type("application/json");

        if (result.username && result.password) {
            let updataPersonal = new Personal();
            let updataUser = new User({
                loginname: result.username, password: ""
            });

            updataUser.pin = result.password;

            updataUser.save(function (error, data) {
                if (error) {
                    if (error.code == '11000') {
                        return failure("01", state["01"]);
                    } else {
                        return failure("02", state["02"] + error);
                    }
                } else {
                    // 这些数据因没有后台先这样插入
                    updataPersonal.entry = [
                        {
                            "name": "优惠券",
                            "img": "/picture/entry-cart.png",
                            "url": "/user/coupon",
                            "text": "1张"
                        },
                        {
                            "name": "余额",
                            "img": "/picture/entry-search.png",
                            "url": "/user/balance",
                            "text": "200.00"
                        },
                        {
                            "name": "手机号",
                            "img": "/picture/entry-bao.png",
                            "url": "/user/phone",
                            "text": "18600580258"
                        },
                        {
                            "name": "收货地址",
                            "img": "/picture/entry-wang.png",
                            "url": "/user/address",
                            "text": "3个"
                        }
                    ];

                    updataPersonal.other = [
                        {
                            "name": "帮助中心",
                            "img": "/picture/entry-ticket.png",
                            "url": "/help",
                            "text": ""
                        },
                        {
                            "name": "联系我们",
                            "img": "/picture/entry-air.png",
                            "url": "/help",
                            "text": "400 7758 0258"
                        }
                    ];

                    updataPersonal.userid = updataUser._id;

                    updataPersonal.save((err, doc) => {
                        if (err) {
                            return failure("03", state["03"]);
                        }

                        req.session.express = {
                            kid: updataUser._id,
                            name: updataUser.loginname
                        };

                        res.cookie("practice", JSON.stringify({ kid: updataUser._id, name: updataUser.loginname }), {
                            maxAge: config.maxAge,
                            signed: false
                        });

                        res.send({ success: true, code: "05", url: "/user", description: state["05"] });
                    });
                }
            });
        } else {
            failure("04", state["04"]);
        }
    }
};