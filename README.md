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

TPRG前端网页端

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
- nodejs7+

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

## 关于环境变量
- `PLATFORM` : 编译的平台, 可选:`web`, `app`, `electron`
- `NODE_ENV` : 编译环境, 可选:`production`, `development`
- `TRPG_HOST` : 编制指定的服务端地址

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
