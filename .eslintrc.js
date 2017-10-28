module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "node": true,
        "es6": true,
        "jquery": true
    },
    "extends": ["eslint:recommended"],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "modules": true,
            "experimentalObjectRestSpread": true
        },
        "ecmaVersion": 7,
        "sourceType": "module"
    },
    "globals": {
        "document": true,
        "navigator": true,
        "window": true,
        "node": true
    },
    "rules": {
        "linebreak-style": [
            "error",
            "windows"
        ],
        "no-console": 0,
        "no-unused-vars": 0
    }
};