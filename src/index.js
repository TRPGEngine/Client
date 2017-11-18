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

// token登录
const sessionStorage = require('./api/sessionStorage.api.js');
let uuid = sessionStorage.get('uuid');
let token = sessionStorage.get('token');
if(!!token && !!uuid) {
  store.dispatch(require('./redux/actions/user').loginWithToken(uuid, token));
}

// 检查版本
const checkVersion = require('./utils/checkVersion.js');
checkVersion(function(isLatest) {
  if(isLatest) {
    console.log('当前版本为最新版');
  }else {
    store.dispatch(require('./redux/actions/ui').showAlert({
      title: '检测到新版本',
      content: '检测到有新的版本, 是否现在获取',
      onConfirm: () => {
        window.open("https://github.com/TRPGEngine/Client");
      }
    }));
  }
})

const App = require('./containers/App');
ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#app')
);
