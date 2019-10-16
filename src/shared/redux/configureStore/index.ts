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

type TMiddleware = Middleware<any, any, any>;

const middlewares: TMiddleware[] = [thunk];
if (config.environment === 'development') {
  middlewares.push(logger);
}

interface StoreOptions {
  initialState?: {};
  additionReducer?: { [name: string]: (state: any, action: any) => any };
  additionMiddleware?: TMiddleware[];
}
const defaultStoreOptions: StoreOptions = {
  initialState: undefined,
  additionReducer: {},
  additionMiddleware: [],
};

function configureStore(
  options: StoreOptions = defaultStoreOptions
): Store<any, any> {
  const initialState = options.initialState;

  middlewares.push(...options.additionMiddleware); // 增加额外中间件

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
