/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
const React = require('react');
const {
  StyleSheet
} = require('react-native');
const configureStore = require('../redux/configureStore');
const store = configureStore();
const { AppWithNavigationState } = require('./router');
const { Provider } = require('react-redux');
require('../shared/utils/cacheHelper').attachStore(store);

const trpgApi = require('../api/trpg.api.js');
const api = trpgApi.getInstance();
trpgApi.bindEventFunc.call(api, store);

// token登录
const rnStorage = require('../api/rnStorage.api.js');
(async () => {
  console.log('读取本地存储的token...');
  let uuid = await rnStorage.get('uuid');
  let token = await rnStorage.get('token');
  console.log('uuid:', uuid, 'token:', token);
  if(!!token && !!uuid) {
    console.log('尝试登陆uuid:', uuid);
    store.dispatch(require('../redux/actions/user').loginWithToken(uuid, token));
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

module.exports = App;
