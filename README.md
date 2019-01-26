# TRPG Game

[![Build Status](https://travis-ci.org/TRPGEngine/Client.svg?branch=master)](https://travis-ci.org/TRPGEngine/Client)
[![Release](https://img.shields.io/github/release/TRPGEngine/Client.svg)](https://github.com/TRPGEngine/Client/releases)
[![Downloads](https://img.shields.io/github/downloads/TRPGEngine/Client/total.svg)](https://github.com/TRPGEngine/Client/releases)
[![Windows](https://img.shields.io/badge/platform-windows-blue.svg)]()
[![Mac](https://img.shields.io/badge/platform-mac-blue.svg)]()
[![Linux](https://img.shields.io/badge/platform-linux-blue.svg)]()
[![iOS](https://img.shields.io/badge/platform-ios-orange.svg)]()
[![Android](https://img.shields.io/badge/platform-android-orange.svg)]()
[![Web](https://img.shields.io/badge/platform-web-green.svg)]()

TPRG前端网页端与手机端RN端(开发中)

<!-- ## 开发版下载

**开发版不一定是一个稳定可用版本。请下载时候注意**

- [trpg-game-client-win32-ia32](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/TRPGEngine/Client/tree/gh-pages/app/trpg-game-client-win32-ia32)
- [trpg-game-client-win32-x64](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/TRPGEngine/Client/tree/gh-pages/app/trpg-game-client-win32-x64)
- [trpg-game-client-darwin-x64](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/TRPGEngine/Client/tree/gh-pages/app/trpg-game-client-darwin-x64)
- [trpg-game-client-linux-ia32](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/TRPGEngine/Client/tree/gh-pages/app/trpg-game-client-linux-ia32)
- [trpg-game-client-linux-x64](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/TRPGEngine/Client/tree/gh-pages/app/trpg-game-client-linux-x64)
- [trpg-game-client-linux-arm64](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/TRPGEngine/Client/tree/gh-pages/app/trpg-game-client-linux-arm64)
- [trpg-game-client-linux-armv7l](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/TRPGEngine/Client/tree/gh-pages/app/trpg-game-client-linux-armv7l) -->

## 打包&运行

需求环境:
- nodejs7.6+

```bash
$ npm install

$ npm run dev # 运行开发服务器
#or
$ npm run build # 打包js文件
#or
$ npm run package # 打包当前平台的pc端文件
```

**开发服务器访问`http://127.0.0.1:8080/`即可访问客户端**
**客户端需要配合服务端才能正常运行, 具体可以查看服务端项目[TRPGEngine/DevTool](https://github.com/TRPGEngine/DevTool)**

## 关于开发进度

目前项目同时有web版、桌面版（windows, linux, macos）、和移动版（ios, android）。其中web版的开发进度和桌面版的开发进度是同步的。移动版的开发进度尚处于早期版本。
- web版开发进度: 前期测试版，属于大部分功能可用的状态，但可能会有不可预知的bug(大部分都可以通过刷新页面来解决)。
- 移动版开发进度：内部开发版。属于一个尚不可用的状态。

## 关于环境变量
- `PLATFORM` : 编译的平台, 可选:`web`, `app`, `electron`, 默认为`web`
- `NODE_ENV` : 编译环境, 可选:`production`, `development`, 默认为`development`
- `TRPG_HOST` : 编译指定的后端服务端地址, 默认值:(编译环境`development`为`127.0.0.1`, `production`为`trpgapi.moonrailgun.com`)

## NPM命令解释
详见package.json

- `dev`: web端开发环境
- `build`: web端编译
- `pc`: 客户端生产环境本地运行
- `pcdev`: 客户端开发环境
- `package`: 客户端打包(当前系统)
- `package-all`: 客户端打包(全环境, window,mac,linux)
- `app`: app端开发环境(需要配合`react-native run-android`或`react-native run-ios`先编译一份基本运行的壳)
- `app-clear`: app端开发环境(清理缓存)
- `lint`: eslint检测
- `lint:fix`: eslint检测并尝试自动修复

## 部分截图
![](./doc/login.png)
![](./doc/converse.png)
![](./doc/actor.png)
![](./doc/group.png)
![](./doc/note.png)

## 关于贡献
欢迎发送pr，请在发起pr时详细描述改动的目的，这样会更加方便进行审核

## 关于开源
本作品基于[GPLv3开源协议](./LICENSE)。不允许任何未经授权的商业行为。
