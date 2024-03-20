const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: './src/js/app.js',
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, '../dist'),
      publicPath: 'auto',
    },
    resolve: {
      extensions: ['.wasm', '.js', '.json'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    experiments: {
      asyncWebAssembly: true,
      syncWebAssembly: true,
    },
    mode: 'production',
    module: {
      rules: [  
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.(png|svg|avif|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
      }),
      new CopyPlugin({
        patterns: [
          { from: "./src/assets/images", to: "./assets/images/" },
        ],
      }),
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        failOnError: true,
        allowAsyncCycles: false,
        cwd: process.cwd(),
      }),
      new MiniCssExtractPlugin(),
    ],
  }
