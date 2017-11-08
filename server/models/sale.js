const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let saleSchema = new Schema({
    kid: Schema.Types.ObjectId, //操作用户的id
    title: { type: String, required: true },
    brandname: { type: String, required: true },
    imgurl: { type: String, required: true },
    label: { type: Boolean, default: false },
    discount: { type: String, required: true },
    starttime: { type: Date, required: true },
    endtime: { type: Date, required: true },
    createtime: { type: Date, default: Date.now }
});

saleSchema.virtual("uid").set(function (id) {
    this.kid = id;
});

// saleSchema.methods = {};

let delHideData = (db, bool) => {
    let time = new Date();

    return db.map((e, k) => {
        let temp = JSON.parse(JSON.stringify(e));
        let day = {
            start: 0,
            end: 1
        }

        if (bool) {
            day = {
                start: 2,
                end: 6
            }
        }

        if (temp.hasOwnProperty("__v")) {
            delete temp.__v;
        }
        if (temp.hasOwnProperty("kid")) {
            delete temp.kid;
        }
        if (temp.hasOwnProperty("createtime")) {
            delete temp.createtime;
        }
        if (temp.hasOwnProperty("starttime")) {
            temp.starttime = new Date(Date.UTC(time.getFullYear(), time.getMonth(), time.getDate() + day.start)).toJSON();
        }
        if (temp.hasOwnProperty("endtime")) {
            temp.endtime = new Date(Date.UTC(time.getFullYear(), time.getMonth(), time.getDate() + day.end)).toJSON();
        }

        return temp;
    }, this);
};

saleSchema.statics = {
    load: function (code, cb) {
        switch (code) {
            case "1":
                this.find({}).limit(8).exec((err, db) => {
                    if (err && cb) {
                        cb(err, db)
                    } else {
                        cb(err, delHideData(db));
                    }
                });
                break;
            case "2":
                this.find({}).sort({ createtime: -1 }).limit(8).exec((err, db) => {
                    if (err && cb) {
                        cb(err, db)
                    } else {
                        cb(err, delHideData(db));
                    }
                });
                break;
            case "3":
                this.find({}).sort({ brandname: -1 }).limit(8).exec((err, db) => {
                    if (err && cb) {
                        cb(err, db)
                    } else {
                        cb(err, delHideData(db));
                    }
                });
                break;
            case "4":
                this.find({}).skip(5).limit(3).exec((err, db) => {
                    if (err && cb) {
                        cb(err, db)
                    } else {
                        cb(err, delHideData(db, true));
                    }
                });
                break;
            default:
                cb && cb("查询失败~", null);
                break;
        }
    },
    save: function () { }
};

mongoose.model("Sale", saleSchema);