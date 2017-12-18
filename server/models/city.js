const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let citySchema = new Schema({
    cities: { type: Array, default: [] },
    createtime: { type: Date, default: Date.now }
});

// citySchema.methods = {};

citySchema.statics = {
    load: function (cb) {
        this.find({}).sort({ createtime: -1 }).limit(1).exec(cb);
    }
};

mongoose.model("City", citySchema);