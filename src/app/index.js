// 手动进行配置设置
// require('../../config/project.config').platform = 'app';
require('moment/locale/zh-cn');
require('moment').locale('zh_CN');

const { AppRegistry } = require('react-native');
const App = require('./App');

AppRegistry.registerComponent('trpg', () => App);
