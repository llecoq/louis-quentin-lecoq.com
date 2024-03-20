const path = require('path');

module.exports = {
    entry: './dist/main.bundle.js',
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
        ],
      },
    devServer: {
        static: {
            directory: path.join(__dirname, '../dist'),
        },
        port: 5500,
        headers: {
            "Cross-Origin-Embedder-Policy": "require-corp",
            "Cross-Origin-Opener-Policy": "same-origin",
        },
    },
}
