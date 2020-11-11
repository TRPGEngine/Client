import { useValueRef } from '@shared/hooks/useValueRef';
import hark from 'hark';
import { useCallback, useRef, useState } from 'react';
import _isNil from 'lodash/isNil';

interface UseHarkRet {
  audioVolume: number;
  runHark: (stream: MediaStream) => void;
  stopHark: () => void;
}

export function useHark(): UseHarkRet {
  const harkRef = useRef<hark.Harker>();
  const [audioVolume, setAudioVolume] = useState(0);
  const audioVolumeRef = useValueRef(audioVolume);

  const stopHark = useCallback(() => {
    if (!_isNil(harkRef.current)) {
      // 如果之前的实例还存在的话
      harkRef.current.stop();
    }
  }, []);

  const runHark = useCallback(
    (stream: MediaStream) => {
      if (!stream.getAudioTracks()[0]) {
        throw new Error('runHark() | 无法从流中获取音频轨');
      }

      stopHark();

      harkRef.current = hark(stream, { play: false, interval: 100 });

      harkRef.current.on('volume_change', (dBs, threshold) => {
        // The exact formula to convert from dBs (-100..0) to linear (0..1) is:
        //   Math.pow(10, dBs / 20)
        // However it does not produce a visually useful output, so let exagerate
        // it a bit. Also, let convert it from 0..1 to 0..10 and avoid value 1 to
        // minimize component renderings.
        let _audioVolume = Math.round(Math.pow(10, dBs / 85) * 10);

        if (_audioVolume === 1) {
          _audioVolume = 0;
        }

        if (_audioVolume !== audioVolumeRef.current) {
          setAudioVolume(_audioVolume);
        }
      });

      harkRef.current.on('stopped_speaking', () => {
        setAudioVolume(0);
      });
    },
    [stopHark]
  );

  return { runHark, stopHark, audioVolume };
}
