const swig = require("swig");
const mongoose = require("mongoose");

const CreateTemplate = (where, filename, data, color) => {
    let template = null;

    if (typeof filename != "string") {
        return false;
    } else if (typeof data != "object") {
        return false;
    }

    template = swig.compileFile("./views/blocks/" + where + "/" + filename + ".html");

    return template({ content: data, color: color ? color : "" });
};
const error = {
    "500": '<div class="user-err">服务器忙，请稍后再试！（H00001）</div>',
    "404": '<div class="user-err">页面数据不存在~</div>'
};
const formatDate = (when) => {
    let date = when ? when : new Date();
    // let p = function (n) {
    //     if (Number(n) <= 0) {
    //         return "00";
    //     }
    //     return n < 9 ? '0' + n : '' + n;
    // };
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return { year, month, day, hour, minute, second };
}

let Page = mongoose.model("Page");
let City = mongoose.model("City");
let Sale = mongoose.model("Sale");
let Activity = mongoose.model("Activity");
let Product = mongoose.model("Product");

module.exports = {
    home(req, res) {
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
    city(req, res) {
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
    sale(req, res) {
        res.render("./pages/sale.html", {
            title: "Sale Page",
            data: ""
        });
    },
    activity(req, res) {
        const query = req.query;

        if (!query.id) {
            res.render("./pages/activity.html", {
                title: "Activity Page",
                data: error["404"]
            });
            return false;
        }

        // Activity的load方法并不根据 req.query.id 查库，因为入口Url现无人维护~
        Activity.load(req.query.id, (err, db) => {
            let structure = "";

            if (err) {
                console.log(err);
                structure = error["500"];
            }

            if (db) {
                const template = db.template || [];
                if (template && template.length > 0) {
                    for (let i = 0; i < template.length; i++) {
                        structure += CreateTemplate("activities", template[i].templatetype, template[i], db.color);
                    }
                } else {
                    structure = error["404"];
                }
            } else {
                structure = error["404"];
            }

            res.render("./pages/activity.html", {
                title: db.title + " - Activity Page",
                data: structure
            });
        });
    },
    product(req, res) {
        const result = req.query;

        if (!result.id) {
            return res.redirect("/");
        }

        Product.load(result.id, (err, db) => {
            let { structure, title } = {};

            if (err) {
                console.log(err);
            }

            if (db) {
                title = db.title;
                structure = CreateTemplate("pages", "product", db);
            }

            res.render("./pages/product.html", {
                title: title + " - Product Page",
                data: structure
            });
        });
    },
    addtocart(req, res) {
        const result = req.body;

        // 未想到怎么处理购物车
        // 临时购物车id，还是先登录~？优先判断登录，这样不用合并临时购物车id，数据丢失可能性较小~
        if (result.sku) {
            res.type("application/json");
            res.send({ success: true, code: "01", url: "/cart", description: "添加到购物车成功~" });
        } else {
            res.type("application/json");
            res.send({ success: false, code: "02", url: "", description: "添加到购物车失败~" });
        }
    },
    servertime(req, res) {
        let time = formatDate();
        res.type("application/json");
        res.send({ time: Date.UTC(time.year, time.month, time.day, time.hour, time.minute, time.second) });
    },
    getsale(req, res) {
        const result = req.query;

        res.type("application/json");
        Sale.load(result.code, (err, db) => {
            if (err) {
                res.send({ success: false, code: result.code, description: err, data: db });
            }

            res.send({ success: true, code: result.code, description: "获取成功~", data: db });
        });
    }
};