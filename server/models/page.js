const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let pageSchema = new Schema({
    kid: { type: Number, default: 1000, required: true, unique: true },
    title: { type: String, default: "" },
    color: { type: String, default: "" },
    template: { type: Array, "default": [] },
    createtime: { type: Date, default: Date.now }
});

pageSchema.virtual("hid").set(function (id) {
    this.kid = id;
});

// pageSchema.methods = {};

pageSchema.statics = {
    load: function (cb) {
        this.find().sort({ createtime: -1 }).limit(1).exec(cb);
    }
};

let counterSchema = new Schema({
    kid: { type: String, required: true, unique: true },
    count: { type: Number, default: 1001 },
    createtime: { type: Date, default: Date.now }
});

// pageSchema里的kid与counterSchema的count必须相差一个数~
// 示例：counterSchema.count - pageSchema.kid = 1
mongoose.model("Page", pageSchema);
mongoose.model("Counter", counterSchema);