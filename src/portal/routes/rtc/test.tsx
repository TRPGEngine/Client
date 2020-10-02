import React, { useRef, useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { RTCContainer } from '@src/rtc';
import { RoomClient } from '@src/rtc/RoomClient';
import { Room } from './Room';

const RTCTest: React.FC = TMemo(() => {
  const roomClientRef = useRef<RoomClient>();

  useEffect(() => {
    console.log('正在加入房间');
    roomClientRef.current?.join().then(() => console.log('加入成功'));
  }, []);

  return (
    <RTCContainer
      roomId={'dasfals'}
      displayName={'testadmin'}
      device={{ flag: '', name: '', version: '' }}
      roomClientRef={roomClientRef}
    >
      <Room />
    </RTCContainer>
  );
});
RTCTest.displayName = 'RTCTest';

export default RTCTest;
