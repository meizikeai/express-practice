const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let orderSchema = new Schema({
    kid: { type: String, default: "" },
    oid: { type: String, default: "" },
    state: { type: String, default: "" },
    base: { type: Array, default: [] },
    updatetime: { type: Date, default: Date.now },
    createtime: { type: Date, default: Date.now }
});

// orderSchema.methods = {};

orderSchema.statics = {
    load: function (option, cb) {
        if (typeof option !== "object") {
            return cb("缺少查询条件~");
        }

        this.find(option.find).select('-_id oid state base createtime').limit(8).exec((err, db) => {
            if (err) {
                console.log(err);
            }
            cb(err, db);
        });
    }
};

mongoose.model("Order", orderSchema);