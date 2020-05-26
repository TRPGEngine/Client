import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useRoomStateSelector } from '@src/rtc/RoomContext';
import { Peer } from './Peer';
import { shallowEqual } from 'react-redux';

export const Peers = TMemo(() => {
  const peers: any[] = useRoomStateSelector(
    (state) => Object.values(state.peers),
    shallowEqual
  );

  return (
    <div>
      {peers.map((peer) => (
        <Peer key={peer.id} id={peer.id} />
      ))}
    </div>
  );
});
Peers.displayName = 'Peers';
