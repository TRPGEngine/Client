import { shallowEqual } from 'react-redux';
import { useRTCRoomStateSelector } from '../RoomContext';

/**
 * 获取当前连接端口列表
 */
export function useRTCPeers() {
  const peers = useRTCRoomStateSelector(
    (state) => Object.values(state.peers),
    shallowEqual
  );

  return peers;
}
