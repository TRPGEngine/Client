import React, { useContext, useEffect, useMemo } from 'react';
import { RoomClient } from './RoomClient';
import { TMemo } from '@shared/components/TMemo';
import reducers from './redux/reducers';
import {
  applyMiddleware as applyReduxMiddleware,
  createStore as createReduxStore,
  Store,
} from 'redux';
import thunk from 'redux-thunk';

interface RoomContextState {
  client: RoomClient;
  store: Store;
}

const RoomContext = React.createContext<RoomContextState>(null);
RoomContext.displayName = 'RoomContext';

const reduxMiddlewares = [thunk];

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
    <RoomContext.Provider
      value={{
        client: props.roomClient,
        store,
      }}
    >
      {props.children}
    </RoomContext.Provider>
  );
});
RoomClientContextProvider.displayName = 'RoomClientContextProvider';

export function useRoomClientContext(): RoomContextState {
  const context = useContext(RoomContext);

  return context;
}
