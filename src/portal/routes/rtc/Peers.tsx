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

  return (
    <div data-component="Peers">
      {peers.map((peer) => {
        return (
          <div key={peer.id}>
            <Peer id={peer.id} />
          </div>
        );
      })}
    </div>
  );
});
