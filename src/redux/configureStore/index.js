import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import config from '../../../config/project.config';
import { getCombineReducers } from '../reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as actionCreators from '../actions';

const logger = createLogger({
  level: 'info',
  logger: console,
  collapsed: true,
  stateTransformer: (state) => state.toJS(),
});
console.log('当前环境:', config.environment);
console.log('当前平台:', config.platform);

let middlewares = [thunk];
if (config.environment !== 'production') {
  middlewares.push(logger);
}
if (config.platform === 'app') {
  middlewares.push(require('../../app/router').routerMiddleware);
}
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

const defaultStoreOptions = {
  initialState: undefined,
  additionReducer: {},
};
function configureStore(options = defaultStoreOptions) {
  const initialState = options.initialState;
  const devTool =
    config.environment !== 'production'
      ? composeWithDevTools({
          actionCreators,
        })(applyMiddleware(thunk))
      : undefined;
  const store = createStoreWithMiddleware(
    getCombineReducers(options.additionReducer),
    initialState,
    devTool
  );

  return store;
}

export default configureStore;
