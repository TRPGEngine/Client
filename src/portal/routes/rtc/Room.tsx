import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useRoomClientContext } from '@src/rtc/RoomContext';
import { Peers } from './Peers';
import { Notifications } from './Notifications';
import SplitPane from '@shared/components/web/SplitPane';
import { MainScreen } from './MainScreen';

export const Room: React.FC = TMemo(() => {
  useRoomClientContext();

  return (
    <div>
      <Notifications />

      <SplitPane
        split="vertical"
        primary="second"
        maxSize={600}
        defaultSize={300}
      >
        <MainScreen />
        <div>
          <div>Peers:</div>
          <Peers />
        </div>
      </SplitPane>
    </div>
  );
});
Room.displayName = 'Room';
