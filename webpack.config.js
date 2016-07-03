var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    // 'babel-polyfill',
    './src/resources'
  ],
  output: {
    path: __dirname,
    filename: 'dist/bundle.js'
  },
  module: {
    loaders: [
      {
        loader: "babel-loader",

        include: [
          path.resolve(__dirname, "src")
        ],

        test: /\.jsx?$/,

        query: {
          // plugins: ['transform-runtime'],
          presets: ['es2015']
        }
      }
    ]
  }
};
