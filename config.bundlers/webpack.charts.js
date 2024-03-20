const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './benchmarks/charts/js/index.js',
  output: {
    filename: 'charts.js',
    path: path.resolve(__dirname, './benchmarks/charts'),
  },
  mode: 'development',
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
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './benchmarks/charts/index.html', 
      filename: 'index.html'
    }),
  ],
  devServer: {
    static: './benchmarks/charts/', 
    port: 5501,
  },
};
