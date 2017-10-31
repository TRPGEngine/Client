const gulp = require('gulp');
const gutil = require('gulp-util');
const replace = require('gulp-replace');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

gulp.task('default', ['assets', 'webpack', 'redirect']);

gulp.task('assets', function() {
  gulp.src('../src/assets/**/*')
    .pipe(gulp.dest('../dist/assets/'))
})

gulp.task('redirect', ['webpack'], function() {
  gulp.src('../dist/bundle.js')
    .pipe(replace('/src/assets/', './assets/'))
    .pipe(replace('//at.alicdn.com', 'https://at.alicdn.com'))
    .pipe(gulp.dest('../dist/'))
})

gulp.task('webpack', function(callback) {
  webpack(webpackConfig, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }
    gutil.log('[webpack]', stats.toString({ modules: false, colors: true }));
    callback();
  });
});
