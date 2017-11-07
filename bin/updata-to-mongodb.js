const fs = require('fs');
const path = require("path");
const mongoose = require("mongoose");

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

function updateToMongodb(params) {
    this.init();
}

updateToMongodb.prototype = {
    init() {
        this.setCounterDate();
        this.setPageDate();
        this.setCityDate();
        this.closeMongoose();
    },
    setCounterDate() {
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
    setPageDate() {
        let updatePage = new Page({
            title: "Have a dream, a big dream!",
            color: "transparent",
            template: getPageData()
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
    setCityDate() {
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

// 假数据-因没有后台先这样插入
function getPageData() {
    return [
        {
            "templateid": 20022618,
            "templatename": "推广图",
            "templatetype": "oneImage",
            "templatecolor": "#f72653 url() 0 0 no-repeat",
            "requestdate": "1504688073945",
            "sort": 1,
            "items": [
                {
                    "id": "21034936",
                    "imgname": "双十一",
                    "imgurl": "/picture/page-01.jpg",
                    "jumpurl": "",
                    "sort": 1
                }
            ]
        },
        {
            "templateid": 20015346,
            "templatename": "Banner轮播区",
            "templatetype": "carouselFigure",
            "templatecolor": "#f72653",
            "requestdate": "1504688073945",
            "sort": 2,
            "items": [
                {
                    "id": 11012804,
                    "imgname": "男装",
                    "imgurl": "/picture/banner-01-1.jpg",
                    "jumpurl": "/activities?pageid=30002232",
                    "sort": 1
                },
                {
                    "id": 11012800,
                    "imgname": "名品",
                    "imgurl": "/picture/banner-01-2.jpg",
                    "jumpurl": "/activities?pageid=30002232",
                    "sort": 2
                },
                {
                    "id": 11012801,
                    "imgname": "女装",
                    "imgurl": "/picture/banner-01-1.jpg",
                    "jumpurl": "/activities?pageid=30002232",
                    "sort": 3
                },
                {
                    "id": 11012801,
                    "imgname": "女装",
                    "imgurl": "/picture/banner-01-2.jpg",
                    "jumpurl": "/activities?pageid=30002232",
                    "sort": 3
                }
            ]
        },
        {
            "templateid": 20015347,
            "templatename": "功能5图",
            "templatetype": "fiveCategory",
            "templatecolor": "#f72653",
            "templatefont": "#ffffff",
            "requestdate": "1504688073945",
            "sort": 3,
            "items": [
                {
                    "itemid": "21023303",
                    "imgname": "商场同款",
                    "imgurl": "/picture/ico-1.png",
                    "itemposition": "30000000|0|20015347|1|21023303",
                    "jumpurl": "/productlist?condition=10000655&title=做爱做的事",
                    "sort": 1
                },
                {
                    "itemid": "21023304",
                    "imgname": "奢品",
                    "imgurl": "/picture/ico-1.png",
                    "itemposition": "30000000|0|20015347|2|21023304",
                    "jumpurl": "/productlist?condition=10000655&title=做爱做的事",
                    "sort": 2
                },
                {
                    "itemid": "21023305",
                    "imgname": "断码名品",
                    "imgurl": "/picture/ico-1.png",
                    "itemposition": "30000000|0|20015347|3|21023305",
                    "jumpurl": "/productlist?condition=10000655&title=做爱做的事",
                    "sort": 3
                },
                {
                    "itemid": "21023306",
                    "imgname": "会员专区",
                    "imgurl": "/picture/ico-1.png",
                    "itemposition": "30000000|0|20015347|4|21023306",
                    "jumpurl": "/productlist?condition=10000655&title=做爱做的事",
                    "sort": 4
                },
                {
                    "itemid": "21023307",
                    "imgname": "惠生活",
                    "imgurl": "/picture/ico-1.png",
                    "itemposition": "30000000|0|20015347|5|21023307",
                    "jumpurl": "/productlist?condition=10000655&title=做爱做的事",
                    "sort": 5
                }
            ]
        },
        {
            "templateid": 20022619,
            "templatename": "双十一专属会场",
            "templatetype": "oneImage",
            "templatecolor": "#f72653",
            "requestdate": "1504688073945",
            "sort": 4,
            "items": [
                {
                    "id": "21034936",
                    "imgname": "内衣",
                    "imgurl": "/picture/title-01.png",
                    "jumpurl": "",
                    "sort": 1
                }
            ]
        },
        {
            "templateid": 20022522,
            "templatename": "热推产品",
            "templatetype": "hotBrand",
            "templatecolor": "#f72653",
            "requestdate": "1504688073945",
            "sort": 5,
            "items": [
                {
                    "url": "/activities?pageid=30002232",
                    "img": "/picture/product-01.jpg",
                    "modify": "/picture/modify-01.png",
                    "price": 799.00,
                    "title": "甄选男装",
                    "sales": "400减50",
                    "sort": 1
                },
                {
                    "url": "/activities?pageid=30002232",
                    "img": "/picture/product-02.jpg",
                    "modify": "/picture/modify-02.png",
                    "price": 899.00,
                    "title": "品质大牌",
                    "sales": "不只5折",
                    "sort": 2
                },
                {
                    "url": "/activities?pageid=30002232",
                    "img": "/picture/product-01.jpg",
                    "modify": "/picture/modify-03.png",
                    "price": 499.00,
                    "title": "女鞋会场",
                    "sales": "提前锁好货",
                    "sort": 3
                },
                {
                    "url": "/activities?pageid=30002232",
                    "img": "/picture/product-02.jpg",
                    "modify": "/picture/modify-03.png",
                    "price": 799.00,
                    "title": "精选女装",
                    "sales": "好货5折起",
                    "sort": 4
                }
            ]
        },
        {
            "templateid": 20022522,
            "templatename": "热推产品",
            "templatetype": "hotBrand",
            "templatecolor": "#f72653",
            "requestdate": "1504688073945",
            "sort": 5,
            "items": [
                {
                    "url": "/activities?pageid=30002232",
                    "img": "/picture/product-01.jpg",
                    "modify": "/picture/modify-04.png",
                    "price": 899.00,
                    "title": "大牌男装",
                    "sales": "5折不过瘾",
                    "sort": 5
                },
                {
                    "url": "/activities?pageid=30002232",
                    "img": "/picture/product-02.jpg",
                    "modify": "/picture/modify-02.png",
                    "price": 499.00,
                    "title": "玩具会场",
                    "sales": "买就送好礼",
                    "sort": 6
                },
                {
                    "url": "/activities?pageid=30002232",
                    "img": "/picture/product-01.jpg",
                    "modify": "/picture/modify-03.png",
                    "price": 899.00,
                    "title": "大牌男装",
                    "sales": "5折不过瘾",
                    "sort": 5
                },
                {
                    "url": "/activities?pageid=30002232",
                    "img": "/picture/product-02.jpg",
                    "modify": "/picture/modify-01.png",
                    "price": 499.00,
                    "title": "玩具会场",
                    "sales": "买就送好礼",
                    "sort": 6
                }
            ]
        },
        {
            "templateid": 20022619,
            "templatename": "双十一天猫直营",
            "templatetype": "oneImage",
            "templatecolor": "#f72653",
            "requestdate": "1504688073945",
            "sort": 6,
            "items": [
                {
                    "id": "21034936",
                    "imgname": "内衣",
                    "imgurl": "/picture/title-02.png",
                    "jumpurl": "",
                    "sort": 1
                }
            ]
        },
        {
            "templateid": 20022522,
            "templatename": "品牌推荐",
            "templatetype": "hotContainer",
            "templatecolor": "#f72653",
            "requestdate": "1504688073945",
            "sort": 7,
            "items": [
                {
                    "title": "天猫超市·北京",
                    "sales": "唔折天 抢千万优惠券",
                    "img": "./picture/page-02.jpg",
                    "url": "/activities?pageid=30002232",
                    "sort": 1
                },
                {
                    "title": "天猫进口直营",
                    "sales": "全球尖货直降",
                    "img": "/picture/page-03.jpg",
                    "url": "/activities?pageid=30002232",
                    "sort": 2
                },
                {
                    "title": "",
                    "sales": "",
                    "img": "/picture/product-01.jpg",
                    "url": "/activities?pageid=30002232",
                    "sort": 3
                },
                {
                    "title": "天猫生鲜",
                    "sales": "领券159减50",
                    "img": "/picture/product-01.jpg",
                    "url": "/activities?pageid=30002232",
                    "sort": 4
                },
                {
                    "title": "魅力惠",
                    "sales": "每400减50",
                    "img": "/picture/product-01.jpg",
                    "url": "/activities?pageid=30002232",
                    "sort": 5
                }
            ]
        },
        {
            "templateid": 20022522,
            "templatename": "热推产品",
            "templatetype": "fourContainer",
            "templatecolor": "#f72653",
            "requestdate": "1504688073945",
            "sort": 8,
            "items": [
                {
                    "title": "全球尖货直降",
                    "sales": "整点抢5折神券",
                    "img": "/picture/product-01.jpg",
                    "url": "/activities?pageid=30002232",
                    "sort": 1
                },
                {
                    "title": "",
                    "sales": "",
                    "img": "/picture/product-02.jpg",
                    "url": "/activities?pageid=30002232",
                    "sort": 2
                },
                {
                    "title": "超市提前嗨",
                    "sales": "疯抢50元券",
                    "img": "/picture/product-01.jpg",
                    "url": "/activities?pageid=30002232",
                    "sort": 3
                },
                {
                    "title": "奢品精选",
                    "sales": "满400减50",
                    "img": "/picture/product-02.jpg",
                    "url": "/activities?pageid=30002232",
                    "sort": 4
                }
            ]
        },
        {
            "templateid": 20022619,
            "templatename": "双十一品牌活动",
            "templatetype": "oneImage",
            "templatecolor": "#f72653",
            "requestdate": "1504688073945",
            "sort": 9,
            "items": [
                {
                    "id": "21034936",
                    "imgname": "内衣",
                    "imgurl": "/picture/title-03.png",
                    "jumpurl": "",
                    "sort": 1
                }
            ]
        },
        {
            "templateid": 20022617,
            "templatename": "小活动",
            "templatetype": "twoImage",
            "templatecolor": "#f72653",
            "requestdate": "1504688073945",
            "sort": 10,
            "items": [
                {
                    "id": "21034934",
                    "height": 206,
                    "width": 319,
                    "imgname": "运动",
                    "imgurl": "/picture/brand-01.png",
                    "jumpurl": "/productList?condition=10000655&title=做爱做的事",
                    "sort": 1
                },
                {
                    "id": "21034935",
                    "height": 206,
                    "width": 319,
                    "imgname": "女装",
                    "imgurl": "/picture/brand-02.png",
                    "jumpurl": "/productList?condition=10000655&title=做爱做的事",
                    "sort": 2
                }
            ]
        },
        {
            "templateid": 20022522,
            "templatename": "热推产品",
            "templatetype": "fourBrand",
            "templatecolor": "#f72653",
            "requestdate": "1504688073945",
            "sort": 5,
            "items": [
                {
                    "url": "/shop?id=30002232",
                    "img": "/picture/product-01.jpg",
                    "logo": "/picture/logo-01.jpg",
                    "sales": "满598减50",
                    "sort": 1
                },
                {
                    "url": "/shop?id=30002232",
                    "img": "/picture/product-01.jpg",
                    "logo": "/picture/logo-01.jpg",
                    "sales": "满499减20",
                    "sort": 2
                },
                {
                    "url": "/shop?id=30002232",
                    "img": "/picture/product-01.jpg",
                    "logo": "/picture/logo-01.jpg",
                    "sales": "满2000减100",
                    "sort": 3
                },
                {
                    "url": "/shop?id=30002232",
                    "img": "/picture/product-01.jpg",
                    "logo": "/picture/logo-01.jpg",
                    "sales": "满598减50",
                    "sort": 4
                }
            ]
        },
        {
            "templateid": 20022619,
            "templatename": "双十一特卖牌活动",
            "templatetype": "oneImage",
            "templatecolor": "#f72653",
            "requestdate": "1504688073945",
            "sort": 9,
            "items": [
                {
                    "id": "21034936",
                    "imgname": "内衣",
                    "imgurl": "/picture/title-05.png",
                    "jumpurl": "",
                    "sort": 1
                }
            ]
        },
        {
            "templateid": 20022522,
            "templatename": "热推产品",
            "templatetype": "hotProduct",
            "templatecolor": "#f72653",
            "requestdate": "1504688073945",
            "sort": 5,
            "items": [
                {
                    "sku": "20-188-0046",
                    "title": "甄选男装",
                    "img": "/picture/product-01.jpg",
                    "price": 799.00,
                    "sales": "400减50",
                    "sort": 1
                },
                {
                    "sku": "20-188-0047",
                    "title": "品质大牌",
                    "img": "/picture/product-02.jpg",
                    "price": 899.00,
                    "sales": "不只5折",
                    "sort": 2
                },
                {
                    "sku": "20-188-0048",
                    "title": "女鞋会场",
                    "img": "/picture/product-01.jpg",
                    "price": 499.00,
                    "sales": "提前锁好货",
                    "sort": 3
                },
                {
                    "sku": "20-188-0046",
                    "title": "精选女装",
                    "img": "/picture/product-02.jpg",
                    "price": 799.00,
                    "sales": "好货5折起",
                    "sort": 4
                },
                {
                    "sku": "20-188-0047",
                    "title": "大牌男装",
                    "img": "/picture/product-01.jpg",
                    "price": 899.00,
                    "sales": "5折不过瘾",
                    "sort": 5
                },
                {
                    "sku": "20-188-0048",
                    "title": "玩具会场",
                    "img": "/picture/product-02.jpg",
                    "price": 499.00,
                    "sales": "买就送好礼",
                    "sort": 6
                }
            ]
        },
        {
            "templateid": 20022619,
            "templatename": "猜你喜欢",
            "templatetype": "oneImage",
            "templatecolor": "#f72653",
            "requestdate": "1504688073945",
            "sort": 12,
            "items": [
                {
                    "id": "21034936",
                    "imgname": "内衣",
                    "imgurl": "/picture/title-04.png",
                    "jumpurl": "",
                    "sort": 1
                }
            ]
        },
        {
            "templateid": 20022522,
            "templatename": "产品列表",
            "templatetype": "product",
            "templatecolor": "#f72653",
            "requestdate": "1504688073945",
            "sort": 13,
            "items": [
                {
                    "sku": "20-188-0046",
                    "title": "三只松鼠坚果大礼包零食干果组合特产礼盒8袋 F套餐 G套餐 H套餐 J套餐 K套餐",
                    "price": 599.00,
                    "market": 1000.00,
                    "img": "/picture/product-01.jpg",
                    "brand": "/picture/brand-01.png",
                    "sales": "满199-20元",
                    "feature": "满减",
                    "sort": 1
                },
                {
                    "sku": "20-188-0047",
                    "title": "御泥坊鲜嫩美莓面膜贴套装亮肤收缩毛孔玻尿酸补水保湿女",
                    "price": 899.00,
                    "market": 1000.00,
                    "img": "/picture/product-02.jpg",
                    "brand": "/picture/brand-02.png",
                    "sales": "领券399减20",
                    "feature": "赠送",
                    "sort": 2
                },
                {
                    "sku": "20-188-0048",
                    "title": "美多丝水疗素洗发乳护发素滋养头皮柔顺护理精油洗护套餐",
                    "price": 699.00,
                    "market": 1000.00,
                    "img": "/picture/product-02.jpg",
                    "brand": "/picture/brand-03.png",
                    "sales": "全场5折起",
                    "feature": "",
                    "sort": 3
                },
                {
                    "sku": "20-188-0048",
                    "title": "方广宝宝面条婴幼儿无盐面1段450g*3盒儿童营养辅食面6-36个月",
                    "price": 699.00,
                    "market": 1000.00,
                    "img": "/picture/product-01.jpg",
                    "brand": "/picture/brand-04.png",
                    "sales": "全场5折起",
                    "feature": "特价",
                    "sort": 4
                }
            ]
        }
    ];
}