import React, { useEffect, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { RoomClient } from './RoomClient';
import shortid from 'shortid';
import { RTCRoomClientContextProvider } from './RoomContext';
import _isNil from 'lodash/isNil';
import { RoomClientOptions } from './type';

type RTCContainerProps = Partial<Omit<RoomClientOptions, 'peerId'>> &
  Pick<RoomClientOptions, 'roomId' | 'displayName' | 'device'> & {
    roomClientRef?: React.MutableRefObject<RoomClient | undefined>;
  };
/**
 * @deprecated
 */
export const RTCContainer: React.FC<RTCContainerProps> = TMemo((props) => {
  const {
    roomId,
    displayName,
    device,
    forceTcp = false,
    produce = true,
    consume = true,
    forceH264 = false,
    forceVP9 = false,
    datachannel = true,
    externalVideo = false,
  } = props;
  const [roomClient, setRoomClient] = useState<RoomClient | null>(null);
  useEffect(() => {
    const peerId = shortid.generate();
    const client = new RoomClient({
      roomId,
      peerId,
      displayName,
      device,
      forceTcp,
      produce,
      consume,
      forceH264,
      forceVP9,
      datachannel,
      externalVideo,
    });
    setRoomClient(client);

    if (!_isNil(props.roomClientRef)) {
      props.roomClientRef.current = client;
    }
  }, []);

  return (
    // <RTCRoomClientContextProvider roomClient={roomClient}>
    <RTCRoomClientContextProvider>
      {props.children}
    </RTCRoomClientContextProvider>
  );
});
RTCContainer.displayName = 'RTCContainer';
