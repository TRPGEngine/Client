import React, { useEffect, useRef } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useRTCPeerConsumersAudio } from '@rtc/hooks/useRTCPeerConsumers';
import _isNil from 'lodash/isNil';
import { useRTCAudioMuted } from '@rtc/hooks/useRTCAudioMuted';
import { showToasts } from '@shared/manager/ui';
import memoizeOne from 'memoize-one';

// 此处缓存一次
const setupAudio = memoizeOne(
  (
    audioElem: HTMLAudioElement | null,
    audioTrack: MediaStreamTrack | undefined
  ) => {
    if (!_isNil(audioElem)) {
      if (!_isNil(audioTrack)) {
        const stream = new MediaStream();

        stream.addTrack(audioTrack);
        audioElem.srcObject = stream;

        audioElem.play().catch((error) => showToasts(`语音播放失败: ${error}`));
      } else {
        audioElem.srcObject = null;
      }
    }
  }
);

interface VoicePeerProps {
  peerId: string;
}
export const VoicePeer: React.FC<VoicePeerProps> = TMemo((props) => {
  const { peerId } = props;
  const audio = useRTCPeerConsumersAudio(peerId);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioMuted = useRTCAudioMuted();

  useEffect(() => {
    const audioTrack = audio?.track;
    const audioElem = audioRef.current;

    setupAudio(audioElem, audioTrack);
  }, [audioRef.current, audio?.track]);

  if (_isNil(audio)) {
    return null;
  }

  return (
    <div>
      <audio
        ref={audioRef}
        autoPlay={true}
        muted={audioMuted}
        controls={false}
      />
    </div>
  );
});
VoicePeer.displayName = 'VoicePeer';
