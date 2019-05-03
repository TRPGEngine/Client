import React from 'react';
import { StyleSheet } from 'react-native';
import configureStore from '../redux/configureStore';
import navReducer from '../redux/reducers/nav';
const store = configureStore({
  additionReducer: {
    nav: navReducer,
  },
});
import { AppWithNavigationState } from './router';
import { Provider } from 'react-redux';
require('../shared/utils/cacheHelper').attachStore(store);

import * as trpgApi from '../api/trpg.api.js';
const api = trpgApi.getInstance();
trpgApi.bindEventFunc.call(api, store);

import { injectLoginSuccessCallback } from '../shared/utils/inject';
import { init as initNotify, setAlias } from './notify';
initNotify();
injectLoginSuccessCallback(() => {
  // 登录成功
  const userUUID = store.getState().getIn(['user', 'info', 'uuid']);
  setAlias(userUUID);
});

// token登录
import rnStorage from '../api/rnStorage.api.js';
(async () => {
  console.log('读取本地存储的token...');
  let uuid = await rnStorage.get('uuid');
  let token = await rnStorage.get('token');
  console.log('uuid:', uuid, 'token:', token);
  if (!!token && !!uuid) {
    console.log('尝试登陆uuid:', uuid);
    store.dispatch(
      require('../redux/actions/user').loginWithToken(uuid, token)
    );
  }
})();

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default App;
