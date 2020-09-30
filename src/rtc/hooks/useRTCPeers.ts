import { useRTCRoomStateSelector } from '@rtc/redux';
import { shallowEqual } from 'react-redux';

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
