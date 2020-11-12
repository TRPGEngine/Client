import { useRTCRoomStateSelector } from '@rtc/redux';
import type { ConsumerInfo } from '@rtc/redux/types/consumers';
import { useMemo } from 'react';

export function useRTCPeerConsumers(peerId: string): ConsumerInfo[] {
  const peer = useRTCRoomStateSelector((state) => state.peers[peerId]);
  const consumers = useRTCRoomStateSelector(
    (state) =>
      peer?.consumers.map((consumerId) => state.consumers[consumerId]) ?? []
  );

  return consumers;
}

export function useRTCPeerConsumersAudio(
  peerId: string
): ConsumerInfo | undefined {
  const consumers = useRTCPeerConsumers(peerId);

  return useMemo(
    () => consumers.find((consumer) => consumer.track.kind === 'audio'),
    [consumers]
  );
}

export function useRTCPeerConsumersVideo(
  peerId: string
): ConsumerInfo | undefined {
  const consumers = useRTCPeerConsumers(peerId);

  return useMemo(
    () => consumers.find((consumer) => consumer.track.kind === 'video'),
    [consumers]
  );
}
