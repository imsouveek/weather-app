const Path = require('path');
const Webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: [
      'webpack-hot-middleware/client?reload=true',
      Path.resolve(__dirname, '../src/client/assets/js/main.js'),
      Path.resolve(__dirname, '../src/client/templates/views/index.pug'),
    ],
    about: [
      'webpack-hot-middleware/client?reload=true',
      Path.resolve(__dirname, '../src/client/templates/views/about.pug'),
    ],
    help: [
      'webpack-hot-middleware/client?reload=true',
      Path.resolve(__dirname, '../src/client/templates/views/help.pug'),
    ],
    error: [
      'webpack-hot-middleware/client?reload=true',
      Path.resolve(__dirname, '../src/client/templates/views/error.pug'),
    ],
    styles: [
      'webpack-hot-middleware/client?reload=true',
      Path.resolve(__dirname, '../src/client/assets/css/styles.css')
    ]
  },
  mode: 'development',
  output: {
    publicPath: '/',
    path: Path.resolve(__dirname, '../dist'),
    filename: '[name]-bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }, {
      test: /\.pug$/,
      use: 'pug-loader'
    }, {
      test: /\.css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: true,
            reloadAll: true
          }
        },
        'css-loader'
      ]
    }, {
      test: /\.(jpg|png|gif)$/,
      use: [{
        loader: 'file-loader',
        options: {
          path: 'images',
          name: '[name].[ext]'
        }
      }]
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Webpack.HotModuleReplacementPlugin(),
    new HtmlPlugin({
      template: Path.resolve(__dirname, '../src/client/templates/views/index.pug'),
      filename: 'index.html',
      chunks: ['index', 'styles']
    }),
    new HtmlPlugin({
      template: Path.resolve(__dirname, '../src/client/templates/views/about.pug'),
      filename: 'about.html',
      chunks: ['about', 'styles']
    }),
    new HtmlPlugin({
      template: Path.resolve(__dirname, '../src/client/templates/views/help.pug'),
      filename: 'help.html',
      chunks: ['help', 'styles']
    }),
    new HtmlPlugin({
      template: Path.resolve(__dirname, '../src/client/templates/views/error.pug'),
      filename: 'error.html',
      chunks: ['error', 'styles']
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contentHash].css'
    }),
    new OptimizeCssPlugin()
  ],
  devtool: 'source-map',
}
