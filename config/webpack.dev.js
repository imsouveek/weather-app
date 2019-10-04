/* Import stuff */
const Path = require('path');
const Webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  /*
    Note the differences in entry points between Dev and Prod setup. For Prod setup we only
    need index and styles. However, for Dev, we have to create separate entry point for index,
    about and help to enable hot reloading. Note also that for hot reloading to work on pug
    files, the pug files themselves have to be part of the entry points
  */
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
  /* Set mode as development */
  mode: 'development',
  /* Output setup */
  output: {
    publicPath: '/',
    path: Path.resolve(__dirname, '../dist'),
    filename: '[name]-bundle.js'
  },
  /* Define loaders for different file extensions */
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
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.(jpg|png|gif)$/,
      use: [{
        loader: 'file-loader',
        options: {
          outputPath: 'images',
          name: '[name].[ext]'
        }
      }]
    }]
  },
  plugins: [
    /*
      Clean dist folder of unused files. May consider using a simple remove command 
      in package.json (and a git bash commandline dependency) instead
    */
    new CleanWebpackPlugin(),
    /* Enable hot reloading. Since we are using Webpack 4, only plugin below is needed */
    new Webpack.HotModuleReplacementPlugin(),
    /*
      Ensure that html files are generated for the different pug views. This can probably
      be improved use fs.readdirsync
    */
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
      chunks: ['error', 'styles'],
      msg: 'Yo! There is a problem! Either you are trying to go somewhere that\'s not on our (site)map, or we screwed up'
    }),
  ],
  devtool: 'inline-source-map',
  /* Devserver settings */
  devServer: {
    contentBase: Path.resolve(__dirname, '../dist'),
    hot: true,
    overlay: true,
    writeToDisk: true
  }
}
