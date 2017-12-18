const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let productSchema = new Schema({
    code: { type: String, default: "" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    sell: { type: Number, default: 0 },
    images: { type: Array, default: [] },
    price: { type: Schema.Types.Mixed, default: {} },
    promotion: { type: Array, default: [] },
    skubase: { type: Schema.Types.Mixed, default: {} },
    protection: { type: Array, default: [] },
    brand: { type: Schema.Types.Mixed, default: {} },
    category: { type: Schema.Types.Mixed, default: {} },
    delivery: { type: Schema.Types.Mixed, default: {} },
    updatetime: { type: Date, default: Date.now },
    createtime: { type: Date, default: Date.now }
});

// productSchema.virtual("uid").set(function (id) {
//     this.kid = id;
// });

// productSchema.methods = {};

productSchema.statics = {
    load: function (code, cb) {
        if (!code) {
            cb("没有传相关的id");
        }

        // 不根据code查找
        this.findOne({}, '-_id code title subtitle sell images price promotion skubase protection brand category delivery', (err, db) => {
            if (err) {
                console.log(err);
            }

            cb(err, db);
        });
    },
    save: function () { }
}

mongoose.model("Product", productSchema);