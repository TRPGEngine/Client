import React, { useMemo, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useRTCRoomClientContext } from '@rtc/RoomContext';
import { useAsyncTimeout } from '@shared/hooks/useAsyncTimeout';
import _get from 'lodash/get';
import filesize from 'filesize';

/**
 * 获取传输速度字符串
 * @param bitrate 比特率
 */
function getStreamRate(bitrate: number): string {
  return filesize(Number(bitrate) / 8, { bits: true }) + '/s';
}

export const VoiceNetwork: React.FC = TMemo(() => {
  const { client } = useRTCRoomClientContext();
  const [remoteStats, setRemoteStats] = useState<any>({});

  useAsyncTimeout(async () => {
    if (client) {
      const sendRemoteStats = await client
        .getSendTransportRemoteStats()
        .catch(() => {});
      const recvRemoteStats = await client
        .getRecvTransportRemoteStats()
        .catch(() => {});

      setRemoteStats({
        sendRemoteStats,
        recvRemoteStats,
      });
    }
  }, 2000);

  const bitrate = useMemo(() => {
    return {
      // 即生产者的传输通道在远程接收到的信息
      upstream: getStreamRate(
        _get(remoteStats, ['sendRemoteStats', 0, 'recvBitrate'], 0)
      ),
      // 即消费者的传输通道在远程发送的信息
      downstream: getStreamRate(
        _get(remoteStats, ['recvRemoteStats', 0, 'sendBitrate'], 0)
      ),
    };
  }, [remoteStats]);

  return (
    <pre>
      上传: {bitrate.upstream} 下载: {bitrate.downstream}
    </pre>
  );
});
VoiceNetwork.displayName = 'VoiceNetwork';
