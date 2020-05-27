import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import copy from 'copy-to-clipboard';
import hark from 'hark';
import Logger from '@src/rtc/Logger';
import Spinner from '@web/components/Spinner';
import { Tooltip, Input, Button, Space } from 'antd';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { VolumeInspector } from './VolumeInspector';
import { useRoomStateSelector } from '@src/rtc/RoomContext';

const logger = new Logger('PeerView');

const PeerViewContainer = styled.div<{
  isActiveSpeaker: boolean;
}>`
  position: relative;
  border: 1px solid transparent;
  ${(props) =>
    props.isActiveSpeaker ? `border-color: ${props.theme.color['tacao']}` : ''};
`;

const PeerViewController = styled(Space).attrs({
  size: 4,
})`
  position: absolute;
  top: 4px;
  right: 4px;
`;

const PeerInfo = styled(Space)`
  position: absolute;
  bottom: 4px;
  right: 4px;
  color: white;
  display: flex;
`;

const Video = styled.video.attrs({
  autoPlay: true,
  muted: true,
  controls: false,
})`
  width: 100%;
  background: black;
  border: 1px solid grey;
  display: block;
`;

const PeerViewStat = styled.div`
  position: absolute;
  left: 4px;
  bottom: 4px;
`;

const VideoLoading = styled(Spinner)`
  position: absolute;
  left: 4px;
  bottom: 4px;
  border-left-color: white;
`;

interface Props {
  isMe?: boolean;
  peer: any;
  audioProducerId?: string;
  videoProducerId?: string;
  audioConsumerId?: string;
  videoConsumerId?: string;
  audioRtpParameters?: any;
  videoRtpParameters?: any;
  consumerSpatialLayers?: number;
  consumerTemporalLayers?: number;
  consumerCurrentSpatialLayer?: number;
  consumerCurrentTemporalLayer?: number;
  consumerPreferredSpatialLayer?: number;
  consumerPreferredTemporalLayer?: number;
  consumerPriority?: number;
  audioTrack?: MediaStreamTrack;
  videoTrack?: MediaStreamTrack;
  audioMuted?: boolean;
  videoVisible: boolean;
  videoMultiLayer?: boolean;
  audioCodec?: string;
  videoCodec?: string;
  audioScore?: any;
  videoScore?: any;
  onChangeDisplayName?: (displayName: string) => void;
  onChangeMaxSendingSpatialLayer?: (spatialLayer: number) => void;
  onChangeVideoPreferredLayers?: (
    newPreferredSpatialLayer: number,
    newPreferredTemporalLayer: number
  ) => void;
  onChangeVideoPriority?: (priority: number) => void;
  onRequestKeyFrame?: () => void;
  onStatsClick: (id: string) => void;
}

const ProducerScore: React.FC<{
  id: string;
  score: any[];
}> = TMemo((props) => {
  const scores = Array.isArray(props.score) ? props.score : [props.score];

  return (
    <Fragment key={props.id}>
      <p>streams:</p>

      {scores
        .sort((a, b) => {
          if (a.rid) return a.rid > b.rid ? 1 : -1;
          else return a.ssrc > b.ssrc ? 1 : -1;
        })
        .map((
          { ssrc, rid, score },
          idx // eslint-disable-line no-shadow
        ) => (
          <p key={idx} className="indent">
            {rid !== undefined
              ? `rid:${rid}, ssrc:${ssrc}, score:${score}`
              : `ssrc:${ssrc}, score:${score}`}
          </p>
        ))}
    </Fragment>
  );
});

const ConsumerScore: React.FC<{
  id: string;
  score: any;
}> = TMemo((props) => {
  return (
    <p key={props.id}>
      {`score:${props.score.score}, producerScore:${props.score.producerScore}`}
    </p>
  );
});

export const PeerView: React.FC<Props> = TMemo((props) => {
  const {
    isMe,
    peer,
    audioProducerId,
    videoProducerId,
    audioConsumerId,
    videoConsumerId,
    videoRtpParameters,
    consumerSpatialLayers,
    consumerTemporalLayers,
    consumerCurrentSpatialLayer,
    consumerCurrentTemporalLayer,
    consumerPreferredSpatialLayer,
    consumerPreferredTemporalLayer,
    consumerPriority,
    audioMuted,
    videoVisible,
    videoMultiLayer,
    audioCodec,
    videoCodec,
    audioScore,
    videoScore,
    onChangeDisplayName,
    onChangeMaxSendingSpatialLayer,
    onChangeVideoPreferredLayers,
    onChangeVideoPriority,
    onRequestKeyFrame,
    onStatsClick,
    audioTrack,
    videoTrack,
  } = props;
  const [audioVolume, setAudioVolume] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [videoResolutionWidth, setVideoResolutionWidth] = useState<number>(
    null
  );
  const [videoResolutionHeight, setVideoResolutionHeight] = useState<number>(
    null
  );
  const [videoCanPlay, setVideoCanPlay] = useState(false);
  const [videoElemPaused, setVideoElemPaused] = useState(false);
  const [maxSpatialLayer, setMaxSpatialLayer] = useState(0);
  const harkRef = useRef<hark.Harker>(null);
  const videoResolutionPeriodicTimerRef = useRef<number>();
  const videoRef = useRef<HTMLVideoElement>();
  const audioRef = useRef<HTMLAudioElement>();
  const audioTrackRef = useRef<MediaStreamTrack>(null);
  const videoTrackRef = useRef<MediaStreamTrack>(null);
  const isActiveSpeaker = useRoomStateSelector(
    (state) => state.room.activeSpeakerId === peer?.id
  );

  const _startVideoResolution = useCallback(() => {
    videoResolutionPeriodicTimerRef.current = setInterval(() => {
      const videoElem = videoRef.current;

      if (
        videoElem.videoWidth !== videoResolutionWidth ||
        videoElem.videoHeight !== videoResolutionHeight
      ) {
        setVideoResolutionWidth(videoElem.videoWidth);
        setVideoResolutionHeight(videoElem.videoHeight);
      }
    }, 500);
  }, [
    videoResolutionWidth,
    videoResolutionHeight,
    setVideoResolutionWidth,
    setVideoResolutionHeight,
  ]);

  const _stopVideoResolution = useCallback(() => {
    clearInterval(videoResolutionPeriodicTimerRef.current);

    setVideoResolutionWidth(null);
    setVideoResolutionHeight(null);
  }, [setVideoResolutionWidth, setVideoResolutionHeight]);

  const _runHark = useCallback(
    (stream: MediaStream) => {
      if (!stream.getAudioTracks()[0]) {
        throw new Error('_runHark() | given stream has no audio track');
      }

      harkRef.current = hark(stream, { play: false });

      // eslint-disable-next-line no-unused-vars
      harkRef.current.on('volume_change', (dBs, threshold) => {
        // The exact formula to convert from dBs (-100..0) to linear (0..1) is:
        //   Math.pow(10, dBs / 20)
        // However it does not produce a visually useful output, so let exagerate
        // it a bit. Also, let convert it from 0..1 to 0..10 and avoid value 1 to
        // minimize component renderings.
        let _audioVolume = Math.round(Math.pow(10, dBs / 85) * 10);

        if (_audioVolume === 1) _audioVolume = 0;

        if (_audioVolume !== audioVolume) {
          setAudioVolume(_audioVolume);
        }
      });

      harkRef.current.on('stopped_speaking', () => {
        setAudioVolume(0);
      });
    },
    [audioVolume, setAudioVolume]
  );

  const _setTracks = useCallback(
    (audioTrack: MediaStreamTrack, videoTrack: MediaStreamTrack) => {
      if (
        audioTrackRef.current === audioTrack &&
        videoTrackRef.current === videoTrack
      ) {
        return;
      }

      audioTrackRef.current = audioTrack;
      videoTrackRef.current = videoTrack;

      if (harkRef.current) harkRef.current.stop();

      _stopVideoResolution();

      const videoElem = videoRef.current;
      const audioElem = audioRef.current;

      if (audioTrack) {
        const stream = new MediaStream();

        stream.addTrack(audioTrack);
        audioElem.srcObject = stream;

        audioElem
          .play()
          .catch((error) => logger.warn('audioElem.play() failed:%o', error));

        _runHark(stream);
      } else {
        audioElem.srcObject = null;
      }

      if (videoTrack) {
        const stream = new MediaStream();

        stream.addTrack(videoTrack);
        videoElem.srcObject = stream;

        videoElem.oncanplay = () => setVideoCanPlay(true);

        videoElem.onplay = () => {
          setVideoElemPaused(false);

          audioElem
            .play()
            .catch((error) => logger.warn('audioElem.play() failed:%o', error));
        };

        videoElem.onpause = () => setVideoElemPaused(true);

        videoElem
          .play()
          .catch((error) => logger.warn('videoElem.play() failed:%o', error));

        _startVideoResolution();
      } else {
        videoElem.srcObject = null;
      }
    },
    [
      _stopVideoResolution,
      _runHark,
      _startVideoResolution,
      setVideoCanPlay,
      setVideoElemPaused,
    ]
  );

  useEffect(() => {
    _setTracks(audioTrack, videoTrack);

    return () => {
      if (harkRef.current) harkRef.current.stop();

      clearInterval(videoResolutionPeriodicTimerRef.current);

      const videoElem = videoRef.current as HTMLVideoElement;

      if (videoElem) {
        videoElem.oncanplay = null;
        videoElem.onplay = null;
        videoElem.onpause = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isMe && videoRtpParameters && maxSpatialLayer === null) {
      setMaxSpatialLayer(videoRtpParameters.encodings.length - 1);
    } else if (isMe && !videoRtpParameters && maxSpatialLayer !== null) {
      setMaxSpatialLayer(null);
    }

    _setTracks(audioTrack, videoTrack);
  }, [isMe, audioTrack, videoTrack, videoRtpParameters, maxSpatialLayer]);

  return (
    <PeerViewContainer isActiveSpeaker={isActiveSpeaker}>
      <div>
        <VolumeInspector level={audioVolume} />

        <PeerViewController>
          <Tooltip title="信息">
            <Button shape="circle" onClick={() => setShowInfo(!showInfo)}>
              <i className="iconfont">&#xe611;</i>
            </Button>
          </Tooltip>

          <Tooltip title="查看状态">
            <Button shape="circle" onClick={() => onStatsClick(peer?.id)}>
              <i className="iconfont">&#xe6bb;</i>
            </Button>
          </Tooltip>
        </PeerViewController>

        {showInfo && (
          <div>
            {(audioProducerId || audioConsumerId) && (
              <Fragment>
                <h1>audio</h1>

                {audioProducerId && (
                  <Fragment>
                    <p>
                      {'id: '}
                      <Tooltip title="Copy audio producer id to clipboard">
                        <span
                          className="copiable"
                          data-tip=""
                          onClick={() => copy(`"${audioProducerId}"`)}
                        >
                          {audioProducerId}
                        </span>
                      </Tooltip>
                    </p>
                  </Fragment>
                )}

                {audioConsumerId && (
                  <Fragment>
                    <p>
                      {'id: '}
                      <Tooltip title="Copy video producer id to clipboard">
                        <span
                          className="copiable"
                          onClick={() => copy(`"${audioConsumerId}"`)}
                        >
                          {audioConsumerId}
                        </span>
                      </Tooltip>
                    </p>
                  </Fragment>
                )}

                {audioCodec && <p>codec: {audioCodec}</p>}

                {audioProducerId && audioScore && (
                  <ProducerScore id={audioProducerId} score={audioScore} />
                )}

                {audioConsumerId && audioScore && (
                  <ConsumerScore id={audioConsumerId} score={audioScore} />
                )}
              </Fragment>
            )}

            {(videoProducerId || videoConsumerId) && (
              <Fragment>
                <h1>video</h1>

                {videoProducerId && (
                  <Fragment>
                    <p>
                      {'id: '}
                      <Tooltip title="Copy audio consumer id to clipboard">
                        <span
                          className="copiable"
                          onClick={() => copy(`"${videoProducerId}"`)}
                        >
                          {videoProducerId}
                        </span>
                      </Tooltip>
                    </p>
                  </Fragment>
                )}

                {videoConsumerId && (
                  <Fragment>
                    <p>
                      {'id: '}
                      <Tooltip title="Copy video consumer id to clipboard">
                        <span
                          className="copiable"
                          onClick={() => copy(`"${videoConsumerId}"`)}
                        >
                          {videoConsumerId}
                        </span>
                      </Tooltip>
                    </p>
                  </Fragment>
                )}

                {videoCodec && <p>codec: {videoCodec}</p>}

                {videoVisible && videoResolutionWidth !== null && (
                  <p>
                    resolution: {videoResolutionWidth}x{videoResolutionHeight}
                  </p>
                )}

                {videoVisible &&
                  videoProducerId &&
                  videoRtpParameters.encodings.length > 1 && (
                    <p>
                      max spatial layer:{' '}
                      {maxSpatialLayer > -1 ? maxSpatialLayer : 'none'}
                      <span> </span>
                      <span
                        onClick={(event) => {
                          event.stopPropagation();

                          const newMaxSpatialLayer = maxSpatialLayer - 1;

                          onChangeMaxSendingSpatialLayer(newMaxSpatialLayer);
                          setMaxSpatialLayer(newMaxSpatialLayer);
                        }}
                      >
                        {'[ down ]'}
                      </span>
                      <span> </span>
                      <span
                        onClick={(event) => {
                          event.stopPropagation();

                          const newMaxSpatialLayer = maxSpatialLayer + 1;

                          onChangeMaxSendingSpatialLayer(newMaxSpatialLayer);
                          setMaxSpatialLayer(newMaxSpatialLayer);
                        }}
                      >
                        {'[ up ]'}
                      </span>
                    </p>
                  )}

                {!isMe && videoMultiLayer && (
                  <Fragment>
                    <p>
                      {`current spatial-temporal layers: ${consumerCurrentSpatialLayer} ${consumerCurrentTemporalLayer}`}
                    </p>
                    <p>
                      {`preferred spatial-temporal layers: ${consumerPreferredSpatialLayer} ${consumerPreferredTemporalLayer}`}
                      <span> </span>
                      <span
                        className="clickable"
                        onClick={(event) => {
                          event.stopPropagation();

                          let newPreferredSpatialLayer = consumerPreferredSpatialLayer;
                          let newPreferredTemporalLayer: number;

                          if (consumerPreferredTemporalLayer > 0) {
                            newPreferredTemporalLayer =
                              consumerPreferredTemporalLayer - 1;
                          } else {
                            if (consumerPreferredSpatialLayer > 0)
                              newPreferredSpatialLayer =
                                consumerPreferredSpatialLayer - 1;
                            else
                              newPreferredSpatialLayer =
                                consumerSpatialLayers - 1;

                            newPreferredTemporalLayer =
                              consumerTemporalLayers - 1;
                          }

                          onChangeVideoPreferredLayers(
                            newPreferredSpatialLayer,
                            newPreferredTemporalLayer
                          );
                        }}
                      >
                        {'[ down ]'}
                      </span>
                      <span> </span>
                      <span
                        className="clickable"
                        onClick={(event) => {
                          event.stopPropagation();

                          let newPreferredSpatialLayer = consumerPreferredSpatialLayer;
                          let newPreferredTemporalLayer;

                          if (
                            consumerPreferredTemporalLayer <
                            consumerTemporalLayers - 1
                          ) {
                            newPreferredTemporalLayer =
                              consumerPreferredTemporalLayer + 1;
                          } else {
                            if (
                              consumerPreferredSpatialLayer <
                              consumerSpatialLayers - 1
                            )
                              newPreferredSpatialLayer =
                                consumerPreferredSpatialLayer + 1;
                            else newPreferredSpatialLayer = 0;

                            newPreferredTemporalLayer = 0;
                          }

                          onChangeVideoPreferredLayers(
                            newPreferredSpatialLayer,
                            newPreferredTemporalLayer
                          );
                        }}
                      >
                        {'[ up ]'}
                      </span>
                    </p>
                  </Fragment>
                )}

                {!isMe && videoCodec && consumerPriority > 0 && (
                  <p>
                    {`priority: ${consumerPriority}`}
                    <span> </span>
                    <span
                      onClick={(event) => {
                        event.stopPropagation();

                        onChangeVideoPriority(consumerPriority - 1);
                      }}
                    >
                      {'[ down ]'}
                    </span>
                    <span> </span>
                    <span
                      onClick={(event) => {
                        event.stopPropagation();

                        onChangeVideoPriority(consumerPriority + 1);
                      }}
                    >
                      {'[ up ]'}
                    </span>
                  </p>
                )}

                {!isMe && videoCodec && (
                  <p>
                    <span
                      className="clickable"
                      onClick={(event) => {
                        event.stopPropagation();

                        if (!onRequestKeyFrame) return;

                        onRequestKeyFrame();
                      }}
                    >
                      {'[ request keyframe ]'}
                    </span>
                  </p>
                )}

                {videoProducerId && videoScore && (
                  <ProducerScore id={videoProducerId} score={videoScore} />
                )}

                {videoConsumerId && videoScore && (
                  <ConsumerScore id={videoConsumerId} score={videoScore} />
                )}
              </Fragment>
            )}
          </div>
        )}

        <PeerInfo>
          <span className="display-name">{peer?.displayName}</span>

          <div>
            <span className="device-version">
              {peer?.device &&
                `${peer.device.name} ${peer.device.version || null}`}
            </span>
          </div>
        </PeerInfo>
      </div>

      <Video ref={videoRef} />

      <audio
        ref={audioRef}
        autoPlay
        muted={isMe || audioMuted}
        controls={false}
      />

      <PeerViewStat>
        {videoVisible && videoScore < 5 && <VideoLoading />}

        {videoElemPaused && <i className="iconfont">&#xe6b4;</i>}
      </PeerViewStat>
    </PeerViewContainer>
  );
});
PeerView.displayName = 'PeerView';
