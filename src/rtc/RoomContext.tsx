import React, { useRef, useContext, useState, useCallback } from 'react';
import { RoomClient } from './RoomClient';
import { TMemo } from '@shared/components/TMemo';
import _once from 'lodash/once';
import _noop from 'lodash/noop';
import _isNil from 'lodash/isNil';
import type { RoomClientOptions } from './type';
import { getStore, RoomReduxProvider } from './redux';

interface RTCRoomClientContextState {
  client: RoomClient | undefined;
  createClient: (options: RoomClientOptions) => void;
}

const RTCRoomClientContext = React.createContext<RTCRoomClientContextState>({
  client: undefined,
  createClient: _noop,
});
RTCRoomClientContext.displayName = 'RTCRoomClientContext';

const initRoomClientStore = _once(() => {
  RoomClient.init({
    store: getStore(),
  });
});
export const RTCRoomClientContextProvider: React.FC = TMemo((props) => {
  const [client, setClient] = useState<RoomClient>();

  const createClient = useCallback(
    (options: RoomClientOptions) => {
      initRoomClientStore();

      if (!_isNil(client)) {
        client.close();
      }

      const newClient = new RoomClient(options);
      newClient.join();
      setClient(newClient);
    },
    [client]
  );

  return (
    <RTCRoomClientContext.Provider value={{ client, createClient }}>
      <RoomReduxProvider>{props.children}</RoomReduxProvider>
    </RTCRoomClientContext.Provider>
  );
});
RTCRoomClientContextProvider.displayName = 'RTCRoomClientContextProvider';

export function useRTCRoomClientContext(): RTCRoomClientContextState {
  const context = useContext(RTCRoomClientContext);

  return context;
}

export function useRTCRoomClientRef(): React.MutableRefObject<
  RoomClient | undefined
> {
  const { client } = useRTCRoomClientContext();

  const clientRef = useRef(client);
  clientRef.current = client;

  return clientRef;
}
