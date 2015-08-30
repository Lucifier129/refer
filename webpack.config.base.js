var webpack = require('webpack');

module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'Refer',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js']
  }
};
