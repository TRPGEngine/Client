const gulp = require('gulp');
const replace = require('gulp-replace');
const log = require('fancy-log');
const PluginError = require('plugin-error');

gulp.task('default', ['assets', 'webpack', 'redirect']);

gulp.task('assets', function() {
  gulp.src('../src/assets/**/*').pipe(gulp.dest('../dist/assets/'));

  gulp.src('../build/entry.js').pipe(gulp.dest('../dist/'));
});

gulp.task('redirect', ['webpack'], function() {
  gulp
    .src('../dist/bundle.js')
    .pipe(replace('/src/assets/', './assets/'))
    .pipe(replace('//at.alicdn.com', 'https://at.alicdn.com'))
    .pipe(gulp.dest('../dist/'));
});

gulp.task('webpack', function(callback) {
  const webpack = require('webpack');
  const webpackConfig = require('../config/webpack.config.js');
  webpack(webpackConfig, function(err, stats) {
    if (err) {
      throw new PluginError('webpack', err);
    }
    log('[webpack]', stats.toString({ modules: false, colors: true }));
    callback();
  });
});

gulp.task('package', ['assets', 'webpack', 'redirect'], function(callback) {
  const packager = require('electron-packager');
  const packagerConfig = require('../config/packager.config.js');
  log('[electron-packager]', 'start packing...');

  packager(packagerConfig, function(err, appPaths) {
    if (err) {
      throw new Error(err);
    } else {
      log('[electron-packager]', 'package completed!', appPaths);
      callback();
    }
  });
});

gulp.task('package:all', ['assets', 'webpack', 'redirect'], function(callback) {
  const packager = require('electron-packager');
  const packagerConfig = require('../config/packager.config.js');
  packagerConfig.all = true;
  log('[electron-packager]', 'start packing...');

  packager(packagerConfig, function(err, appPaths) {
    if (err) {
      throw new Error(err);
    } else {
      log('[electron-packager]', 'package completed!', appPaths);
      callback();
    }
  });
});

// 将字体文件复制到设备对应目录
gulp.task('copyIconfont', function() {
  return gulp
    .src('../src/assets/fonts/iconfont.ttf')
    .pipe(gulp.dest('../android/app/src/main/assets/fonts/'))
    .pipe(gulp.dest('../ios/trpg/Images.xcassets/iconfont.dataset/'));
});
