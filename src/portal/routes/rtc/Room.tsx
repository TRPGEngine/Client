import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useRoomClientContext } from '@src/rtc/RoomContext';
import { Peers } from './Peers';
import { Notifications } from './Notifications';
import SplitPane from '@shared/components/web/SplitPane';
import { MainScreen } from './MainScreen';
import { SelectedPeerContextProvider } from './SelectedPeerContext';

export const Room: React.FC = TMemo(() => {
  useRoomClientContext();

  return (
    <div>
      <SelectedPeerContextProvider>
        <Notifications />

        <SplitPane
          split="vertical"
          primary="second"
          maxSize={600}
          minSize={240}
          defaultSize={300}
        >
          <MainScreen />
          <div>
            <div>Peers:</div>
            <Peers />
          </div>
        </SplitPane>
      </SelectedPeerContextProvider>
    </div>
  );
});
Room.displayName = 'Room';
