import { useValueRef } from '@shared/hooks/useValueRef';
import { useEffect } from 'react';
import { useHark } from './useHark';
import _isNil from 'lodash/isNil';

/**
 * 获取音频轨的音量
 * @param audioTrack 音频轨
 */
export function useAudioVolume(audioTrack: MediaStreamTrack | undefined) {
  const { runHark, stopHark, audioVolume } = useHark();
  const runHarkRef = useValueRef(runHark);
  const stopHarkRef = useValueRef(stopHark);

  useEffect(() => {
    if (_isNil(audioTrack)) {
      return;
    }

    const stream = new MediaStream();
    stream.addTrack(audioTrack);
    runHarkRef.current(stream);

    return () => {
      stopHarkRef.current();
    };
  }, [audioTrack]);

  return audioVolume;
}
