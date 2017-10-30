const swig = require("swig");
const connection = require("../../bin/connection");

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

/**
 * enCompileString
 * @param {String} string 
 */
let EnCompileString = function (string) {
    let random = (((Math.random() * 9 + 1) * 100000) + "").substring(0, 5);
    let code = string + random;
    let result = String.fromCharCode(code.charCodeAt(0) + code.length);
    for (let i = 1; i < code.length; i++) {
        result += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
    }
    return decodeURI(result);
}

/**
 * deCompileString
 * @param {String} string 
 */
let DeCompileString = function (string) {
    let code = decodeURIComponent(string);
    let result = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (let i = 1; i < code.length; i++) {
        result += String.fromCharCode(code.charCodeAt(i) - result.charCodeAt(i - 1));
    }
    return result.substring(0, result.length - 5);
}

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
                fullhtml = "<div>服务器忙，请稍后再试！（H00001）</div>";
            }

            res.render("./pages/home.html", {
                title: "Home",
                data: fullhtml
            });

        });
    },
    userhome: function (req, res, next) {
        const cookies = req.signedCookies.express;

        if (typeof cookies !== "object") {
            res.redirect("/login");
            return false;
        }
        if (cookies.userid === "") {
            res.redirect("/login");
            return false;
        }

        connection.clientSelect("users", { "userid": cookies.userid }, function (data) {
            let fullhtml = "";
            const result = data.data;

            if (typeof result === "object") {
                fullhtml += CreateTemplate("users", "main", result);
            } else {
                fullhtml = '<div class="user-error">服务器忙，请稍后再试！（H00001）</div>';
            }

            res.render("./pages/user-home.html", {
                title: "User Center",
                data: fullhtml
            });

        });
    },
    login: function (req, res, next) {
        res.render("./pages/login.html", {
            title: "Login",
            data: CreateTemplate("login", "main", {})
        });
    },
    logincheck: function (req, res, next) {
        const result = req.body;

        res.type("application/json");

        if (result.username && result.password) {
            connection.clientSelect("users", { "username": result.username }, function (data) {
                if (result.username === data.username && result.password === DeCompileString(data.password)) {
                    res.cookie("express", { "userid": data.userid, "name": data.username }, {
                        path: "/",
                        maxAge: 3600000,
                        signed: true
                    });
                    res.send({ success: true, url: "/user" });
                } else {
                    res.send({ success: false, url: "" });
                }
            });
        } else {
            res.send({ success: false, url: "" });
        }
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