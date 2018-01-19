/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

const React = require('react');
const {
  Platform,
  StyleSheet,
  Text,
  View
} = require('react-native');
const { AppWithNavigationState } = require('./router');
const { Provider } = require('react-redux');
const configureStore = require('../redux/configureStore');
const store = configureStore();

const trpgApi = require('../api/trpg.api.js');
const api = trpgApi.getInstance();
trpgApi.bindEventFunc.call(api, store);

// token登录
const rnStorage = require('../api/rnStorage.api.js');
(async () => {
  let uuid = await rnStorage.get('uuid');
  let token = await rnStorage.get('token');
  if(!!token && !!uuid) {
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
