const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(?:jpg|png|gif|svg)$/,
        loader: 'url-loader',
        options: { limit: 10000 },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'window.APP_ENV': JSON.stringify(process.env.APP_ENV),
      'window.ETH_NETWORK': JSON.stringify(process.env.ETH_NETWORK),
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'public/index.html'),
    }),
    // Optimize moment.js size
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
}
