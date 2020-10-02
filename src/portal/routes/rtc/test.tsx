import React, { useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Room } from './Room';
import {
  RTCRoomClientContextProvider,
  useRTCRoomClientContext,
} from '@rtc/RoomContext';
import shortid from 'shortid';
import { getUrlQuerySeach } from '@web/utils/url-helper';

const RTCTest: React.FC = TMemo(() => {
  const { createClient } = useRTCRoomClientContext();

  useEffect(() => {
    const roomId = getUrlQuerySeach('room') ?? 'testroom';
    const peerId = shortid();

    console.log('正在加入房间');
    createClient({
      roomId,
      peerId,
      displayName: peerId,
      device: { name: '', flag: '', version: '' },
    }).then(() => console.log('加入成功'));
  }, []);

  return <Room />;
});
RTCTest.displayName = 'RTCTest';

export default () => {
  return (
    <RTCRoomClientContextProvider>
      <RTCTest />
    </RTCRoomClientContextProvider>
  );
};
