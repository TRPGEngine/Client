import thunk from 'redux-thunk';
const {createStore, applyMiddleware} = require('redux');
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

let middlewares = [
  thunk,
];
if(config.environment !== 'production') {
  middlewares.push(logger);
}
if(config.platform === 'app') {
  const routerMiddleware = require('../../app/router').middleware;
  middlewares.push(routerMiddleware);
}
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

function configureStore(initialState) {
  const devTool = config.environment !== 'production'
    ? require('redux-devtools-extension').composeWithDevTools({actionCreators: require('../actions')})(
      applyMiddleware(thunk)
    ) : undefined;
  const reducers = require('../reducers');
  const store = createStoreWithMiddleware(reducers, initialState, devTool);

  return store;
}

module.exports = configureStore;
