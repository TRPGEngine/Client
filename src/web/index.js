import 'moment/locale/zh-cn';
import moment from 'moment';
import '../shared/utils/common';
import App from './containers/App';
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { getTheme } from './theme';
import { attachStore } from '../shared/utils/cache-helper';
import config from '../../config/project.config';
import configureStore from '../redux/configureStore';
import * as trpgApi from '../api/trpg.api';
import notify from './utils/notify';
import rnStorage from '../api/rn-storage.api';
import { showAlert } from '../redux/actions/ui';
import { loginWithToken } from '../redux/actions/user';
import {
  setNotificationPermission,
  setUserSettings,
  setSystemSettings,
} from '../redux/actions/settings';

moment.locale('zh_CN');

const store = configureStore();
attachStore(store);

const api = trpgApi.getInstance();
trpgApi.bindEventFunc.call(api, store, {
  onReceiveMessage: notify(store).onReceiveMessage,
});
trpgApi.setEventErrorHandler((info) => {
  // socket接口错误捕获
  import('./utils/sentry').then((module) => module.error(info));
});
window.onerror = (event, source, fileno, columnNumber, error) => {
  // 全局错误捕获
  import('./utils/sentry').then((module) => module.error(error || event));
};

// 加载本地存储数据进行应用初始化
(async () => {
  // token登录
  let uuid = await rnStorage.get('uuid');
  let token = await rnStorage.get('token');
  if (!!token && !!uuid) {
    store.dispatch(loginWithToken(uuid, token));
  }

  // 系统设置
  store.dispatch(setNotificationPermission(Notification.permission));
  let systemSettings =
    (await rnStorage.get('systemSettings')) || config.defaultSettings.system;
  if (systemSettings) {
    store.dispatch(setSystemSettings(systemSettings));
  }

  // 个人设置
  let userSettings =
    (await rnStorage.get('userSettings')) || config.defaultSettings.user;
  if (userSettings) {
    store.dispatch(setUserSettings(userSettings));
  }
})();

// 检查版本, 网页版跳过检查
if (config.platform !== 'web') {
  import('../shared/utils/check-version').then((module) => {
    const checkVersion = module.default;
    checkVersion(function(isLatest) {
      if (isLatest) {
        console.log('当前版本为最新版');
      } else {
        store.dispatch(
          showAlert({
            title: '检测到新版本',
            content: '检测到有新的版本, 是否现在获取',
            onConfirm: () => {
              window.open(config.github.projectUrl);
            },
          })
        );
      }
    });
  });
}

ReactDom.render(
  <Provider store={store}>
    <ThemeProvider theme={getTheme(store)}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.querySelector('#app')
);
