import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import _isNil from 'lodash/isNil';
import { TMemo } from '@shared/components/TMemo';
import { useAudioVolume } from './rtc/hooks/useAudioVolume';
import { GradientProgress } from './GradientProgress';
import { Button, Space } from 'antd';
import { showToasts } from '@shared/manager/ui';
import { useSystemSetting } from '@redux/hooks/settings';
import { t } from '@shared/i18n';

function useRTCAudioCheck() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioTrackRef = useRef<MediaStreamTrack>();
  const [inited, setIsInited] = useState(false);
  const audioConstraints = useSystemSetting(
    'audioConstraints'
  ) as MediaTrackConstraints;

  useEffect(() => {
    if (_isNil(audioRef.current)) {
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: audioConstraints,
        video: false,
      })
      .then((stream) => {
        audioTrackRef.current = stream.getAudioTracks()[0];

        if (!_isNil(audioRef.current)) {
          audioRef.current.srcObject = stream;
        }

        setIsInited(true);
      })
      .catch(() => {
        showToasts(t('获取用户媒体失败'));
      });

    return () => {
      if (!_isNil(audioTrackRef.current)) {
        audioTrackRef.current.stop();
      }
    };
  }, []);

  const audioEl = useMemo(
    () => <audio ref={audioRef} autoPlay={true} controls={false} />,
    []
  );

  return { inited, audioEl, audioTrackRef };
}

/**
 * 音频播放器
 */
const AudioCheckerPlayer: React.FC<{
  onChangeVolume: (volume: number) => void;
}> = TMemo((props) => {
  const { onChangeVolume } = props;
  const { audioEl, audioTrackRef } = useRTCAudioCheck();
  const volume = useAudioVolume(audioTrackRef.current);

  useEffect(() => {
    onChangeVolume(volume);
  }, [volume, onChangeVolume]);

  return audioEl;
});
AudioCheckerPlayer.displayName = 'AudioCheckerPlayer';

/**
 * 语音检查
 */
export const AudioChecker: React.FC = TMemo(() => {
  const [isChecking, toggleIsChecking] = useReducer((v) => !v, false);
  const [volume, setVolume] = useState(0);

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button type="primary" onClick={toggleIsChecking}>
          {isChecking ? t('关闭麦克风') : t('测试麦克风')}
        </Button>

        <GradientProgress progress={volume * 10} />
      </Space>

      {isChecking && <AudioCheckerPlayer onChangeVolume={setVolume} />}
    </div>
  );
});
AudioChecker.displayName = 'AudioChecker';
