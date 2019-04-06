// 手动进行配置设置
// require('../../config/project.config').platform = 'app';
require('moment/locale/zh-cn');
require('moment').locale('zh_CN');
require('../shared/utils/common');

import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('trpg', () => App);
