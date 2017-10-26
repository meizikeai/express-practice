
const webpack = require('webpack');

module.exports = {
    entry: {
        "home": "./home.js",
        "user-home": "./user-home.js"
    },
    output: {
        path: "../public/script/",
        filename: "[name].js"
    },
    module: {
        // loaders: [{
        //     test: /\.jsx?$/,
        //     exclude: /node_modules/,
        //     loader: 'babel-loader',
        // }]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //     },
        //     output: {
        //         comments: false,
        //     },
        // })
    ]
};