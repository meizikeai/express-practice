const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let activitySchema = new Schema({
    title: { type: String, default: "" },
    color: { type: String, default: "" },
    template: { type: Array, default: [] },
    updatetime: { type: Date, default: Date.now },
    createtime: { type: Date, default: Date.now }
});

// activitySchema.virtual("hid").set(function (id) {
//     this.kid = id;
// });

// activitySchema.methods = {};

activitySchema.statics = {
    load: function (id, cb) {
        if (!id) {
            return cb("错误的id信息~")
        }
        this.findOne({}, cb);
    }
};

mongoose.model("Activity", activitySchema);