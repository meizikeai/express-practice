const swig = require("swig");
const mongoose = require("mongoose");

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

        res.type("application/json");

        if (result.username && result.password) {
            User.findOne({ loginname: result.username }, function (error, data) {
                if (error) {
                    res.send({ success: false, url: "", description: error });
                } else {
                    if (data.authenticate(result.password)) {

                        req.session.express = {
                            cid: data._id,
                            name: data.loginname
                        };

                        res.cookie("practice", { cid: data._id, name: data.loginname }, {
                            path: "/",
                            maxAge: 3600000,
                            signed: false
                        });

                        res.send({ success: true, url: "/user", description: "" });
                    } else {
                        res.send({ success: false, url: "", description: "" });
                    }
                }
            });
        } else {
            res.send({ success: false, url: "" });
        }
    },
    checklogout: function (req, res, next) {
        const result = req.body;
        const cookies = req.signedCookies;
        const express = cookies && cookies.express;

        res.type("application/json");
        if (express) {
            res.clearCookie("express", { "userid": express.userid, "name": express.name }, {
                path: "/",
                maxAge: 3600000,
                signed: true
            });
            res.send({ success: true, url: "" });
        } else {
            res.send({ success: false, url: "" });
        }
    },
    checkregister: function (req, res, next) {
        const result = req.body;
        const failure = (text) => {
            res.send({ success: false, url: "", description: text ? text : "" });
        };
        const success = () => {
            res.send({ success: true, url: "/user", description: "" });
        };

        res.type("application/json");

        if (result.username && result.password) {
            let updataPersonal = new Personal();
            let updataUser = new User({
                loginname: result.username,
                password: ""
            });

            updataUser.pin = result.password;

            updataUser.save(function (err, doc) {
                if (err) {
                    if (err.code == '11000') {
                        return failure("用户名已存在，请更换后再试");
                    } else {
                        return failure(err);
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
                            return failure(err);
                        }

                        res.cookie("express", { "userid": updataUser._id, "name": updataUser.loginname }, {
                            path: "/",
                            maxAge: 3600000,
                            signed: true
                        });

                        success();
                    });
                }
            });
        } else {
            failure("缺少用户名或密码，请重新再试~");
        }
    }
};