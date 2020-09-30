import React, { useContext, useEffect, useMemo } from 'react';
import { RoomClient } from './RoomClient';
import { TMemo } from '@shared/components/TMemo';
import reducers from './redux/reducers';
import {
  applyMiddleware as applyReduxMiddleware,
  createStore as createReduxStore,
  Middleware,
} from 'redux';
import {
  Provider as ReduxProvider,
  createSelectorHook,
  createDispatchHook,
  ReactReduxContextValue,
} from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { AllRTCStateType } from './redux/types';

interface RTCRoomClientContextState {
  client: RoomClient;
}

const RTCRoomClientContext = React.createContext<RTCRoomClientContextState | null>(
  null
);
RTCRoomClientContext.displayName = 'RTCRoomClientContext';

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

export const RTCRoomClientContextProvider: React.FC<{
  roomClient: RoomClient;
}> = TMemo((props) => {
  useEffect(() => {
    RoomClient.init({
      store,
    });
  }, []);

  return (
    <RTCRoomClientContext.Provider
      value={useMemo(
        () => ({
          client: props.roomClient,
        }),
        []
      )}
    >
      <ReduxProvider store={store} context={RoomReduxContext}>
        {props.children}
      </ReduxProvider>
    </RTCRoomClientContext.Provider>
  );
});
RTCRoomClientContextProvider.displayName = 'RTCRoomClientContextProvider';

export function useRTCRoomClientContext():
  | RTCRoomClientContextState['client']
  | undefined {
  const context = useContext(RTCRoomClientContext);

  return context?.client;
}

type UseRTCRoomStateSelector = <TSelected = unknown>(
  selector: (state: AllRTCStateType) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) => TSelected;
export const useRTCRoomStateSelector: UseRTCRoomStateSelector = createSelectorHook(
  RoomReduxContext
);

export const useRTCRoomStateDispatch = createDispatchHook(RoomReduxContext);
