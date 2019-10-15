import thunk from 'redux-thunk';
import {
  createStore,
  applyMiddleware,
  Store,
  Middleware,
  StoreEnhancer,
} from 'redux';
import { createLogger } from 'redux-logger';
import config from '../../project.config';
import { getCombineReducers } from '../reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import actionCreators from '../actions';

const logger = createLogger({
  level: 'info',
  logger: console,
  collapsed: true,
  stateTransformer: (state) => state.toJS(),
});
console.log('当前环境:', config.environment);
console.log('当前平台:', config.platform);

const middlewares: Middleware<any, any, any>[] = [thunk];
if (config.environment === 'development') {
  middlewares.push(logger);
}
if (config.platform === 'app') {
  middlewares.push(require('../../../app/src/router').middleware);
}

const defaultStoreOptions = {
  initialState: undefined,
  additionReducer: {},
};

function configureStore(options = defaultStoreOptions): Store<any, any> {
  const initialState = options.initialState;

  let enhancer: StoreEnhancer<any> = applyMiddleware(...middlewares);
  if (config.environment === 'development') {
    // 增加redux-devtools-extension
    enhancer = composeWithDevTools({
      actionCreators,
    })(applyMiddleware(...middlewares));
  }
  const store = createStore(
    getCombineReducers(options.additionReducer),
    initialState,
    enhancer
  );

  return store;
}

export default configureStore;
