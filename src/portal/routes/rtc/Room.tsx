import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useRoomClientContext } from '@src/rtc/RoomContext';
import { Me } from './Me';
import { Peers } from './Peers';
import { Notifications } from './Notifications';

export const Room: React.FC = TMemo(() => {
  useRoomClientContext();

  return (
    <div>
      <Notifications />
      <div>Me:</div>
      <Me />

      <div>=====================</div>
      <div>Peers:</div>
      <Peers />
    </div>
  );
});
Room.displayName = 'Room';
