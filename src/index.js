const React = require('react');
const ReactDom = require('react-dom');
const immutable = require('immutable');
const { Provider } = require('react-redux');
const { Route, Redirect, IndexRoute, BrowserRouter, Link } = require('react-router-dom');

const configureStore = require('./redux/configureStore');

const App = require('./containers/App');

// const initialState = immutable.Map();
const store = configureStore();

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#app')
);
