import { useDispatch, useSelector } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from '../slices';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const middlewares = [thunkMiddleware];

if (
  process.env.NODE_ENV === 'development' &&
  process.env.TARO_ENV !== 'quickapp'
) {
  middlewares.push(require('redux-logger').createLogger());
}

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares)
  // other store enhancers if any
);

function configStore() {
  const store = createStore(rootReducer, enhancer);
  return store;
}

export const store = configStore();
export type TaroState = ReturnType<typeof store.getState>;
export type TaroDispatch = typeof store.dispatch;
export const useTaroSelector = <T>(
  selector: (state: TaroState) => T,
  equalityFn?: (left: T, right: T) => boolean
) => {
  return useSelector<TaroState, T>(selector, equalityFn);
};

export const useTaroDispatch = () => useDispatch<TaroDispatch>();
