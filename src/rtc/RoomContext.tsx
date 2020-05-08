import React, { useContext, useReducer } from 'react';
import { RoomClient } from './RoomClient';
import { TMemo } from '@shared/components/TMemo';
import reducers from './redux/reducers';

interface RoomContextState {
  client: RoomClient;
  state: any;
  dispatch: any;
}

const RoomContext = React.createContext<RoomContextState>(null);
RoomContext.displayName = 'RoomContext';

export const RoomClientContextProvider: React.FC<{
  roomClient: RoomClient;
}> = TMemo((props) => {
  const [state, dispatch] = useReducer(reducers, null);

  return (
    <RoomContext.Provider
      value={{
        client: props.roomClient,
        state,
        dispatch,
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
