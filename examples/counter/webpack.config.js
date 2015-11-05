var webpack = require('webpack');
var path = require('path');
var root = path.dirname(path.dirname(__dirname))
var referDom = path.join(path.dirname(root), 'refer-dom')
module.exports = {
    watch: true,
    entry: {
        counter: './src'
    },
    output: {
        path: 'dist',
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel-loader?stage=0',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['', '.js'],
        alias: {
            //'react': referDom,
            'refer': root + '/src/'
        }
    }
};
