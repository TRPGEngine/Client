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
import { memoryLogger } from './memory-logger';
import { initStoreHelper } from './helper';
import { TRPGStore } from '@redux/types/__all__';

const logger = createLogger({
  level: 'info',
  logger: console,
  collapsed: true,
});
console.log('当前环境:', config.environment);
console.log('当前平台:', config.platform);

type TMiddleware = Middleware<any, any, any>;

const middlewares: TMiddleware[] = [thunk];
middlewares.push(memoryLogger);

if (config.environment === 'development' && config.platform !== 'app') {
  // 移动端不启用logger. 因为远程js调试会非常卡
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
): TRPGStore {
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

  initStoreHelper(store); // 注册Helper

  return store;
}

export default configureStore;
