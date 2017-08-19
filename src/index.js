const React = require('react');
const ReactDom = require('react-dom');
const immutable = require('immutable');
const { Provider } = require('react-redux');

const configureStore = require('./redux/configureStore');

const App = require('./containers/App');

const store = configureStore();

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


ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#app')
);
