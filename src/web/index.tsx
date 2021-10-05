import './init';
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { attachStore } from '../shared/utils/cache-helper';
import configureStore from '../shared/redux/configureStore';
import * as trpgApi from '../shared/api/trpg.api';
import { notifyBuilder } from './utils/notify';
import rnStorage from '../shared/api/rn-storage.api';
import { loginWithToken } from '../shared/redux/actions/user';
import {
  setNotificationPermission,
  initConfig,
} from '../shared/redux/actions/settings';
import { installServiceWorker } from './utils/sw-helper';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import './components/messageTypes/__all__';
import '@web/assets/css/iconfont.css';
import { bindEventFunc } from '@shared/api/listener';
import { watchLoginStatus } from '@redux/middlewares/watchLoginStatus';
import { setUser as setUserSentryInfo } from './utils/sentry';
import { TLoadable } from './components/TLoadable';
import { ThemeContextProvider } from '@shared/context/ThemeContext';
import type { TRPGStore } from '@redux/types/__all__';
import { setAnalyticsUser } from './utils/analytics-helper';
import './debug';
import { reportError } from './utils/error';
import { initPlugins } from './plugin-loader';

declare global {
  interface Window {
    store: TRPGStore;
  }
}

/**
 * NOTICE:
 * 注意这里有一个问题
 * 就是为了异步加载i18n的语言。必须确保App(用语言的地方)在i18n加载之后才能正常使用
 * 否则会抛出异常。目前该逻辑无法确保顺序必定一致
 */
const App = TLoadable<{}>(() =>
  import('./routes/App').then((module) => module.App)
);

installServiceWorker(); // 注册 service worker 服务

const store = configureStore({
  additionMiddleware: [
    watchLoginStatus({
      onLoginSuccess(info) {
        setUserSentryInfo(info);
        setAnalyticsUser(info);
      },
    }),
  ],
});
attachStore(store);
window.store = store; // for debug

const api = trpgApi.getInstance();
bindEventFunc.call(api, store, {
  onReceiveMessage: notifyBuilder(store).onReceiveMessage,
});
window.onerror = (event, source, fileno, columnNumber, error) => {
  if (String(event) === 'ResizeObserver loop limit exceeded') {
    // antd tooltip 会有问题。不知道什么原因 说是修好了但是还是有问题
    // https://github.com/ant-design/ant-design/issues/23246
    return;
  }

  // 全局错误捕获
  reportError(error || String(event));
};

// 加载本地存储数据进行应用初始化
(async () => {
  // token登录
  const uuid = await rnStorage.get('uuid');
  const token = await rnStorage.get('token');
  if (!!token && !!uuid) {
    store.dispatch(loginWithToken(uuid, token, null));
  }

  // 初始化配置
  store.dispatch(initConfig());

  store.dispatch(setNotificationPermission(Notification.permission));
})();

initPlugins().finally(() => {
  // 确保插件加载完毕后再渲染组件
  // TODO: 想办法看看有没有不是阻塞的方法, 比如当插件加载完毕后通知代码更新
  ReactDom.render(
    <Provider store={store}>
      <ThemeContextProvider>
        <ConfigProvider locale={zhCN}>
          <App />
        </ConfigProvider>
      </ThemeContextProvider>
    </Provider>,
    document.querySelector('#app')
  );
});
