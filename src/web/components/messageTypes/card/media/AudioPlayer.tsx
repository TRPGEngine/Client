import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import TLoadable from '@web/components/TLoadable';
import 'react-h5-audio-player/lib/styles.css';
import { RHAP_UI } from 'react-h5-audio-player';
const ReactAudioPlayer = TLoadable(() => import('react-h5-audio-player'));
import './AudioPlayer.less';

// Document: https://static.hanzluo.com/react-h5-audio-player-storybook/index.html?path=/docs/layouts-advanced--stacked

interface Props {
  url: string;
}
const AudioPlayer: React.FC<Props> = TMemo((props) => {
  return (
    <ReactAudioPlayer
      autoPlay={false}
      autoPlayAfterSrcChange={false}
      src={props.url}
      onPlay={(e) => console.log('onPlay')}
      showSkipControls={false}
      showJumpControls={false}
      customProgressBarSection={[
        RHAP_UI.PROGRESS_BAR,
        RHAP_UI.CURRENT_TIME,
        <span key="split">/</span>,
        RHAP_UI.DURATION,
      ]}
      customControlsSection={[
        RHAP_UI.MAIN_CONTROLS,
        RHAP_UI.ADDITIONAL_CONTROLS,
        RHAP_UI.VOLUME_CONTROLS,
      ]}
      customAdditionalControls={[]}
    />
  );
});
AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;
