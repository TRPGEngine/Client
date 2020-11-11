import React, { Fragment } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useRTCPeers } from '@rtc/hooks/useRTCPeers';
import { VoicePeer } from './VoicePeer';

/**
 * 全局语音
 * 确保在任何情况下都能保证语音能正常加载
 */
const GlobalVoice: React.FC = TMemo(() => {
  const peers = useRTCPeers();

  return (
    <div>
      {peers.map((peer) => (
        <VoicePeer key={peer.id} peerId={peer.id} />
      ))}
    </div>
  );
});
GlobalVoice.displayName = 'GlobalVoice';

/**
 * 提供全局语音上下文
 */
export const GlobalVoiceProvider: React.FC = TMemo((props) => {
  return (
    <Fragment>
      <GlobalVoice />
      {props.children}
    </Fragment>
  );
});
GlobalVoiceProvider.displayName = 'GlobalVoiceProvider';
