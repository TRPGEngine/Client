import React from 'react';
import {
  applyMiddleware as applyReduxMiddleware,
  createStore as createReduxStore,
  Middleware,
} from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { TMemo } from '@shared/components/TMemo';
import {
  Provider as ReduxProvider,
  createSelectorHook,
  createDispatchHook,
  ReactReduxContextValue,
} from 'react-redux';
import type { AllRTCStateType } from './types';

const reduxMiddlewares: Middleware[] = [thunk];

const store = createReduxStore(
  reducers,
  undefined,
  applyReduxMiddleware(...reduxMiddlewares)
);
const RoomReduxContext = React.createContext<ReactReduxContextValue>({
  store,
  storeState: undefined,
});
RoomReduxContext.displayName = 'RoomReduxContext';

if (window.localStorage.getItem('__rtc_debug') === 'true') {
  // 特殊标识下增加redux日志
  const logger = createLogger({
    level: 'info',
    logger: console,
    collapsed: true,
    titleFormatter(action: any, time, took) {
      return `rtc-action @ ${action.type} (in ${took.toFixed(2)} ms)`;
    },
  });
  reduxMiddlewares.push(logger);
}

export const RoomReduxProvider: React.FC = TMemo((props) => {
  return (
    <ReduxProvider store={store} context={RoomReduxContext}>
      {props.children}
    </ReduxProvider>
  );
});
RoomReduxProvider.displayName = 'RoomReduxProvider';

export function getStore() {
  return store;
}

type UseRTCRoomStateSelector = <TSelected = unknown>(
  selector: (state: AllRTCStateType) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) => TSelected;
export const useRTCRoomStateSelector: UseRTCRoomStateSelector = createSelectorHook(
  RoomReduxContext
);
export const useRTCRoomStateDispatch = createDispatchHook(RoomReduxContext);
