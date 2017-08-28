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
//
// setTimeout(function() {
//   console.time('hello');
//   api.emit('hello', {a:1, b:3}, function(data) {
//     console.timeEnd('hello');
//     console.log('self', data);
//   })
// },1000);
const App = require('./containers/App');

const sessionStorage = require('./api/sessionStorage.api.js');
let uuid = sessionStorage.get('uuid');
let token = sessionStorage.get('token');
if(!!token && !!uuid) {
  api.emit('player::loginWithToken', {uuid, token}, function(data) {
    if(data.result) {
      store.dispatch({type:LOGIN_SUCCESS, payload: data.info});
    }else {
      console.log(data);
    }
  })
}

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#app')
);
