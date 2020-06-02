// 手动进行配置设置
// require('../../config/project.config').platform = 'app';
import '../shared/utils/common';
import 'react-native-gesture-handler';
import { AppRegistry, YellowBox } from 'react-native';
import projectConfig from '../shared/project.config';
import Config from 'react-native-config';
// 将projectConfig的版本重设为app版本
projectConfig.version = Config.JSVERSION;
import App from './src/App';
import _get from 'lodash/get';

// RN Sentry
const dsn = Config.SENTRY_MOBILEDSN;
if (dsn && projectConfig.environment === 'production') {
  import('@sentry/react-native')
    .then((module) => module.Sentry)
    .then((Sentry) => {
      Sentry.config(dsn).install();
    });
}

YellowBox.ignoreWarnings([
  'Require cycle:', // Metro warning, Specific for Sentry
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?', // for socket.io-client
]);

AppRegistry.registerComponent('trpg', () => App);
