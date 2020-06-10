import React from 'react';
import configureStore from '@shared/redux/configureStore';
import { AppRouter } from './router';
import { appNavMiddleware } from './redux/middleware/nav';
import { appUIMiddleware } from './redux/middleware/ui';
const store = configureStore({
  additionMiddleware: [appNavMiddleware, appUIMiddleware],
});
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as AntdProvider } from '@ant-design/react-native';
import { ThemeProvider } from 'styled-components/native';
import { injectLoginSuccessCallback } from '@shared/utils/inject';
import { bindInfo, tryLocalNotify } from './notify';
import { attachStore } from '@shared/utils/cache-helper';
import styledTheme from '@src/shared/utils/theme';
import _get from 'lodash/get';
import { bindEventFunc } from '@shared/api/listener';

attachStore(store);

import * as trpgApi from '@shared/api/trpg.api';
const api = trpgApi.getInstance();
bindEventFunc.call(api, store, {
  onReceiveMessage(messageData) {
    const sender_uuid = messageData.sender_uuid;
    const message = messageData.message;
    const name =
      _get(store.getState(), ['cache', 'user', sender_uuid, 'nickname']) ??
      _get(store.getState(), ['cache', 'user', sender_uuid, 'username']) ??
      sender_uuid;
    tryLocalNotify(name, message);
  },
});

injectLoginSuccessCallback(() => {
  // 登录成功
  const userUUID = _get(store.getState(), ['user', 'info', 'uuid']);
  bindInfo(userUUID);
});

// token登录
import rnStorage from '@shared/api/rn-storage.api';
import { loginWithToken } from '@src/shared/redux/actions/user';
import ErrorBoundary from '@shared/components/ErrorBoundary';
import ErrorView from './ErrorView';
import TRPGCodePush from './components/TRPGCodePush';
import { initConfig } from '@redux/actions/settings';
import { MsgContainerContextProvider } from '@shared/context/MsgContainerContext';
import { TMemo } from '@shared/components/TMemo';

(async () => {
  console.log('读取本地存储的token...');
  let uuid = await rnStorage.get('uuid');
  let token = await rnStorage.get('token');
  console.log('uuid:', uuid, 'token:', token);
  if (!!token && !!uuid) {
    console.log('尝试登陆uuid:', uuid);
    store.dispatch(loginWithToken(uuid, token));
  }

  // 初始化配置
  store.dispatch(initConfig());
})();

const App: React.FC = TMemo(() => {
  return (
    <ErrorBoundary renderError={ErrorView}>
      <MsgContainerContextProvider>
        {/* MsgContainerContextProvider: 这个Provider因为作用效果在Modal上。放在里面无法获取到上下文。没有办法只能先放在最外面(不好看) */}
        <ReduxProvider store={store}>
          <AntdProvider>
            <ThemeProvider theme={styledTheme}>
              <TRPGCodePush>
                <AppRouter />
              </TRPGCodePush>
            </ThemeProvider>
          </AntdProvider>
        </ReduxProvider>
      </MsgContainerContextProvider>
    </ErrorBoundary>
  );
});
App.displayName = 'App';

export default App;
