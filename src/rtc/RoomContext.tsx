import React, { useRef, useContext, useState, useCallback } from 'react';
import type { RoomClient as RoomClientCls } from './RoomClient';
import { TMemo } from '@shared/components/TMemo';
import _once from 'lodash/once';
import _noop from 'lodash/noop';
import _isNil from 'lodash/isNil';
import type { RoomClientOptions } from './type';
import { getStore, RTCRoomReduxProvider } from './redux';
import { trackEvent } from '@web/utils/analytics-helper';

interface RTCRoomClientContextState {
  client: RoomClientCls | undefined;
  createClient: (options: RoomClientOptions) => Promise<void>;
  deleteClient: () => void;
}

const RTCRoomClientContext = React.createContext<RTCRoomClientContextState>({
  client: undefined,
  createClient: async () => {},
  deleteClient: async () => {},
});
RTCRoomClientContext.displayName = 'RTCRoomClientContext';

export const RTCRoomClientContextProvider: React.FC = TMemo((props) => {
  const [client, setClient] = useState<RoomClientCls>();

  const deleteClient = useCallback(async () => {
    if (!_isNil(client)) {
      trackEvent('rtc:leaveRoom', {
        roomId: client.roomId,
      });
      await client.close();
    }

    setClient(undefined);
  }, [client]);

  const createClient = useCallback(
    async (options: RoomClientOptions) => {
      const { RoomClient } = await import('./RoomClient');
      RoomClient.init({
        store: getStore(),
      });

      if (!_isNil(client)) {
        // 关闭上一个连接
        await deleteClient();
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
  RoomClientCls | undefined
> {
  const { client } = useRTCRoomClientContext();

  const clientRef = useRef(client);
  clientRef.current = client;

  return clientRef;
}
