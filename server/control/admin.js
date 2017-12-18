const swig = require("swig");
const mongoose = require("mongoose");
const env = process.env.NODE_ENV || "dev";
const config = require("../config/config")[env];

const CreateTemplate = (where, filename, data) => {
    let template = null;

    if (typeof filename != "string") {
        return false;
    } else if (typeof data != "object") {
        return false;
    }

    template = swig.compileFile("./views/blocks/" + where + "/" + filename + ".html");

    return template({ content: data });
}
const error = {
    "500": '<div class="user-err">服务器忙，请稍后再试！（H00001）</div>',
    "404": '<div class="user-err">页面数据不存在~</div>'
}
const callback = (res, code, text = "", url = "", bool = false) => {
    res.type("application/json");
    res.send({
        success: bool,
        code: code,
        url: url,
        description: text
    });
}

const goToLogin = (req, res) => {
    const express = req.session.express;

    if (typeof req.session.express !== "object") {
        res.redirect("/login?returnURL=" + encodeURIComponent(req.url));
        return true;
    }
    if (express.kid === "") {
        res.redirect("/login?returnURL=" + encodeURIComponent(req.url));
        return true;
    }
}

let User = mongoose.model("User");
let Personal = mongoose.model("Personal");
let Order = mongoose.model("Order");

module.exports = {
    login(req, res) {
        res.render("./pages/login.html", {
            title: "Login Page",
            data: CreateTemplate("users", "login", {})
        });
    },
    register(req, res) {
        res.render("./pages/register.html", {
            title: "Register Page",
            data: CreateTemplate("users", "register", {})
        });
    },
    forget(req, res) {
        res.render("./pages/forget.html", {
            title: "Forget Page",
            data: CreateTemplate("users", "forget", {})
        });
    },
    password(req, res) {
        const cookies = req.signedCookies;
        let picture = null;

        if (cookies && cookies.practice) {
            picture = JSON.parse(cookies.practice);
        }

        if (picture && picture.kid) {
            res.render("./pages/password.html", {
                title: "Password change Page",
                data: CreateTemplate("users", "password", {})
            });
        } else {
            res.redirect("/forget");
        }
    },
    home(req, res) {
        if (goToLogin(req, res)) {
            return false;
        }
        const express = req.session.express;

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
    order(req, res) {
        if (goToLogin(req, res)) {
            return false;
        }

        res.render("./pages/user-order.html", {
            title: "User Order Page",
            data: CreateTemplate("users", "order", {})
        });
    },
    getorder(req, res) {
        const result = req.query;
        const express = req.session.express;

        let find = {};

        if (typeof req.session.express !== "object") {
            return callback(res, "01", "未登录，请登录后再查询~", "/login?returnURL=/user/order");
        }
        if (express.kid === "") {
            return callback(res, "01", "未登录，请登录后再查询~", "/login?returnURL=/user/order");
        }

        if (result.type == "all") {
            find = { kid: express.kid };
        } else {
            find = { kid: express.kid, state: result.type };
        }

        Order.load({ find: find }, (err, db) => {
            if (err) {
                console.log(err);
            }
            if (db) {
                res.type("application/json");
                res.send({ success: true, code: "02", data: db, url: "", description: "" });
            } else {
                callback(res, "03", "您还没有相关的订单", "");
            }
        });
    },
    checklogin(req, res) {
        const result = req.body;
        const state = { //结合code查看
            "01": "帐号或密码长度不符合要求~",
            "02": "帐号或密码错误~", //数据库查询失败~
            "03": "帐号或密码错误~",
            "04": "帐号或密码缺失~",
            "05": "登录成功~",
            "06": "帐号已禁用~",
            "07": "尝试次数过多，上验证码~"
        }

        if (result.username && result.password) {

            if (result.username.length < 4 || result.password.length < 6) {
                return callback(res, "01", state["01"]);
            }

            User.load({ loginname: result.username }, (error, db) => {
                if (error) {
                    return callback(res, "02", state["02"] + error);
                }

                if (!db) {
                    return callback(res, "02", state["02"]);
                }

                if (db.status > 0) {
                    callback(res, "06", state["06"]);
                }

                if (db.query > 3) {
                    callback(res, "07", state["07"]);
                }

                if (db.authenticate(result.password)) {
                    req.session.express = {
                        kid: db.id,
                        name: db.loginname
                    };

                    res.cookie("practice", JSON.stringify({ kid: db.id, name: db.loginname }), {
                        maxAge: config.maxAge,
                        signed: false
                    });

                    callback(res, "05", state["05"], "/user", true);
                } else {
                    callback(res, "04", state["04"]);
                }
            });
        } else {
            callback(res, "03", state["03"]);
        }
    },
    checklogout(req, res) {
        const result = req.body;

        // sessionStore、sessionID
        req.sessionStore.destroy(req.sessionID, (error, db) => {
            if (error) {
                return callback(res, "01", "sessionID有误，退出登录失败~");
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

            callback(res, "02", "退出登录成功~", "", true);
        });
    },
    checkregister(req, res) {
        const result = req.body;

        const state = { //结合code查看
            "01": "账号已存在，请更换后再试",
            "02": "数据库查询失败~",
            "03": "数据库更新失败~~",
            "04": "帐号或密码缺失~",
            "05": "登录成功~"
        }

        if (result.username && result.password) {
            let updataPersonal = new Personal();
            let updataUser = new User({
                loginname: result.username, password: ""
            });

            updataUser.pin = result.password;
            updataUser.save((error, data) => {
                if (error) {
                    if (error.code == '11000') {
                        return callback(res, "01", state["01"]);
                    } else {
                        return callback(res, "02", state["02"] + error);
                    }
                } else {
                    // 这些数据因没有后台先这样插入
                    updataPersonal.entry = [
                        {
                            "name": "优惠券",
                            "img": "/picture/entry-01.png",
                            "url": "/user/coupon",
                            "text": "1张"
                        },
                        {
                            "name": "余额",
                            "img": "/picture/entry-02.png",
                            "url": "/user/balance",
                            "text": "200.00"
                        },
                        {
                            "name": "手机号",
                            "img": "/picture/entry-03.png",
                            "url": "/user/phone",
                            "text": "18600580258"
                        },
                        {
                            "name": "收货地址",
                            "img": "/picture/entry-04.png",
                            "url": "/user/address",
                            "text": "3个"
                        }
                    ];
                    updataPersonal.other = [
                        {
                            "name": "帮助中心",
                            "img": "/picture/entry-05.png",
                            "url": "/help",
                            "text": ""
                        },
                        {
                            "name": "联系我们",
                            "img": "/picture/entry-06.png",
                            "url": "/help",
                            "text": "400 7758 0258"
                        }
                    ];

                    updataPersonal.uid = updataUser.id;
                    updataPersonal.save((err, doc) => {
                        if (err) {
                            return callback(res, "03", state["03"]);
                        }

                        req.session.express = {
                            kid: updataUser.id,
                            name: updataUser.loginname
                        };

                        res.cookie("practice", JSON.stringify({ kid: updataUser.id, name: updataUser.loginname }), {
                            maxAge: config.maxAge,
                            signed: false
                        });

                        callback(res, "05", state["05"], "/user", true);
                    });
                }
            });
        } else {
            callback(res, "04", state["04"]);
        }
    },
    checkforget(req, res) {
        const result = req.body;

        const state = { //结合code查看
            "01": "帐号长度不符合要求~",
            "02": "查询失败~", //数据库查询失败~
            "03": "查询成功，您的手机号将会收到短信验证码，请在跳转后修改密码~",
            "04": "尝试次数过多，上验证码~"
        }

        if (result.username) {
            if (result.username.length < 4) {
                return callback(res, "01", state["01"]);
            }

            User.load({ loginname: result.username }, (error, db) => {
                if (error) {
                    return callback(res, "02", state["02"] + error);
                }

                if (!db) {
                    return callback(res, "02", state["02"]);
                }

                if (db.query > 3) {
                    if (db.query === 4) { //执行重置
                        User.resetQuery(db.id);
                    }
                    return callback(res, "04", state["04"], "/forget");
                }

                User.updateQuery(db.id, (err, db) => {
                    res.cookie("practice", JSON.stringify({ kid: db.id, name: db.loginname }), {
                        maxAge: config.maxAge,
                        signed: true
                    });

                    callback(res, "03", state["03"], "/password", true);
                });
            });
        }
    },
    checkpassword(req, res) {
        const result = req.body;
        const cookies = req.signedCookies;
        const state = { //结合code查看
            "01": "不知道用户从那个渠道过来的~",
            "02": "缺少验证码或新密码~",
            "03": "验证码长度不正确~",
            "04": "密码长度不符合要求~",
            "05": "输入的新密码不一致~",
            "06": "查询库失败~",
            "07": "没有查询到信息~",
            "08": "输入的验证码不正确~",
            "09": "密码更新失败~",
            "10": "修改密码成功，去登录~"
        }

        let practice = null;
        if (cookies && cookies.practice) {
            practice = JSON.parse(cookies.practice);
        }

        if (practice && practice.kid) {
            if (!result.verify && !result.password && !result.checkpassword) {
                return callback(res, "02", state["02"]);
            }

            if (result.verify.length !== 4) {
                return callback(res, "03", state["03"]);
            }

            if (result.password.length < 6 || result.checkpassword.length < 6) {
                return callback(res, "04", state["04"]);
            }

            if (result.password !== result.checkpassword) {
                return callback(res, "05", state["05"]);
            }

            User.load({ _id: practice.kid }, (error, db) => {
                if (error) {
                    return callback(res, "06", state["06"] + error);
                }

                if (!db) {
                    return callback(res, "07", state["07"]);
                }

                if (result.verify !== db.verify) {
                    return callback(res, "08", state["08"]);
                }

                // if (!db.authenticate(result.password)) {
                //     return callback("10", state["10"]);
                // }

                db.pin = result.password;
                db.save(function (err) {
                    if (err) {
                        return callback(res, "09", state["09"]);
                    }

                    res.clearCookie("practice", JSON.stringify(practice), {
                        maxAge: config.maxAge,
                        signed: false
                    });

                    callback(res, "10", state["10"], "/login", true);
                });
            });
        } else {
            callback(res, "01", state["01"], "/forget");
        }
    }
}