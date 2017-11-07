const fs = require('fs');
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
mongoose.connection.on("error", (error) => {
    console.log("mongodb connection is failure! " + error);
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

function updateToMongodb(params) {
    this.init();
}

updateToMongodb.prototype = {
    init() {
        this.setCounterData();
        this.setPageData();
        this.setCityData();
        this.setSaleData();
        this.closeMongoose();
    },
    setCounterData() {
        let updateCounter = new Counter({
            kid: "counter"
        });

        Counter.findOne({ kid: "counter" }, (error, db) => {
            if (error) {
                console.log(error);
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

        Page.findOne({}, (error, db) => {
            if (error) {
                console.log(error);
            }
            if (db === null) {
                this.handleSave(updatePage);
            } else {
                Counter.findOneAndUpdate({
                    kid: "counter"
                }, { $inc: { count: 1 } }, (error, db) => {
                    if (error) {
                        console.log(error);
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

        updateCity.cities = [
            { "name": "北京", code: "001" }, { "name": "成都", code: "002" },
            { "name": "重庆", code: "003" }, { "name": "广州", code: "004" },
            { "name": "杭州", code: "005" }, { "name": "南京", code: "006" },
            { "name": "上海", code: "007" }, { "name": "深圳", code: "008" },
            { "name": "苏州", code: "009" }, { "name": "天津", code: "010" },
            { "name": "武汉", code: "011" }, { "name": "西安", code: "012" }
        ];

        City.findOne({}, (error, db) => {
            if (error) {
                console.log(error);
            }
            if (db === null) {
                this.handleSave(updateCity, (db) => {
                    // mongoose.disconnect();
                });
            }
        });
    },
    setSaleData() {
        Sale.findOne({}, (error, db) => {
            if (error) {
                console.log(error);
            }
            if (db === null) {
                let saleFake = fake.saleData();
                saleFake.forEach((e, k) => {
                    let updateSale = new Sale(e);
                    this.handleSave(updateSale, (db) => { });
                });
            }
        });
    },
    handleSave(o, fn) {
        o.save((error, db) => {
            if (error) {
                console.log(error);
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