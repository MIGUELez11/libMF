const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

module.exports = {
    entry: `${__dirname}/main.js`,
    output: {
        path: `${__dirname}/dist`,
        filename: "main.js",
        library: "libmf",
        libraryTarget: "commonjs-module"
    },
    devtool: 'source-map',
    mode: "development",
    resolve: {
        extensions: [".ts", ".js", ".json"]
    },
    watch: true,
    plugins: [
        new Dotenv()
        //Need to minify and ofuscate
    ],
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    },
                    "ts-loader"
                ]
            }
        ]
    }
}