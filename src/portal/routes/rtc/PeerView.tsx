import React, { Fragment } from 'react';
import copy from 'copy-to-clipboard';
import hark from 'hark';
import Logger from '@src/rtc/Logger';
import Spinner from '@web/components/Spinner';
// import Logger from '../Logger';
// import * as appPropTypes from './appPropTypes';
// import EditableInput from './EditableInput';
import { Tooltip, Input } from 'antd';

const logger = new Logger('PeerView');

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
  audioTrack?: any;
  videoTrack?: any;
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
  onStatsClick: (id: number) => void;
}
export default class PeerView extends React.Component<Props> {
  state = {
    audioVolume: 0, // Integer from 0 to 10.,
    showInfo: false,
    videoResolutionWidth: null,
    videoResolutionHeight: null,
    videoCanPlay: false,
    videoElemPaused: false,
    maxSpatialLayer: null,
  };

  // Latest received audio track.
  _audioTrack: MediaStreamTrack = null;

  // Latest received video track.
  _videoTrack = null;

  // Hark instance.
  _hark = null;

  // Periodic timer for reading video resolution
  _videoResolutionPeriodicTimer = null;

  render() {
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
    } = this.props;

    const {
      audioVolume,
      showInfo,
      videoResolutionWidth,
      videoResolutionHeight,
      videoCanPlay,
      videoElemPaused,
      maxSpatialLayer,
    } = this.state;

    return (
      <div data-component="PeerView">
        <div className="info">
          <div className="icons">
            <div onClick={() => this.setState({ showInfo: !showInfo })} />

            <div onClick={() => onStatsClick(peer.id)} />
          </div>

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

                {audioProducerId &&
                  audioScore &&
                  this._printProducerScore(audioProducerId, audioScore)}

                {audioConsumerId &&
                  audioScore &&
                  this._printConsumerScore(audioConsumerId, audioScore)}
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
                          this.setState({
                            maxSpatialLayer: newMaxSpatialLayer,
                          });
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
                          this.setState({
                            maxSpatialLayer: newMaxSpatialLayer,
                          });
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

                {videoProducerId &&
                  videoScore &&
                  this._printProducerScore(videoProducerId, videoScore)}

                {videoConsumerId &&
                  videoScore &&
                  this._printConsumerScore(videoConsumerId, videoScore)}
              </Fragment>
            )}
          </div>

          <div>
            {isMe ? (
              <Input
                maxLength={20}
                value={peer.displayName}
                onChange={(e) => onChangeDisplayName(e.target.value)}
              />
            ) : (
              <span className="display-name">{peer.displayName}</span>
            )}

            <div className="row">
              <span />
              <span className="device-version">
                {peer.device &&
                  `${peer.device.name} ${peer.device.version || null}`}
              </span>
            </div>
          </div>
        </div>

        <video ref="videoElem" autoPlay muted controls={false} />

        <audio
          ref="audioElem"
          autoPlay
          muted={isMe || audioMuted}
          controls={false}
        />

        <canvas ref="canvas" />

        <div className="volume-container">
          <div />
        </div>

        {videoVisible && videoScore < 5 && (
          <div className="spinner-container">
            <Spinner />
          </div>
        )}

        {videoElemPaused && <div className="video-elem-paused" />}
      </div>
    );
  }

  componentDidMount() {
    const { audioTrack, videoTrack } = this.props;

    this._setTracks(audioTrack, videoTrack);
  }

  componentWillUnmount() {
    if (this._hark) this._hark.stop();

    clearInterval(this._videoResolutionPeriodicTimer);

    const videoElem = this.refs.videoElem as HTMLVideoElement;

    if (videoElem) {
      videoElem.oncanplay = null;
      videoElem.onplay = null;
      videoElem.onpause = null;
    }
  }

  componentWillUpdate() {
    const { isMe, audioTrack, videoTrack, videoRtpParameters } = this.props;

    const { maxSpatialLayer } = this.state;

    if (isMe && videoRtpParameters && maxSpatialLayer === null) {
      this.setState({
        maxSpatialLayer: videoRtpParameters.encodings.length - 1,
      });
    } else if (isMe && !videoRtpParameters && maxSpatialLayer !== null) {
      this.setState({ maxSpatialLayer: null });
    }

    this._setTracks(audioTrack, videoTrack);
  }

  _setTracks(audioTrack, videoTrack) {
    if (this._audioTrack === audioTrack && this._videoTrack === videoTrack)
      return;

    this._audioTrack = audioTrack;
    this._videoTrack = videoTrack;

    if (this._hark) this._hark.stop();

    this._stopVideoResolution();

    const videoElem = this.refs.videoElem as HTMLVideoElement;
    const audioElem = this.refs.audioElem as HTMLAudioElement;

    if (audioTrack) {
      const stream = new MediaStream();

      stream.addTrack(audioTrack);
      audioElem.srcObject = stream;

      audioElem
        .play()
        .catch((error) => logger.warn('audioElem.play() failed:%o', error));

      this._runHark(stream);
    } else {
      audioElem.srcObject = null;
    }

    if (videoTrack) {
      const stream = new MediaStream();

      stream.addTrack(videoTrack);
      videoElem.srcObject = stream;

      videoElem.oncanplay = () => this.setState({ videoCanPlay: true });

      videoElem.onplay = () => {
        this.setState({ videoElemPaused: false });

        audioElem
          .play()
          .catch((error) => logger.warn('audioElem.play() failed:%o', error));
      };

      videoElem.onpause = () => this.setState({ videoElemPaused: true });

      videoElem
        .play()
        .catch((error) => logger.warn('videoElem.play() failed:%o', error));

      this._startVideoResolution();
    } else {
      videoElem.srcObject = null;
    }
  }

  _runHark(stream) {
    if (!stream.getAudioTracks()[0])
      throw new Error('_runHark() | given stream has no audio track');

    this._hark = hark(stream, { play: false });

    // eslint-disable-next-line no-unused-vars
    this._hark.on('volume_change', (dBs, threshold) => {
      // The exact formula to convert from dBs (-100..0) to linear (0..1) is:
      //   Math.pow(10, dBs / 20)
      // However it does not produce a visually useful output, so let exagerate
      // it a bit. Also, let convert it from 0..1 to 0..10 and avoid value 1 to
      // minimize component renderings.
      let audioVolume = Math.round(Math.pow(10, dBs / 85) * 10);

      if (audioVolume === 1) audioVolume = 0;

      if (audioVolume !== this.state.audioVolume)
        this.setState({ audioVolume });
    });
  }

  _startVideoResolution() {
    this._videoResolutionPeriodicTimer = setInterval(() => {
      const { videoResolutionWidth, videoResolutionHeight } = this.state;
      const videoElem = this.refs.videoElem as HTMLVideoElement;

      if (
        videoElem.videoWidth !== videoResolutionWidth ||
        videoElem.videoHeight !== videoResolutionHeight
      ) {
        this.setState({
          videoResolutionWidth: videoElem.videoWidth,
          videoResolutionHeight: videoElem.videoHeight,
        });
      }
    }, 500);
  }

  _stopVideoResolution() {
    clearInterval(this._videoResolutionPeriodicTimer);

    this.setState({
      videoResolutionWidth: null,
      videoResolutionHeight: null,
    });
  }

  _printProducerScore(id, score) {
    const scores = Array.isArray(score) ? score : [score];

    return (
      <Fragment key={id}>
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
  }

  _printConsumerScore(id, score) {
    return (
      <p key={id}>
        {`score:${score.score}, producerScore:${score.producerScore}`}
      </p>
    );
  }
}
