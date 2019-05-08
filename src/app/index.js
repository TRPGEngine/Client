// 手动进行配置设置
// require('../../config/project.config').platform = 'app';
require('moment/locale/zh-cn');
require('moment').locale('zh_CN');
require('../shared/utils/common');

import { AppRegistry } from 'react-native';
import App from './App';
import _get from 'lodash/get';

// Sentry
import { Sentry } from 'react-native-sentry';
import Config from 'config';
const dsn = _get(Config, 'sentry.dsn');
if (dsn) {
  Sentry.config(dsn).install();
}

AppRegistry.registerComponent('trpg', () => App);
