require('./utils/common');
require('moment').locale('zh_CN');
const React = require('react');
const ReactDom = require('react-dom');
const immutable = require('immutable');
const { Provider } = require('react-redux');
const { LOGIN_SUCCESS } = require('./redux/constants');
const configureStore = require('./redux/configureStore');
const store = configureStore();
require('./utils/usercache').attachStore(store);

const trpgApi = require('./api/trpg.api.js');
const api = trpgApi.getInstance();
trpgApi.bindEventFunc.call(api, store);

const sessionStorage = require('./api/sessionStorage.api.js');
let uuid = sessionStorage.get('uuid');
let token = sessionStorage.get('token');
if(!!token && !!uuid) {
  store.dispatch(require('./redux/actions/user').loginWithToken(uuid, token));
}

const App = require('./containers/App');
ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#app')
);
