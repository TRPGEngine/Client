import thunk from 'redux-thunk';
const {createStore, applyMiddleware} = require('redux');
const reducer = require('../reducers');
const { createLogger } = require('redux-logger');

const logger = createLogger({
  level: 'info',
  logger: console,
  collapsed: true,
  stateTransformer: (state) => state.toJS(),
})
console.log('当前环境:', process.env.NODE_ENV);
console.log('当前平台:', process.env.PLATFORM);
const createStoreWithMiddleware = process.env.NODE_ENV !== 'production' ? applyMiddleware(
  thunk, logger
)(createStore) : applyMiddleware(
  thunk
)(createStore)

function configureStore(initialState) {
  const store = createStoreWithMiddleware(reducer, initialState);

  return store;
}

module.exports = configureStore;
