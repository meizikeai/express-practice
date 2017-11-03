var path = require('path');

module.exports = {
    dev: {
        port: 3008,
        db: "mongodb://localhost:27017/express-practice",
        secret: "find a girlfriend...",
        maxAge: 1000 * 60 * 10,
        root: path.normalize(__dirname + "/../.."),
    },
    production: {
        port: 80,
        db: "mongodb://localhost:27017/express-practice",
        secret: "find a girlfriend...",
        maxAge: 1000 * 60 * 60 * 1,
        root: path.normalize(__dirname + "/../.."),
    }
};
