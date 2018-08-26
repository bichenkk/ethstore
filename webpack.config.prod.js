const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.config.common.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const extractCss = new ExtractTextPlugin({
  filename: '[name]-1.[contenthash].css',
  allChunks: true,
})

const extractLess = new ExtractTextPlugin({
  filename: '[name]-2.[contenthash].css',
  allChunks: true,
})

module.exports = merge(common, {
  entry: {
    app: [
      './src/index.js',
    ],
    vendor: [
      'antd',
      'bignumber.js',
      'bowser',
      'drizzle',
      'drizzle-react',
      'drizzle-react-components',
      'lodash',
      'moment',
      'react',
      'react-dom',
      'react-redux',
      'react-router-dom',
      'redux',
      'redux-thunk',
      'redux-saga',
      'web3',
    ],
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loaders: [
          'babel-loader?cacheDirectory',
        ],
        exclude: /node_modules/,
      }, {
        test: /\.css$/,
        use: extractCss.extract({
          fallback: 'style-loader',
          use: { loader: 'css-loader', options: { minimize: true } },
        }),
      }, {
        test: /\.less$/,
        use: extractLess.extract({
          fallback: 'style-loader',
          use: [{ loader: 'css-loader', options: { minimize: true } }, 'less-loader'],
        }),
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([{
      from: 'public/',
    }]),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.[chunkhash].js',
      minChunks: Infinity,
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new UglifyJsPlugin({
      sourceMap: true,
      cache: true,
      parallel: true,
      uglifyOptions: {
        warnings: false,
        compress: true,
      },
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    //   cache: true,
    //   parallel: true,
    //   uglifyOptions: {
    //     warnings: false,
    //     compress: true,
    //   },
    // }),
    extractCss,
    extractLess,
  ],
})
