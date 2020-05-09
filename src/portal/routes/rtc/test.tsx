import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { RTCContainer } from '@src/rtc';

const RTCTest: React.FC = TMemo(() => {
  return (
    <RTCContainer
      roomId={'dasfals'}
      displayName={'testadmin'}
      device={{ flag: '', name: '', version: '' }}
    >
      <div>aaa</div>
    </RTCContainer>
  );
});
RTCTest.displayName = 'RTCTest';

export default RTCTest;
