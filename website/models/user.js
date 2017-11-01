const mongoose = require('mongoose');
const crypto = require('crypto');

let userSchema = new mongoose.Schema({
    // 登录名
    loginname: { type: String, required: true, unique: true },
    // 密码
    hashed_password: String,
    // 用户名
    username: String,
    // 身份证
    identity: String,
    // 手机
    phone: String,
    // 邮箱
    email: String,
    // 加密串
    salt: String,
    // 状态，0-正常，1-禁用
    status: { type: Number, default: 0 },
    // 创建时间
    time: { type: Date, default: Date.now }
}, { virtuals: true });

userSchema.virtual('password').set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function () {
    return this._password;
});

userSchema.path('hashed_password').validate(function (hashed_password) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    return (typeof hashed_password === 'string' && hashed_password.length > 0);
}, 'Password cannot be blank');

userSchema.methods = {
    // 验证密码
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    // 随机生成
    makeSalt: function () {
        return crypto.randomBytes(16).toString('base64');
    },

    // 密码加密
    encryptPassword: function (password) {
        if (!password || !this.salt) return '';
        let salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};

userSchema.statics = {
    list: function (options, cb) {
        let self = this;
        let opt = options || {};
        let criteria = opt.criteria || {};
        let select = opt.select;
        let sort = opt.sort || { createDate: -1 };
        let skip = opt.skip || 0;
        let limit = opt.limit || 10;

        self.count(criteria, function (err, count) {
            self.find(criteria)
                .select(select)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(function (err, docs) {
                    cb(err, docs, count);
                });
        });
    },
};

mongoose.model('User', userSchema);