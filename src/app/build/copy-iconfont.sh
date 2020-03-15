#!/bin/bash

echo "正在拷贝iconfont图标字体...."
echo "当前目录: $(pwd)";

cp ../web/assets/fonts/iconfont.ttf ./android/app/src/main/assets/fonts/iconfont.ttf
cp ../web/assets/fonts/iconfont.ttf ./ios/trpg/Images.xcassets/iconfont.dataset/iconfont.ttf

echo "拷贝完毕"
