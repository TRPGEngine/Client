import React from 'react';
import configureStore from '../../shared/redux/configureStore';
import navReducer from './redux/reducers/nav';
const store = configureStore({
  additionReducer: {
    nav: navReducer,
  },
} as any);
import { AppWithNavigationState } from './router';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as AntdProvider } from '@ant-design/react-native';
import { ThemeProvider } from 'styled-components/native';
import { injectLoginSuccessCallback } from '../../shared/utils/inject';
import { bindInfo, tryLocalNotify } from './notify';
import codePush from 'react-native-code-push';
import appConfig from './config.app';
import { attachStore } from '../../shared/utils/cache-helper';
import styledTheme from '@src/shared/utils/theme';

attachStore(store);

import * as trpgApi from '../../shared/api/trpg.api';
const api = trpgApi.getInstance();
trpgApi.bindEventFunc.call(api, store, {
  onReceiveMessage(messageData) {
    const sender_uuid = messageData.sender_uuid;
    const message = messageData.message;
    const name =
      store.getState().getIn(['cache', 'user', sender_uuid, 'nickname']) ||
      store.getState().getIn(['cache', 'user', sender_uuid, 'username']) ||
      sender_uuid;
    tryLocalNotify(name, message);
  },
});

injectLoginSuccessCallback(() => {
  // 登录成功
  const userUUID = store.getState().getIn(['user', 'info', 'uuid']);
  bindInfo(userUUID);
});

// token登录
import rnStorage from '../../shared/api/rn-storage.api';
import { loginWithToken } from '@src/shared/redux/actions/user';
(async () => {
  console.log('读取本地存储的token...');
  let uuid = await rnStorage.get('uuid');
  let token = await rnStorage.get('token');
  console.log('uuid:', uuid, 'token:', token);
  if (!!token && !!uuid) {
    console.log('尝试登陆uuid:', uuid);
    store.dispatch(loginWithToken(uuid, token));
  }
})();

class App extends React.Component {
  render() {
    return (
      <ReduxProvider store={store}>
        <AntdProvider>
          <ThemeProvider theme={styledTheme}>
            <AppWithNavigationState />
          </ThemeProvider>
        </AntdProvider>
      </ReduxProvider>
    );
  }
}

let out = App;
if (appConfig.codePush.enabled) {
  out = codePush(appConfig.codePush.options)(App);
}

export default out;
