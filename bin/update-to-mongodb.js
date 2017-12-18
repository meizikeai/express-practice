const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const fake = require("./fake");

const env = process.env.NODE_ENV || "dev";
const config = require("../server/config/config")[env];

mongoose.Promise = Promise;
mongoose.connect(config.db, {
    useMongoClient: true, socketTimeoutMS: 0, keepAlive: true, reconnectTries: 30
});
mongoose.connection.on("open", () => {
    console.log("mongodb connection is success!");
});
mongoose.connection.on("error", (err) => {
    console.log("mongodb connection is failure! " + err);
});
mongoose.connection.on("disconnected", () => {
    console.log("mongodb connection is disconnected!");
});

const models_path = path.join(__dirname, "../server/models");
fs.readdirSync(models_path).forEach((file) => {
    if (~file.indexOf(".js")) { require(models_path + "/" + file); }
});

const Page = mongoose.model("Page");
const Counter = mongoose.model("Counter");
const City = mongoose.model("City");
const Sale = mongoose.model("Sale");
const Activity = mongoose.model("Activity");
const Product = mongoose.model("Product");
const User = mongoose.model("User");
const Order = mongoose.model("Order");

function updateToMongodb(params) {
    this.init();
}

updateToMongodb.prototype = {
    init() {
        this.setCounterData();
        this.setPageData();
        this.setCityData();
        this.setSaleData();
        this.setActivityData();
        this.setProductData();
        this.setOrderData();
        this.closeMongoose();
    },
    setCounterData() {
        let updateCounter = new Counter({
            kid: "counter"
        });

        Counter.findOne({ kid: "counter" }, (err, db) => {
            if (err) {
                console.log(err);
            }
            if (db === null) {
                this.handleSave(updateCounter, (db) => {

                });
            }
        });
    },
    setPageData() {
        let updatePage = new Page({
            title: "Have a dream, a big dream!",
            color: "transparent",
            template: fake.pageData()
        });

        Page.findOne({}, (err, db) => {
            if (err) {
                console.log(err);
            }
            if (db === null) {
                this.handleSave(updatePage);
            } else {
                Counter.findOneAndUpdate({
                    kid: "counter"
                }, { $inc: { count: 1 } }, (err, db) => {
                    if (err) {
                        console.log(err);
                    }
                    updatePage.hid = db.count;
                    this.handleSave(updatePage, (db) => {
                        // mongoose.disconnect();
                    });
                });
            }
        });
    },
    setCityData() {
        let updateCity = new City();
        updateCity.cities = fake.citiesData();

        City.findOne({}, (err, db) => {
            if (err) {
                console.log(err);
            }
            if (db === null) {
                this.handleSave(updateCity, (err, db) => {
                    // mongoose.disconnect();
                });
            }
        });
    },
    setSaleData() {
        Sale.findOne({}, (err, db) => {
            if (err) {
                console.log(err);
            }
            if (db === null) {
                let saleFake = fake.saleData();
                saleFake.forEach((e, k) => {
                    let updateSale = new Sale(e);
                    this.handleSave(updateSale, (err, db) => { });
                });
            }
        });
    },
    setActivityData() {
        Activity.findOne({}, (err, db) => {
            if (err) {
                console.log(err);
            }
            if (db === null) {
                this.handleSave(new Activity({
                    title: "双11全球美味捕获者",
                    color: "#0d3d17",
                    template: fake.activityData()
                }), (err, db) => { });
            }
        });
    },
    setProductData() {
        Product.findOne({}, (err, db) => {
            if (err) {
                console.log(err);
            }
            if (db === null) {
                let template = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; // 假装有10个产品
                template.forEach((e, k) => {
                    this.handleSave(new Product(fake.productData()), (err, db) => { });
                });
            }
        });
    },
    setOrderData() {
        User.findOne({}, (err, db) => {
            if (err) {
                console.log(err);
            }
            if (db) {
                Order.findOne({}, (err, back) => {
                    if (back === null) {
                        let orderFake = fake.orderData();
                        orderFake.forEach((e, k) => {
                            this.handleSave(new Order({ kid: String(db.id), oid: e.oid, state: e.state, base: e.base }), (err, db) => {

                            });
                        });
                    }
                });
            }
        });
    },
    handleSave(o, fn) {
        o.save((err, db) => {
            if (err) {
                console.log(err);
            } else {
                console.log("mongodb table is insert success!");
                if (typeof fn === "function") {
                    fn(db);
                }
            }
        });
    },
    closeMongoose() {
        setTimeout(() => {
            mongoose.disconnect();
        }, 5000);
    }
};

new updateToMongodb();