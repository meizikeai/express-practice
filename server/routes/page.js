const page = require("../control/page");
const admin = require("../control/admin");

module.exports = function (app) {
    app.get("/", page.home);
    app.get("/city", page.city);
    app.get("/sale", page.sale);
    app.get("/servertime", page.servertime);
    app.get("/activity", page.activity);
    app.get("/product", page.product);

    app.get("/user", admin.home);
    app.get("/login", admin.login);
    app.get("/register", admin.register);
    app.get("/forget", admin.forget);
    app.get("/password", admin.password);
    app.get("/user/order", admin.order);

    app.get("/getorder", admin.getorder);

    app.get("/getsale", page.getsale);

    app.post("/addtocart", page.addtocart);

    app.post("/checklogin", admin.checklogin);
    app.post("/checklogout", admin.checklogout);
    app.post("/checkregister", admin.checkregister);
    app.post("/checkforget", admin.checkforget);
    app.post("/checkpassword", admin.checkpassword);
};