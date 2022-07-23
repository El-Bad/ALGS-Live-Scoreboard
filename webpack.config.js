const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { PassThrough } = require("stream");

module.exports = (env) => {
  console.log(env.dev ? "DEVELOPMENT MODE" : "");
  return {
    mode: "development",
    entry: path.resolve(__dirname, "./src/index.js"),
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
      ],
    },
    resolve: {
      extensions: ["*", ".js"],
    },
    devtool: "inline-source-map",
    devServer: {
      static: "./dist",
    },

    plugins: [
      new HtmlWebpackPlugin({
        title: "ALGS Live Stats",
        favicon: "src/images/favicon.png",
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        "window.$": "jquery",
      }),
      new webpack.DefinePlugin({
        DEVELOPMENT: env.dev ?? false,
      }),
    ],
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    optimization: {
      runtimeChunk: "single",
    },
  };
};
