const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = env.production === true;

  return {
    entry: isProduction ? './dist/bundle.js' : './src/js/app.js',
    output: {
      filename: isProduction ? 'bundle.js' : './src/js/app.js',
      path: path.resolve(__dirname, isProduction ? '../dist' : './src/js'),
    },
    mode: argv.mode || 'development',
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
        },
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' }
        }
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
      }),
    ],
    devServer: {
      static: './src/',
      port: 5500,
      headers: {
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
      },
    },
  }
};  
