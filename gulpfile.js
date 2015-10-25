/*eslint-disable */

var gulp = require('gulp');
var gutil = require('gulp-util');
var webpackConfig = require('./webpack.config.js');
var webpack = require('webpack');
var del = require('del');
var rsync = require('gulp-rsync');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var CONFIG = {
  dist: './dist'
};

gulp.task('clean-dist', function(cb) {
  return del([CONFIG.dist], cb);
});

gulp.task('build', ['clean-dist'], function(cb) {
  var myConfig = Object.create(webpackConfig);

  myConfig.plugins = (myConfig.plugins||[]).concat([
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index_prod.html')
    }),
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify('production')},
    }),
    new ExtractTextPlugin('[name]-[contenthash].css')
  ]);
  myConfig.output.path = path.join(__dirname, CONFIG.dist);
  myConfig.output.publicPath = 'http://projects.danielberndt.net/mapfix/';
  myConfig.output.filename = "[name]-[hash].js";
  myConfig.devtool = 'source-map';

  styleLoader = myConfig.module.loaders.filter(function(loader){return loader.test.source === "\\.css$"; })[0];
  var loaders = styleLoader.loader.split('!');
  styleLoader.loader = ExtractTextPlugin.extract(loaders[0], loaders.slice(1).join('!'));

  webpack(myConfig, function(err, stats) {
    if (err) {
      gutil.log(gutil.colors.red('Error (build): ' + err));
    } else {
      stats.compilation.warnings.forEach(function(warning) {gutil.log(gutil.colors.yellow(warning)); });
      stats.compilation.errors.forEach(function(error) {gutil.log(gutil.colors.red(error)); });
    }
    if (err || stats.compilation.errors.length) {
      cb(err||stats.compilation.errors[0]);
    } else {
      cb();
    }
  });
});

gulp.task('deploy', ['build'], function() {
  return gulp.src([CONFIG.dist+'/**'])
    .pipe(rsync({
      root: CONFIG.dist,
      username: 'www-data',
      hostname: 'danielberndt.net',
      destination: '~/projects/mapfix',
      compress: true
    }));
});