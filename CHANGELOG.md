# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.12](https://github.com/TRPGEngine/Client/compare/v0.2.11...v0.2.12) (2019-12-31)


### Features

* 增加根据服务端配置来决定显示还是隐藏第三方登录的功能 ([df9be11](https://github.com/TRPGEngine/Client/commit/df9be118ea0b2390a36b1a3c70d482ada72ce900))
* **app:** 增加消息撤回功能 ([f93893a](https://github.com/TRPGEngine/Client/commit/f93893aac1c5e8868f269361eaeda0c7cb1c58c2))
* **portal:** 团成员列表增加显示所有者的用户名 ([4a464f5](https://github.com/TRPGEngine/Client/commit/4a464f55bf693f1871847d8ccd6e9130d5a0efe9))
* **portal:** 增加app下载页 ([44bd3d3](https://github.com/TRPGEngine/Client/commit/44bd3d317e7669adf2a1986536438e37a2273e75))


### Bug Fixes

* 修复trpg-actor-template模块导入方式 ([ab8ccc2](https://github.com/TRPGEngine/Client/commit/ab8ccc22457fbf1d00c0e047484bb9d2cc771dab))
* 修复更新消息内容时会无法修改列表页显示消息的问题 ([93ff0d3](https://github.com/TRPGEngine/Client/commit/93ff0d319a61e6043d78dc203c82d103e94e7887))
* **app:** 修复迁移后无法正常管理app ui状态的问题 ([456f621](https://github.com/TRPGEngine/Client/commit/456f621c8aea061a770cb22003d36a185ed129dd))

### [0.2.11](https://github.com/TRPGEngine/Client/compare/v0.2.10...v0.2.11) (2019-12-21)


### Bug Fixes

* **app:** 尝试修复在app中打开portal无法获得最新的token的问题 ([71ffde4](https://github.com/TRPGEngine/Client/commit/71ffde4895d757c26df104ef1159ed82dd0c09a4))

### [0.2.10](https://github.com/TRPGEngine/Client/compare/v0.2.9...v0.2.10) (2019-12-21)


### Features

* 增加团成员列表增加与删除的一些状态管理 ([05568b1](https://github.com/TRPGEngine/Client/commit/05568b1b50903ec427017efc2cc830ed31e77eb1))
* **app:** 增加发送消息时带入选择角色的信息 ([e102d56](https://github.com/TRPGEngine/Client/commit/e102d566108c2c3af590c86a104e660c7cc1e684))
* **portal:** 当url发生变更时。去告知外部 ([f52760b](https://github.com/TRPGEngine/Client/commit/f52760bb7150038e6a50690f97aebb3317d15d31))
* 增加新版富文本编辑器实现 ([cde78d9](https://github.com/TRPGEngine/Client/commit/cde78d98ab26a220271639cac9349f9755647884))
* 增加激活与取消推送的操作 ([ba8ca51](https://github.com/TRPGEngine/Client/commit/ba8ca5172e20cf0ad33106e22bd402f8bedeb330))


### Bug Fixes

* 修复团信息的一些状态管理可能出现的bug ([6c52232](https://github.com/TRPGEngine/Client/commit/6c52232d24133d2bce70839adecbd0ef3f074560))
* **app:** 修复团列表无法正常切换角色的bug ([b444fa2](https://github.com/TRPGEngine/Client/commit/b444fa2f710ff448098b8a4f4d5480d7df8668cb))
* **portal:** 修复actor/groupactor空列表会一直loading的bug ([09b7a84](https://github.com/TRPGEngine/Client/commit/09b7a84e50fd56c49413b9534bb6cb416631eeeb))
* **web:** 修复创建角色时的错误的检测代码 ([e2dcde2](https://github.com/TRPGEngine/Client/commit/e2dcde2772aef8ce2096c1e7ab5209880c58c726))
* **web:** 修复团人物卡申请无团角色创建使用的是旧的的问题 ([24bfbf3](https://github.com/TRPGEngine/Client/commit/24bfbf3ae1cd8b5f88df397061549bdee85302c2))

### [0.2.9](https://github.com/TRPGEngine/Client/compare/v0.2.8...v0.2.9) (2019-12-14)


### Features

* **app:** 增加团人物卡列表入口 ([e1402ad](https://github.com/TRPGEngine/Client/commit/e1402ad9a412890f89a0b7d7aae601caa7750dc1))
* **portal:** 增加删除人物卡的功能 ([84c9fe7](https://github.com/TRPGEngine/Client/commit/84c9fe7db4442a54ac5303030adb3e531de3f8cb))
* **portal:** 增加团人物卡删除功能 ([ae008c4](https://github.com/TRPGEngine/Client/commit/ae008c43662335aafdf2b6c9b7f9db5dbd67bdbe))
* **portal:** 增加待审批人物的预览 ([1f5fa50](https://github.com/TRPGEngine/Client/commit/1f5fa50e26137e9ecc7fab0cfada8642c2284dd5))
* **portal:** 模板列表推荐 ([5cbda38](https://github.com/TRPGEngine/Client/commit/5cbda380befce8ba95612d0bff3d7c39c7fcc249))
* **portal:** 角色删除操作可以通过点击mask关闭 ([5de4afa](https://github.com/TRPGEngine/Client/commit/5de4afa416c53525e5e37d260c077c352f66dfb7))
* **web:** add sw and pwa support ([84743cd](https://github.com/TRPGEngine/Client/commit/84743cdbcac0776b20b82a4c1c3a9bcf38dcb9bd))


### Bug Fixes

* **web:** 修复部分可能会出现的group_members获取失败的问题 ([28b46d7](https://github.com/TRPGEngine/Client/commit/28b46d7215cdd9aabf676b7d1ebc3196ff21b22e))
* 修复双端入团申请会出现数据异常的bug ([23beb1d](https://github.com/TRPGEngine/Client/commit/23beb1d0a80e2c16b81c911ca0a170fe5372151c))

### [0.2.8](https://github.com/TRPGEngine/Client/compare/v0.2.7...v0.2.8) (2019-12-07)


### Features

* **portal:** portal登录页面会主动尝试Token校验并跳转 ([dd7c8b8](https://github.com/TRPGEngine/Client/commit/dd7c8b822ce99882449e7df09028a8ae73fe360d))
* **web:** 增加web端对portal的支持 ([e61492d](https://github.com/TRPGEngine/Client/commit/e61492d8c4c64f33662f4d7759bf4fdfa29f09ba))
* **web:** 增加测试开发用显示容器DevContainer ([48f02aa](https://github.com/TRPGEngine/Client/commit/48f02aac711f827d6cf7c2064278751ece3179cc))


### Bug Fixes

* **web:** 修复GroupActor页面无法正常显示头像的bug ([2e1269a](https://github.com/TRPGEngine/Client/commit/2e1269a113e049695762a64c11c2ae92f0628ddb))
* **web:** 修复时间强调不生效的bug ([2c83abe](https://github.com/TRPGEngine/Client/commit/2c83abec436791d941f9bcb9af7c80cc7a2cfa31))

### [0.2.7](https://github.com/TRPGEngine/Client/compare/v0.1.16...v0.2.7) (2019-12-01)


### Features

* **app:** 增加全局错误处理 ([c24d151](https://github.com/TRPGEngine/Client/commit/c24d151cf36d2495594b1b4ff6d761e642710e94))
* **app:** 增加多账号单点登录支持 ([03defd0](https://github.com/TRPGEngine/Client/commit/03defd0cb9afecfb62ffa89e41258df87bdbdd4b))
* **app:** 角色卡消息允许查看 ([0a57d29](https://github.com/TRPGEngine/Client/commit/0a57d29d3f1bcc017dfcf57b4bb6c3a9d6facb07))


### Bug Fixes

* **app:** fix GroupRequest no group_member  error ([07e5120](https://github.com/TRPGEngine/Client/commit/07e51205728c7201ddc612817bc3eaf86f9c8151))
* **app:** 修复某些情况下可能无法正确获取团成员列表的问题 ([b555f9c](https://github.com/TRPGEngine/Client/commit/b555f9c31a355a72727f13d456511d47bd1c2334))
