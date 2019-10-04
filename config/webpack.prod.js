/* Import stuff */
const Path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  /*
    Note the differences in entry point setup between Dev and Prod config. Here, we only
    need two entry points
  */
  entry: {
    index: [
      Path.resolve(__dirname, '../src/client/assets/js/main.js')
    ],
    styles: [
      Path.resolve(__dirname, '../src/client/assets/css/styles.css')
    ]
  },
  /* Set mode to production for webpack optimization */
  mode: 'production',
  /* Output setup */
  output: {
    publicPath: '/',
    path: Path.resolve(__dirname, '../dist'),
    filename: '[name]-bundle.js'
  },
  optimization: {
    /* Apply uglifyJs minimizer */
    minimizer: [
      new UglifyJsPlugin()
    ],
    /*
      Optimization with splitChunksPlugin. This has no effect for this project because main.js
      is the only client javascript and has no dependencies
    */
    splitChunks: {
      chunks: 'all',
      minChunks: 2,
      cacheGroups: {
        vendors: {
          filename: '[name]~bundle.js'
        }
      }
    }
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
      /*
        Note that we were using style-loader in dev and loader from
        mini-css-extract plugin here. This extracts all css to separate files
      */
      use: [
        MiniCssExtractPlugin.loader,
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
      chunks: ['styles']
    }),
    new HtmlPlugin({
      template: Path.resolve(__dirname, '../src/client/templates/views/help.pug'),
      filename: 'help.html',
      chunks: ['styles']
    }),
    new HtmlPlugin({
      template: Path.resolve(__dirname, '../src/client/templates/views/error.pug'),
      filename: 'error.html',
      chunks: ['styles'],
      msg: 'Yo! There is a problem! Either you are trying to go somewhere that\'s not on our (site)map, or we screwed up'
    }),
    /* Extract all css to separate files */
    new MiniCssExtractPlugin({
      filename: '[name]-[contentHash].css'
    }),
    /* Optimize css */
    new OptimizeCssPlugin(),
    /* Generate files with gzip and brotli compression for use when possible */
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip'
    }),
    new CompressionWebpackPlugin({
      filename: '[path].br[query]',
      algorithm: 'brotliCompress'
    })
  ],
  devtool: 'source-map',
}
