const mongoose = require("mongoose");
const crypto = require("crypto");

const Schema = mongoose.Schema;

let personalSchema = new mongoose.Schema({
    cid: Schema.Types.ObjectId,
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
    other: { type: Array, "default": [] }
});

personalSchema.virtual("userid").set(function (id) {
    this.cid = id;
});

personalSchema.methods = {};

personalSchema.statics = {
    load: function (userId, pageId, cb) {
        let self = this;
        self.findOne({ userId: userId, pageId: pageId }).exec(cb);
    }
};

mongoose.model("Personal", personalSchema);