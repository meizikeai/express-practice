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
        this.find({}).sort({ createtime: -1 }).limit(8).exec(cb);
    }
};

mongoose.model("Sale", saleSchema);