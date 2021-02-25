const nodeExternals = require("webpack-node-externals");
var DeclarationBundlerPlugin = require('declaration-bundler-webpack-plugin');
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: `${__dirname}/srcs/main.ts`,
  output: {
    path: `${__dirname}/dist`,
    filename: "main.bundle.js",
    library: "libmf",
    libraryTarget: "commonjs"
  },
  target: "node",
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
          "ts-loader"
        ]
      }
    ]
  }
}