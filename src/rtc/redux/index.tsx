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
import { RTC_DEBUG } from '@shared/utils/consts';
import _get from 'lodash/get';

const reduxMiddlewares: Middleware[] = [thunk];

const store = createReduxStore(
  reducers,
  undefined,
  applyReduxMiddleware(...reduxMiddlewares)
);
const RTCRoomReduxContext = React.createContext<ReactReduxContextValue>({
  store,
  storeState: undefined,
});
RTCRoomReduxContext.displayName = 'RTCRoomReduxContext';

if (_get(window, ['localStorage', RTC_DEBUG]) === 'true') {
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

export const RTCRoomReduxProvider: React.FC = TMemo((props) => {
  return (
    <ReduxProvider store={store} context={RTCRoomReduxContext}>
      {props.children}
    </ReduxProvider>
  );
});
RTCRoomReduxProvider.displayName = 'RTC(RTCRoomReduxProvider)';

export function getStore() {
  return store;
}

type UseRTCRoomStateSelector = <TSelected = unknown>(
  selector: (state: AllRTCStateType) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) => TSelected;
export const useRTCRoomStateSelector: UseRTCRoomStateSelector = createSelectorHook(
  RTCRoomReduxContext
);
export const useRTCRoomStateDispatch = createDispatchHook(RTCRoomReduxContext);
