const page = require("../control/page");
const admin = require("../control/admin");

module.exports = function (app) {
    app.get("/", page.home);
    app.get("/user", page.userhome);
    app.get("/city", page.city);
    app.get("/sale", page.sale);
    app.get("/getsale", page.getsale);

    app.get("/login", admin.login);
    app.get("/register", admin.register);

    app.post("/checklogin", admin.checklogin);
    app.post("/checklogout", admin.checklogout);
    app.post("/checkregister", admin.checkregister);

    app.get("/servertime", page.servertime);
};