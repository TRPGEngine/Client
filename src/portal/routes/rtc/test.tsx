import React, { useRef, useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { RTCContainer } from '@src/rtc';
import { Button } from 'antd';
import { RoomClient } from '@src/rtc/RoomClient';
import { Room } from './Room';

const RTCTest: React.FC = TMemo(() => {
  const roomClientRef = useRef<RoomClient>();

  const handleJoinRoom = useCallback(() => {
    console.log('正在加入房间');
    roomClientRef.current.join().then(() => console.log('加入成功'));
  }, [roomClientRef]);

  return (
    <RTCContainer
      roomId={'dasfals'}
      displayName={'testadmin'}
      device={{ flag: '', name: '', version: '' }}
      roomClientRef={roomClientRef}
    >
      <Room />
      <Button onClick={handleJoinRoom}>加入房间</Button>
    </RTCContainer>
  );
});
RTCTest.displayName = 'RTCTest';

export default RTCTest;
