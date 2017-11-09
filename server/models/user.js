const mongoose = require("mongoose");
const crypto = require("crypto");

let userSchema = new mongoose.Schema({
    // 登录名
    loginname: { type: String, required: true, unique: true },
    // 密码
    password: { type: String, required: true, unique: true },
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
    // 查询次数
    query: { type: Number, default: 0 },
    // 调用短信接口的验证码 - 没接口，所以默认为7758
    verify: { type: String, default: "7758" },
    // 修改时间
    updatetime: { type: Date, default: Date.now },
    // 创建时间
    createtime: { type: Date, default: Date.now }
});

userSchema.virtual("pin").set(function (pin) {
    this._pin = pin;
    this.salt = this.makeSalt();
    this.password = this.encryptPassword(pin);
}).get(() => {
    return this._pin;
});

userSchema.path("password").validate(function (password) {
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
    load: function (option, cb) {
        if (typeof option !== "object") {
            return cb("缺少查询条件~");
        }
        this.findOne(option).exec(cb);
    },
    save: function (name, data, cb) {
        if (!name || !data) {
            return cb("no page");
        }
        if (data.hasOwnProperty("__v")) {
            delete data.__v;
        }

        this.findOne({ loginname: name }).exec((err, view) => {
            if (err) {
                return cb(err);
            }
            if (view) {
                // view.data = page;
                view.createtime = new Date();
                view.save(cb);
            }
        });
    },
    // updatePassword: function (id, password, cb) {
    //     if (!id || !password) {
    //         return cb("缺少用户id或password~");
    //     }
    //     this.findByIdAndUpdate(id, { password: password }, (err, db) => {
    //         cb(err, db);
    //     });
    // },
    updateQuery: function (id, cb) {
        if (!id) {
            return cb("缺少用户id~");
        }
        this.findByIdAndUpdate(id, { $inc: { query: 1 } }, (err, db) => {
            cb(err, db);
        });
    }
};

mongoose.model("User", userSchema);