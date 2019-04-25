const path = require('path');
const gulp = require('gulp');
const replace = require('gulp-replace');
const jeditor = require("gulp-json-editor");
const log = require('fancy-log');
const PluginError = require('plugin-error');
const {
  series, //顺序
  parallel, // 并行
} = gulp;

const ROOT_PATH = path.resolve(__dirname, '../');
const CONFIG_PATH = path.resolve(ROOT_PATH, './config');
process.env['NODE_CONFIG_DIR'] = CONFIG_PATH; // 手动设置配置文件目录， 否则会在build文件夹里面找

gulp.task('assets', async function() {
  gulp.src('../src/assets/**/*').pipe(gulp.dest('../dist/assets/'));

  gulp.src('../build/entry.js').pipe(gulp.dest('../dist/'));
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

gulp.task(
  'redirect',
  series('webpack', function() {
    return gulp
      .src('../dist/app.*.js')
      .pipe(replace('/src/assets/', './assets/'))
      .pipe(replace('//at.alicdn.com', 'https://at.alicdn.com'))
      .pipe(gulp.dest('../dist/'));
  })
);

gulp.task('default', parallel('assets', 'webpack', 'redirect'));

gulp.task(
  'package',
  series('default', function(callback) {
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
  })
);

gulp.task(
  'package:all',
  series('default', function(callback) {
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
  })
);

gulp.task('build:createBuilderPackage', function() {
  return gulp.src('../package.json').pipe(jeditor((json) => {
    json.main = './entry.js';
    return json;
  })).pipe(gulp.dest('../.buildcache/'))
})

gulp.task(
  'package:builder',
  series('default', function(callback) {
    const builder = require('electron-builder');
    const Platform = builder.Platform;
    const builderConfig = require('../config/builder.config.js');
    log('[electron-builder]', 'start building...');

    builder
      .build({
        targets: Platform.MAC.createTarget(),
        config: builderConfig,
      })
      .then(() => {
        log('[electron-builder]', 'building completed!');
        callback();
      })
      .catch((err) => {
        log('[electron-builder]', 'building error:');
        throw new Error(err);
      });
  })
);

// 将字体文件复制到设备对应目录
gulp.task('copyIconfont', function() {
  return gulp
    .src('../src/assets/fonts/iconfont.ttf')
    .pipe(gulp.dest('../android/app/src/main/assets/fonts/'))
    .pipe(gulp.dest('../ios/trpg/Images.xcassets/iconfont.dataset/'));
});
