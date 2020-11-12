import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Peer } from './Peer';
import styled from 'styled-components';
import { useSelectedPeerContext } from './SelectedPeerContext';
import { useRTCPeers } from '@src/rtc/hooks/useRTCPeers';

const PeerItem = styled.div<{
  selected: boolean;
}>`
  background-color: ${(props) =>
    props.selected ? props.theme.color['transparent90'] : 'transparent'};
`;

export const Peers = TMemo(() => {
  const peers = useRTCPeers();
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
          key={peer.id}
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
