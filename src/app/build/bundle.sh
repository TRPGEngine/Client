#!/bin/bash

# 打包app项目的js代码
# 在src/app目录调用

export REACT_NATIVE_APP_ROOT=../../
export PLATFORM=app
export NODE_ENV=production

mkdir ./dist
./node_modules/.bin/react-native bundle --entry-file index.js --bundle-output ./dist/index.bundle.js
