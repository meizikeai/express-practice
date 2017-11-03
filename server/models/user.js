const mongoose = require("mongoose");
const crypto = require("crypto");

let userSchema = new mongoose.Schema({
    // 登录名
    loginname: { type: String, required: true, unique: true },
    // 密码
    password: String,
    // 用户名
    username: { type: String, default: "" },
    // 身份证
    identity: { type: String, default: "" },
    // 手机
    phone: { type: String, default: "" },
    // 邮箱
    email: { type: String, default: "" },
    // 加密串
    salt: { type: String, default: "" },
    // 状态，0-正常，1-禁用
    status: { type: Number, default: 0 },
    // 创建时间
    time: { type: Date, default: Date.now }
});

userSchema.virtual("pin").set(function (pin) {
    this._pin = pin;
    this.salt = this.makeSalt();
    this.password = this.encryptPassword(pin);
}).get(function () {
    return this._pin;
});

userSchema.path("password").validate((password) => {
    return (typeof password === "string" && password.length > 0);
}, "密码不能为空~");

userSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.password;
    },
    makeSalt: function () {
        return crypto.randomBytes(16).toString("base64");
    },
    encryptPassword: function (password) {
        if (!password || !this.salt) return "";
        let salt = new Buffer(this.salt, "base64");
        return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("base64");
    }
};

userSchema.statics = {
    load: function (userId, cb) {
        let self = this;
        self.findOne({ userId: userId }).exec(cb);
    },
    save: function (userId, page, cb) {
        let self = this;

        if (!page) {
            return cb("no page");
        }

        if (page.hasOwnProperty("__v")) {
            delete page.__v;
        }

        self.findOne({ userId: userId, pageId: page._id }).exec(function (err, view) {
            if (err) {
                return cb(err);
            }

            if (view) {
                view.data = page;
                view.updateDate = new Date();
                view.save(cb);
            }
        });
    }
};

mongoose.model("User", userSchema);