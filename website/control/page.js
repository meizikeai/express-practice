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
                title: "My Page",
                data: fullhtml
            });

        });

    },
    userhome: function (req, res, next) {
        var cookies = req.cookies;

        if (!cookies.name) {
            res.redirect("/login");
            return false;
        }

        connection.clientSelect("users", {}, function (data) {
            const result = data;
            const pageinfo = result.data;

            let fullhtml = "";

            if (result.success && pageinfo) {
                fullhtml += CreateTemplate("userhome", "main", pageinfo);
            } else {
                fullhtml = '<div class="user-error">服务器忙，请稍后再试！（H00001）</div>';
            }

            res.render("./pages/userhome.html", {
                title: "用户中心",
                data: fullhtml
            });

        });
    },
    login: function (req, res, next) {
        res.render("./pages/login.html", {
            title: "帐户登录",
            data: CreateTemplate("login", "main", {})
        });
    },
    logincheck: function (req, res, next) {
        const result = req.body;
        // const cookies = req.cookies;
        res.type("application/json");

        if (result.username && result.password) {
            connection.clientSelect("users", { "username": result.username }, function (data) {
                if (result.username === data.username && result.password === DeCompileString(data.password)) {
                    res.send({ success: true });
                } else {
                    res.send({ success: false });
                }
            });
        } else {
            res.send({ success: false });
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

    },
    getUserHomeData: function (req, res, next) {
        connection.clientSelect("users", {}, function (data) {

            res.type("application/json");   // => "application/json"

            // res.set({
            //     "Content-Type": "application/json; charset=utf-8"
            // });
            res.send(data);

        });
    }
};