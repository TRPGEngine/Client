import React, { useRef, useContext, useState, useCallback } from 'react';
import { RoomClient } from './RoomClient';
import { TMemo } from '@shared/components/TMemo';
import _once from 'lodash/once';
import _noop from 'lodash/noop';
import _isNil from 'lodash/isNil';
import type { RoomClientOptions } from './type';
import { getStore, RTCRoomReduxProvider } from './redux';
import { trackEvent } from '@web/utils/analytics-helper';

interface RTCRoomClientContextState {
  client: RoomClient | undefined;
  createClient: (options: RoomClientOptions) => Promise<void>;
  deleteClient: () => void;
}

const RTCRoomClientContext = React.createContext<RTCRoomClientContextState>({
  client: undefined,
  createClient: async () => {},
  deleteClient: async () => {},
});
RTCRoomClientContext.displayName = 'RTCRoomClientContext';

const initRoomClientStore = () => {
  RoomClient.init({
    store: getStore(),
  });
};
export const RTCRoomClientContextProvider: React.FC = TMemo((props) => {
  const [client, setClient] = useState<RoomClient>();

  const deleteClient = useCallback(() => {
    if (!_isNil(client)) {
      trackEvent('rtc:leaveRoom', {
        roomId: client.roomId,
      });
      client.close();
    }

    setClient(undefined);
  }, [client]);

  const createClient = useCallback(
    async (options: RoomClientOptions) => {
      initRoomClientStore();

      if (!_isNil(client)) {
        // 关闭上一个连接
        deleteClient();
      }

      trackEvent('rtc:joinRoom', {
        roomId: options.roomId,
      });

      const newClient = new RoomClient(options);
      await newClient.join();
      setClient(newClient);
    },
    [client, deleteClient]
  );

  return (
    <RTCRoomClientContext.Provider
      value={{ client, createClient, deleteClient }}
    >
      <RTCRoomReduxProvider>{props.children}</RTCRoomReduxProvider>
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
