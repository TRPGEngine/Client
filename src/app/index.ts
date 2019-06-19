// 手动进行配置设置
// require('../../config/project.config').platform = 'app';
require('moment/locale/zh-cn');
require('moment').locale('zh_CN');
require('../shared/utils/common');

import { AppRegistry, YellowBox } from 'react-native';
import App from './App';
import _get from 'lodash/get';
import projectConfig from '../../config/project.config';

// Sentry
import Config from 'config';
const dsn = _get(Config, 'sentry.dsn');
if (dsn && projectConfig.environment === 'production') {
  import('react-native-sentry')
    .then((module) => module.Sentry)
    .then((Sentry) => {
      Sentry.config(dsn).install();
    });
}

YellowBox.ignoreWarnings(['Require cycle:']); // Metro warning, Specific for Sentry

AppRegistry.registerComponent('trpg', () => App);
