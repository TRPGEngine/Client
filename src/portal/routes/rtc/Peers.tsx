import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useRoomStateSelector } from '@src/rtc/RoomContext';
import { Peer } from './Peer';
import { shallowEqual } from 'react-redux';
import styled from 'styled-components';
import { useSelectedPeerContext } from './SelectedPeerContext';

const PeerItem = styled.div<{
  selected: boolean;
}>`
  background-color: ${(props) =>
    props.selected ? props.theme.color['transparent90'] : 'transparent'};
`;

export const Peers = TMemo(() => {
  const peers: any[] = useRoomStateSelector(
    (state) => Object.values(state.peers),
    shallowEqual
  );
  const { selectedPeerId, setSelectedPeerId } = useSelectedPeerContext();
  const handleSelect = useCallback(
    (peerId: string) => {
      setSelectedPeerId(peerId);
    },
    [setSelectedPeerId]
  );

  return (
    <div>
      {peers.map((peer) => (
        <PeerItem
          selected={selectedPeerId === peer.id}
          onClick={() => handleSelect(peer.id)}
        >
          <Peer key={peer.id} id={peer.id} />
        </PeerItem>
      ))}
    </div>
  );
});
Peers.displayName = 'Peers';
