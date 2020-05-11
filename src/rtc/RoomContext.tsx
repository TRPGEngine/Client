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
} from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

interface RoomClientContextState {
  client: RoomClient;
}

const RoomClientContext = React.createContext<RoomClientContextState>(null);
RoomClientContext.displayName = 'RoomClientContext';

const RoomReduxContext = React.createContext(null);
RoomReduxContext.displayName = 'RoomReduxContext';

const reduxMiddlewares: Middleware[] = [thunk];

if (window.localStorage.getItem('__rtc_debug') === 'true') {
  // 特殊标识下增加redux日志
  const logger = createLogger({
    level: 'info',
    logger: console,
    collapsed: true,
    titleFormatter(action: any, time?: string, took?: number) {
      return `rtc-action @ ${action.type} (in ${took.toFixed(2)} ms)`;
    },
  });
  reduxMiddlewares.push(logger);
}

export const RoomClientContextProvider: React.FC<{
  roomClient: RoomClient;
}> = TMemo((props) => {
  const store = useMemo(() => {
    return createReduxStore(
      reducers,
      undefined,
      applyReduxMiddleware(...reduxMiddlewares)
    );
  }, []);

  useEffect(() => {
    RoomClient.init({
      store: store,
    });
  }, []);

  return (
    <RoomClientContext.Provider
      value={{
        client: props.roomClient,
      }}
    >
      <ReduxProvider store={store} context={RoomReduxContext}>
        {props.children}
      </ReduxProvider>
    </RoomClientContext.Provider>
  );
});
RoomClientContextProvider.displayName = 'RoomClientContextProvider';

export function useRoomClientContext(): RoomClientContextState['client'] {
  const { client } = useContext(RoomClientContext);

  return client;
}

type UseRoomStateSelector = <TState = any, TSelected = unknown>(
  selector: (state: TState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) => TSelected;
export const useRoomStateSelector: UseRoomStateSelector = createSelectorHook(
  RoomReduxContext
);

export const useRoomStateDispatch = createDispatchHook(RoomReduxContext);
