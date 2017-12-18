var path = require('path');

module.exports = {
    dev: {
        port: 3008,
        db: "mongodb://localhost:27017/express-practice",
        secret: "find a girlfriend...",
        minutes: 10,
        maxAge: 1000 * 60 * 10, // 毫秒、秒、分
        root: path.normalize(__dirname + "/../.."),
    },
    production: {
        port: 80,
        db: "mongodb://localhost:27017/express-practice",
        secret: "find a girlfriend...",
        minutes: 30,
        maxAge: 1000 * 60 * 30, // 毫秒、秒、分
        root: path.normalize(__dirname + "/../.."),
    }
};
