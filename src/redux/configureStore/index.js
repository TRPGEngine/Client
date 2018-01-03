import thunk from 'redux-thunk';
const {createStore, applyMiddleware} = require('redux');
const reducer = require('../reducers');
const { createLogger } = require('redux-logger');
const config = require('../../../config/project.config');

const logger = createLogger({
  level: 'info',
  logger: console,
  collapsed: true,
  stateTransformer: (state) => state.toJS(),
})
console.log('当前环境:', config.environment);
console.log('当前平台:', config.platform);
const createStoreWithMiddleware = config.environment !== 'production' ? applyMiddleware(
  thunk, logger
)(createStore) : applyMiddleware(
  thunk
)(createStore)

function configureStore(initialState) {
  const devTool = config.environment !== 'production'
    ? require('redux-devtools-extension').composeWithDevTools({actionCreators: require('../actions')})(
      applyMiddleware(thunk)
    ) : undefined;
  const store = createStoreWithMiddleware(reducer, initialState, devTool);

  return store;
}

module.exports = configureStore;
