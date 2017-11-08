const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let personalSchema = new Schema({
    kid: Schema.Types.ObjectId,
    info: {
        userLevel: { type: Number, default: 0 },
        userLogo: { type: String, default: "/picture/avatar.jpg" },
        userName: { type: String, default: "" },
        favoriteProduct: { type: Number, default: 0 },
        favoriteShop: { type: Number, default: 0 },
        footPrints: { type: Number, default: 0 },
        order2Pay: { type: Number, default: 0 },
        order2Deliver: { type: Number, default: 0 },
        order2Receive: { type: Number, default: 0 },
        order2Rate: { type: Number, default: 0 }
    },
    entry: { type: Array, "default": [] },
    other: { type: Array, "default": [] },
    createtime: { type: Date, default: Date.now }
});

personalSchema.virtual("uid").set(function (id) {
    this.kid = id;
});

// personalSchema.methods = {};

personalSchema.statics = {
    load: function (id, cb) {
        this.findOne({ kid: id }).exec(cb);
    }
};

mongoose.model("Personal", personalSchema);