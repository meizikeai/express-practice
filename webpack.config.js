const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const env = process.env.NODE_ENV || "dev";

const handleEntry = (entry) => {
    let pathmap = [];
    let chain = "::";

    if (Array.isArray(entry)) {
        pathmap = entry.map(function (entry) {
            let every = path.resolve(__dirname, entry);
            return fs.readdirSync(every).map(function (file) {
                let filename = "";
                if (~file.indexOf(".js")) {
                    filename = file.replace(".js", "");
                }
                return filename + chain + path.join(every, file);
            });
        }).reduce(function (pre, cur) {
            return pre.concat(cur);
        }, []);
    }

    return pathmap.reduce(function (result, file) {
        let temp = file.split(chain);
        let filename = temp[0];
        let filepath = temp[1];

        if (~file.indexOf(".js")) {
            result[filename] = filepath;
        }

        return result;
    }, {});
};

module.exports = {
    entry: handleEntry(["./pack/js/"]),
    output: {
        path: path.resolve(__dirname, "./public/build/"),
        filename: "[name].js"
        // path: __dirname + "/build",
        // publicPath: "/",
        // filename: "js/[name]-[hash:8].js",
        // chunkFilename: "js/[name]-[hash:8].js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: {
                        loader: "css-loader",
                        // options: { minimize: true }
                    },
                    fallback: "style-loader"
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "[name].css"
        })
    ],
    resolve: {
        extensions: ["*", ".js", ".jsx", ".css"]
    }
};

if (env === "production") {
    // module.exports.devtool = "source-map";
    module.exports.plugins = (module.exports.plugins || []).concat([
        new UglifyJSPlugin(),
        new webpack.DefinePlugin({
            "env": JSON.stringify(env)
        })
    ])
}