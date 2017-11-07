const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let saleSchema = new Schema({
    title: { type: String, required: true },
    brandname: { type: String, required: true },
    imgurl: { type: String, required: true },
    label: { type: Boolean, default: false },
    discount: { type: String, required: true },
    starttime: { type: Date, required: true },
    endtime: { type: Date, required: true },
    createtime: { type: Date, default: Date.now }
});

// saleSchema.methods = {};

saleSchema.statics = {
    load: function (cb) {
        this.find({}).sort({ createtime: -1 }).limit(1).exec(cb);
    }
};

mongoose.model("Sale", saleSchema);

// "title": "美妆护肤专场",
// "brandname": "津尔氏"
// "imgurl": "/images/sale-1.jpg",
// "label": false,
// "discount": "2.4-9.0折",
// "starttime": "2017-09-21T10:00:00",
// "endtime": "2017-09-26T08:00:00",