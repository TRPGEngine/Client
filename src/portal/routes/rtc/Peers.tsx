import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useRoomStateSelector } from '@src/rtc/RoomContext';
import { Peer } from './Peer';
import { shallowEqual } from 'react-redux';

export const Peers = TMemo((props) => {
  const peers: any[] = useRoomStateSelector(
    (state) => Object.values(state.peers),
    shallowEqual
  );
  const activeSpeakerId = useRoomStateSelector(
    (state) => state.room.activeSpeakerId
  );

  return (
    <div data-component="Peers">
      {peers.map((peer) => {
        return (
          <div key={peer.id}>
            {peer.id && activeSpeakerId && <div>正在发言</div>}
            <Peer id={peer.id} />
          </div>
        );
      })}
    </div>
  );
});
