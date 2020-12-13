import protooClient from 'protoo-client';
import {
  Device,
  parseScalabilityMode,
  types as MediasoupType,
} from 'mediasoup-client';
import Logger from './Logger';
import { getProtooUrl } from './urlFactory';
import { BuiltinHandlerName } from 'mediasoup-client/lib/types';
import * as settingManager from './settingManager';
import * as requestActions from './redux/requestActions';
import * as stateActions from './redux/stateActions';
import _isNil from 'lodash/isNil';
import { RoomClientOptions } from './type';
import shortid from 'shortid';
import { downloadBlob, downloadBlobUrl } from '@web/utils/file-helper';
import type { RTCStoreType } from './redux';
import { startWatchAllAudioTrack, stopWatchAllAudioTrack } from './utils';
import RecordRTC from 'recordrtc';

declare global {
  interface MediaDevices {
    getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
  }

  interface MediaTrackConstraintSet {
    displaySurface?: ConstrainDOMString;
    logicalSurface?: ConstrainBoolean;
    cursor?: ConstrainBoolean;
  }
}

const VIDEO_CONSTRAINS = {
  qvga: { width: { ideal: 320 }, height: { ideal: 240 } },
  vga: { width: { ideal: 640 }, height: { ideal: 480 } },
  hd: { width: { ideal: 1280 }, height: { ideal: 720 } },
};

const PC_PROPRIETARY_CONSTRAINTS = {
  optional: [{ googDscp: true }],
};

const VIDEO_SIMULCAST_ENCODINGS = [
  { scaleResolutionDownBy: 4 },
  { scaleResolutionDownBy: 2 },
  { scaleResolutionDownBy: 1 },
];

// Used for VP9 webcam video.
const VIDEO_KSVC_ENCODINGS = [{ scalabilityMode: 'S3T3_KEY' }];

// Used for VP9 desktop sharing.
const VIDEO_SVC_ENCODINGS = [{ scalabilityMode: 'S3T3', dtx: true }];

const EXTERNAL_VIDEO_SRC = '/resources/videos/video-audio-stereo.mp4';

const logger = new Logger('RoomClient');

let store: RTCStoreType;

export class RoomClient {
  /**
   * @param  {Object} data
   * @param  {Object} data.store - The Redux store.
   */
  static init(data) {
    store = data.store;
  }

  public clientId = shortid();

  private _roomId: string;

  // Closed flag.
  _closed = false;

  // Display name.
  _displayName: string;

  // Device info.
  _device: RoomClientOptions['device'];

  // Whether we want to force RTC over TCP.
  _forceTcp: boolean;

  // Whether we want to produce audio/video.
  _produce: boolean;

  // Whether we should consume.
  _consume: boolean;

  // Whether we want DataChannels.
  _useDataChannel: boolean;

  // External video.
  // @type {HTMLVideoElement}
  _externalVideo: any = null;

  // MediaStream of the external video.
  // @type {MediaStream}
  _externalVideoStream: MediaStream | null = null;

  // Next expected dataChannel test number.
  _nextDataChannelTestNumber = 0;

  // Custom mediasoup-client handler name (to override default browser
  // detection if desired).
  _handlerName?: BuiltinHandlerName;

  // Whether simulcast should be used.
  _useSimulcast?: boolean;

  // Whether simulcast should be used in desktop sharing.
  _useSharingSimulcast?: boolean;

  // Protoo URL.
  _protooUrl: string;

  // protoo-client Peer instance.
  // @type {protooClient.Peer}
  _protoo: protooClient.Peer | null = null;

  // mediasoup-client Device instance.
  _mediasoupDevice: Device | null = null;

  // mediasoup Transport for sending.
  _sendTransport: MediasoupType.Transport | null = null;

  // mediasoup Transport for receiving.
  _recvTransport: MediasoupType.Transport | null = null;

  // Local mic mediasoup Producer.
  _micProducer: MediasoupType.Producer | null = null;

  // Local webcam mediasoup Producer.
  _webcamProducer: MediasoupType.Producer | null = null;

  // Local share mediasoup Producer.
  _shareProducer: MediasoupType.Producer | null = null;

  // Local chat DataProducer.
  _chatDataProducer: MediasoupType.DataProducer | null = null;

  // Local bot DataProducer.
  _botDataProducer: MediasoupType.DataProducer | null = null;

  // mediasoup Consumers.
  _consumers = new Map<string, MediasoupType.Consumer>();

  // mediasoup DataConsumers.
  // @type {Map<String, mediasoupClient.DataConsumer>}
  _dataConsumers = new Map<string, MediasoupType.DataConsumer>();

  // Map of webcam MediaDeviceInfos indexed by deviceId.
  // @type {Map<String, MediaDeviceInfos>}
  _webcams = new Map<string, MediaDeviceInfo>();

  // Local Webcam.
  // @type {Object} with:
  // - {MediaDeviceInfo} [device]
  // - {String} [resolution] - 'qvga' / 'vga' / 'hd'.
  _webcam: any;

  private _hardcodeAudioTrack?: MediaStreamTrack;

  constructor({
    roomId,
    peerId,
    displayName,
    device,
    handlerName,
    useSimulcast,
    useSharingSimulcast,
    forceTcp = false,
    produce = true,
    consume = true,
    forceH264,
    forceVP9,
    svc,
    datachannel = false,
    externalVideo = false,
  }: RoomClientOptions) {
    logger.debug(
      'constructor() [roomId:"%s", peerId:"%s", displayName:"%s", device:%s]',
      roomId,
      peerId,
      displayName,
      device.flag
    );

    this._roomId = roomId;
    this._displayName = displayName;
    this._device = device;
    this._forceTcp = forceTcp;
    this._produce = produce;
    this._consume = consume;
    this._useDataChannel = datachannel;

    if (externalVideo) {
      // TODO: 需要处理成抽象代码
      // this._externalVideo = document.createElement('video');
      // this._externalVideo.controls = true;
      // this._externalVideo.muted = true;
      // this._externalVideo.loop = true;
      // this._externalVideo.setAttribute('playsinline', '');
      // this._externalVideo.src = EXTERNAL_VIDEO_SRC;
      // this._externalVideo
      //   .play()
      //   .catch((error) => logger.warn('externalVideo.play() failed:%o', error));
    }

    this._handlerName = handlerName;
    this._useSimulcast = useSimulcast;
    this._useSharingSimulcast = useSharingSimulcast;
    this._protooUrl = getProtooUrl({ roomId, peerId, forceH264, forceVP9 });

    this._webcam = {
      device: null,
      resolution: 'hd',
    };

    // Set custom SVC scalability mode.
    if (svc) {
      VIDEO_SVC_ENCODINGS[0].scalabilityMode = svc;
      VIDEO_KSVC_ENCODINGS[0].scalabilityMode = `${svc}_KEY`;
    }
  }

  get roomId(): string {
    return this._roomId;
  }

  async close() {
    if (this._closed) {
      return;
    }

    this._roomId = '';
    this._closed = true;

    logger.debug('close()');

    // Close protoo Peer
    if (!_isNil(this._protoo)) {
      this._protoo.close();
    }

    await this.disableAll();

    {
      // hardcode
      if (!_isNil(this._hardcodeAudioTrack)) {
        this._hardcodeAudioTrack.stop();
        this._hardcodeAudioTrack = undefined;
      }
    }

    if (!_isNil(this.audioRTCRecorder)) {
      this.stopRecordAudio();
    }

    // Close mediasoup Transports.
    if (this._sendTransport) {
      this._sendTransport.close();
    }

    if (this._recvTransport) {
      this._recvTransport.close();
    }

    store.dispatch(stateActions.setRoomId(null));
    store.dispatch(stateActions.setRoomState('closed'));
  }

  async join() {
    const protooTransport = new protooClient.WebSocketTransport(
      this._protooUrl
    );

    this._protoo = new protooClient.Peer(protooTransport);

    store.dispatch(stateActions.setRoomId(this.roomId));
    store.dispatch(stateActions.setRoomState('connecting'));

    this._protoo.on('open', () => this._joinRoom());

    this._protoo.on('failed', () => {
      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: 'WebSocket connection failed',
        })
      );
    });

    this._protoo.on('disconnected', () => {
      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: 'WebSocket disconnected',
        })
      );

      // Close mediasoup Transports.
      if (this._sendTransport) {
        this._sendTransport.close();
        this._sendTransport = null;
      }

      if (this._recvTransport) {
        this._recvTransport.close();
        this._recvTransport = null;
      }

      store.dispatch(stateActions.setRoomState('closed'));
    });

    this._protoo.on('close', () => {
      if (this._closed) return;

      this.close();
    });

    // eslint-disable-next-line no-unused-vars
    this._protoo.on('request', async (request, accept, reject) => {
      logger.debug(
        'proto "request" event [method:%s, data:%o]',
        request.method,
        request.data
      );

      switch (request.method) {
        case 'newConsumer': {
          if (!this._consume) {
            reject(403, 'I do not want to consume');

            break;
          }

          const {
            peerId,
            producerId,
            id,
            kind,
            rtpParameters,
            type,
            appData,
            producerPaused,
          } = request.data;

          // let codecOptions;

          // if (kind === 'audio') {
          //   codecOptions = {
          //     opusStereo: 1,
          //   };
          // }

          try {
            if (_isNil(this._recvTransport)) {
              throw new Error('can not get _recvTransport');
            }

            const consumer = await this._recvTransport.consume({
              id,
              producerId,
              kind,
              rtpParameters,
              // codecOptions,
              appData: { ...appData, peerId }, // Trick.
            });

            // Store in the map.
            this._consumers.set(consumer.id, consumer);

            consumer.on('transportclose', () => {
              this._consumers.delete(consumer.id);
            });

            const { spatialLayers, temporalLayers } = parseScalabilityMode(
              consumer.rtpParameters.encodings?.[0].scalabilityMode
            );

            store.dispatch(
              stateActions.addConsumer(
                {
                  id: consumer.id,
                  type,
                  locallyPaused: false,
                  remotelyPaused: producerPaused,
                  rtpParameters: consumer.rtpParameters,
                  spatialLayers,
                  temporalLayers,
                  preferredSpatialLayer: spatialLayers - 1,
                  preferredTemporalLayer: temporalLayers - 1,
                  priority: 1,
                  codec: consumer.rtpParameters.codecs[0].mimeType.split(
                    '/'
                  )[1],
                  track: consumer.track,
                  muted: false,
                },
                peerId
              )
            );

            // We are ready. Answer the protoo request so the server will
            // resume this Consumer (which was paused for now if video).
            accept();

            // If audio-only mode is enabled, pause it.
            if (consumer.kind === 'video' && store.getState().me.audioOnly)
              this._pauseConsumer(consumer);
          } catch (error) {
            logger.error('"newConsumer" request failed:%o', error);

            store.dispatch(
              requestActions.notify({
                type: 'error',
                text: `Error creating a Consumer: ${error}`,
              })
            );

            throw error;
          }

          break;
        }

        case 'newDataConsumer': {
          if (!this._consume) {
            reject(403, 'I do not want to data consume');

            break;
          }

          if (!this._useDataChannel) {
            reject(403, 'I do not want DataChannels');

            break;
          }

          const {
            peerId, // NOTE: Null if bot.
            dataProducerId,
            id,
            sctpStreamParameters,
            label,
            protocol,
            appData,
          } = request.data;

          try {
            if (_isNil(this._recvTransport)) {
              throw new Error('can not get _recvTransport');
            }

            const dataConsumer = await this._recvTransport.consumeData({
              id,
              dataProducerId,
              sctpStreamParameters,
              label,
              protocol,
              appData: { ...appData, peerId }, // Trick.
            });

            // Store in the map.
            this._dataConsumers.set(dataConsumer.id, dataConsumer);

            dataConsumer.on('transportclose', () => {
              this._dataConsumers.delete(dataConsumer.id);
            });

            dataConsumer.on('open', () => {
              logger.debug('DataConsumer "open" event');
            });

            dataConsumer.on('close', () => {
              logger.warn('DataConsumer "close" event');

              this._dataConsumers.delete(dataConsumer.id);

              store.dispatch(
                requestActions.notify({
                  type: 'error',
                  text: 'DataConsumer closed',
                })
              );
            });

            dataConsumer.on('error', (error) => {
              logger.error('DataConsumer "error" event:%o', error);

              store.dispatch(
                requestActions.notify({
                  type: 'error',
                  text: `DataConsumer error: ${error}`,
                })
              );
            });

            dataConsumer.on('message', (message) => {
              logger.debug(
                'DataConsumer "message" event [streamId:%d]',
                dataConsumer.sctpStreamParameters.streamId
              );

              // TODO: For debugging.
              // window.DC_MESSAGE = message;

              if (message instanceof ArrayBuffer) {
                const view = new DataView(message);
                const num = view.getUint32(0);

                if (num === Math.pow(2, 32) - 1) {
                  logger.warn('dataChannelTest finished!');

                  this._nextDataChannelTestNumber = 0;

                  return;
                }

                if (num > this._nextDataChannelTestNumber) {
                  logger.warn(
                    'dataChannelTest: %s packets missing',
                    num - this._nextDataChannelTestNumber
                  );
                }

                this._nextDataChannelTestNumber = num + 1;

                return;
              } else if (typeof message !== 'string') {
                logger.warn('ignoring DataConsumer "message" (not a string)');

                return;
              }

              switch (dataConsumer.label) {
                case 'chat': {
                  const { peers } = store.getState();
                  const peersArray = Object.keys(peers).map(
                    (_peerId) => peers[_peerId]
                  );
                  const sendingPeer = peersArray.find((peer) =>
                    peer.dataConsumers.includes(dataConsumer.id)
                  );

                  if (!sendingPeer) {
                    logger.warn('DataConsumer "message" from unknown peer');

                    break;
                  }

                  store.dispatch(
                    requestActions.notify({
                      title: `${sendingPeer.displayName} says:`,
                      text: message,
                      timeout: 5000,
                    })
                  );

                  break;
                }

                case 'bot': {
                  store.dispatch(
                    requestActions.notify({
                      title: 'Message from Bot:',
                      text: message,
                      timeout: 5000,
                    })
                  );

                  break;
                }
              }
            });

            // TODO: REMOVE
            // window.DC = dataConsumer;

            store.dispatch(
              stateActions.addDataConsumer(
                {
                  id: dataConsumer.id,
                  sctpStreamParameters: dataConsumer.sctpStreamParameters,
                  label: dataConsumer.label,
                  protocol: dataConsumer.protocol,
                },
                peerId
              )
            );

            // We are ready. Answer the protoo request.
            accept();
          } catch (error) {
            logger.error('"newDataConsumer" request failed:%o', error);

            store.dispatch(
              requestActions.notify({
                type: 'error',
                text: `Error creating a DataConsumer: ${error}`,
              })
            );

            throw error;
          }

          break;
        }
      }
    });

    this._protoo.on('notification', (notification) => {
      logger.debug(
        'proto "notification" event [method:%s, data:%o]',
        notification.method,
        notification.data
      );

      switch (notification.method) {
        case 'producerScore': {
          const { producerId, score } = notification.data;

          store.dispatch(stateActions.setProducerScore(producerId, score));

          break;
        }

        case 'newPeer': {
          const peer = notification.data;

          store.dispatch(
            stateActions.addPeer({ ...peer, consumers: [], dataConsumers: [] })
          );

          store.dispatch(
            requestActions.notify({
              text: `${peer.displayName} has joined the room`,
            })
          );

          break;
        }

        case 'peerClosed': {
          const { peerId } = notification.data;

          store.dispatch(stateActions.removePeer(peerId));

          break;
        }

        case 'peerDisplayNameChanged': {
          const { peerId, displayName, oldDisplayName } = notification.data;

          store.dispatch(stateActions.setPeerDisplayName(displayName, peerId));

          store.dispatch(
            requestActions.notify({
              text: `${oldDisplayName} is now ${displayName}`,
            })
          );

          break;
        }

        case 'consumerClosed': {
          const { consumerId } = notification.data;
          const consumer = this._consumers.get(consumerId);

          if (!consumer) break;

          consumer.close();
          this._consumers.delete(consumerId);

          const { peerId } = consumer.appData;

          store.dispatch(stateActions.removeConsumer(consumerId, peerId));

          break;
        }

        case 'consumerPaused': {
          const { consumerId } = notification.data;
          const consumer = this._consumers.get(consumerId);

          if (!consumer) break;

          store.dispatch(stateActions.setConsumerPaused(consumerId, 'remote'));

          break;
        }

        case 'consumerResumed': {
          const { consumerId } = notification.data;
          const consumer = this._consumers.get(consumerId);

          if (!consumer) break;

          store.dispatch(stateActions.setConsumerResumed(consumerId, 'remote'));

          break;
        }

        case 'consumerLayersChanged': {
          const { consumerId, spatialLayer, temporalLayer } = notification.data;
          const consumer = this._consumers.get(consumerId);

          if (!consumer) break;

          store.dispatch(
            stateActions.setConsumerCurrentLayers(
              consumerId,
              spatialLayer,
              temporalLayer
            )
          );

          break;
        }

        case 'consumerScore': {
          const { consumerId, score } = notification.data;

          store.dispatch(stateActions.setConsumerScore(consumerId, score));

          break;
        }

        case 'dataConsumerClosed': {
          const { dataConsumerId } = notification.data;
          const dataConsumer = this._dataConsumers.get(dataConsumerId);

          if (!dataConsumer) break;

          dataConsumer.close();
          this._dataConsumers.delete(dataConsumerId);

          const { peerId } = dataConsumer.appData;

          store.dispatch(
            stateActions.removeDataConsumer(dataConsumerId, peerId)
          );

          break;
        }

        case 'activeSpeaker': {
          const { peerId } = notification.data;

          store.dispatch(stateActions.setRoomActiveSpeaker(peerId));

          break;
        }

        default: {
          logger.error(
            'unknown protoo notification.method "%s"',
            notification.method
          );
        }
      }
    });
  }

  async enableMic() {
    logger.debug('enableMic()');

    if (this._micProducer) return;

    if (!this._mediasoupDevice?.canProduce('audio')) {
      logger.error('enableMic() | cannot produce audio');

      return;
    }

    let track: MediaStreamTrack | undefined;

    try {
      if (!this._externalVideo) {
        logger.debug('enableMic() | calling getUserMedia()');

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        track = stream.getAudioTracks()[0];
      } else {
        const stream = await this._getExternalVideoStream();

        track = stream?.getAudioTracks()[0].clone();
      }

      if (_isNil(this._sendTransport)) {
        throw new Error('can not get _sendTransport');
      }

      this._micProducer = await this._sendTransport.produce({
        track,
        codecOptions: {
          opusStereo: true,
          opusDtx: true,
        },
        // NOTE: for testing codec selection.
        // codec : this._mediasoupDevice.rtpCapabilities.codecs
        // 	.find((codec) => codec.mimeType.toLowerCase() === 'audio/pcma')
      });

      store.dispatch(
        stateActions.addProducer({
          id: this._micProducer.id,
          paused: this._micProducer.paused,
          track: this._micProducer.track,
          rtpParameters: this._micProducer.rtpParameters,
          codec: this._micProducer.rtpParameters.codecs[0].mimeType.split(
            '/'
          )[1],
        })
      );

      this._micProducer.on('transportclose', () => {
        this._micProducer = null;
      });

      this._micProducer.on('trackended', () => {
        store.dispatch(
          requestActions.notify({
            type: 'error',
            text: 'Microphone disconnected!',
          })
        );

        this.disableMic().catch(() => {});
      });
    } catch (error) {
      logger.error('enableMic() | failed:%o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Error enabling microphone: ${error}`,
        })
      );

      if (track) track.stop();
    }
  }

  async disableMic() {
    logger.debug('disableMic()');

    if (!this._micProducer) return;

    this._micProducer.close();

    store.dispatch(stateActions.removeProducer(this._micProducer.id));

    try {
      if (_isNil(this._protoo)) {
        throw new Error('Can not get this._protoo');
      }

      await this._protoo.request('closeProducer', {
        producerId: this._micProducer.id,
      });
    } catch (error) {
      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Error closing server-side mic Producer: ${error}`,
        })
      );
    }

    this._micProducer = null;
  }

  async muteMic() {
    logger.debug('muteMic()');

    this._micProducer?.pause();

    try {
      if (_isNil(this._protoo)) {
        throw new Error('Can not get this._protoo');
      }

      await this._protoo.request('pauseProducer', {
        producerId: this._micProducer?.id,
      });

      store.dispatch(stateActions.setProducerPaused(this._micProducer?.id));
    } catch (error) {
      logger.error('muteMic() | failed: %o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Error pausing server-side mic Producer: ${error}`,
        })
      );
    }
  }

  async unmuteMic() {
    logger.debug('unmuteMic()');

    this._micProducer?.resume();

    try {
      if (_isNil(this._protoo)) {
        throw new Error('Can not get this._protoo');
      }

      await this._protoo.request('resumeProducer', {
        producerId: this._micProducer?.id,
      });

      store.dispatch(stateActions.setProducerResumed(this._micProducer?.id));
    } catch (error) {
      logger.error('unmuteMic() | failed: %o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Error resuming server-side mic Producer: ${error}`,
        })
      );
    }
  }

  /**
   * 开始录制音频
   */
  audioRTCRecorder: RecordRTC.MultiStreamRecorder | null = null;
  async startRecordAudio() {
    const stream = new MediaStream();

    if (this._micProducer?.track) {
      stream.addTrack(this._micProducer.track);
    }
    this.audioRTCRecorder = new RecordRTC.MultiStreamRecorder([stream], {
      type: 'audio',
      mimeType: 'audio/webm',
    });

    // 监听所有音轨的变更，如果有新增的则增加录音流
    startWatchAllAudioTrack(store, (newTrack) => {
      if (_isNil(this.audioRTCRecorder)) {
        return;
      }

      // TODO: 这里无法完全录制。需要处理
      console.log('录音加入了新的音频轨道', newTrack.id);
      this.audioRTCRecorder.addStreams([new MediaStream([newTrack])]);
    });

    this.audioRTCRecorder.record();

    store.dispatch(stateActions.setIsRecordingAudio(true));
  }

  /**
   * 停止录音
   */
  stopRecordAudio() {
    if (_isNil(this.audioRTCRecorder)) {
      logger.error('stopRecordAudio() | cannot get audio recorder');
      return;
    }

    store.dispatch(stateActions.setIsRecordingAudio(false));

    this.audioRTCRecorder.stop((blob) => {
      downloadBlob(blob, `${new Date().valueOf()}.webm`);
    });
  }

  async enableWebcam() {
    logger.debug('enableWebcam()');

    if (this._webcamProducer) return;
    else if (this._shareProducer) await this.disableShare();

    if (!this._mediasoupDevice?.canProduce('video')) {
      logger.error('enableWebcam() | cannot produce video');

      return;
    }

    let track;
    let device;

    store.dispatch(stateActions.setWebcamInProgress(true));

    try {
      if (!this._externalVideo) {
        await this._updateWebcams();
        device = this._webcam.device;

        const { resolution } = this._webcam;

        if (!device) throw new Error('no webcam devices');

        logger.debug('enableWebcam() | calling getUserMedia()');

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: device.deviceId },
            ...VIDEO_CONSTRAINS[resolution],
          },
        });

        track = stream.getVideoTracks()[0];
      } else {
        device = { label: 'external video' };

        const stream = await this._getExternalVideoStream();

        track = stream?.getVideoTracks()[0].clone();
      }

      if (this._useSimulcast) {
        // If VP9 is the only available video codec then use SVC.
        const firstVideoCodec = this._mediasoupDevice.rtpCapabilities.codecs?.find(
          (c) => c.kind === 'video'
        );

        let encodings;

        if (firstVideoCodec?.mimeType.toLowerCase() === 'video/vp9')
          encodings = VIDEO_KSVC_ENCODINGS;
        else encodings = VIDEO_SIMULCAST_ENCODINGS;

        if (_isNil(this._sendTransport)) {
          throw new Error('Cannot get this._sendTransport');
        }

        this._webcamProducer = await this._sendTransport.produce({
          track,
          encodings,
          codecOptions: {
            videoGoogleStartBitrate: 1000,
          },
          // NOTE: for testing codec selection.
          // codec : this._mediasoupDevice.rtpCapabilities.codecs
          // 	.find((codec) => codec.mimeType.toLowerCase() === 'video/h264')
        });
      } else {
        if (_isNil(this._sendTransport)) {
          throw new Error('Cannot get this._sendTransport');
        }

        this._webcamProducer = await this._sendTransport.produce({ track });
      }

      store.dispatch(
        stateActions.addProducer({
          id: this._webcamProducer.id,
          deviceLabel: device.label,
          type: this._getWebcamType(device),
          paused: this._webcamProducer.paused,
          track: this._webcamProducer.track,
          rtpParameters: this._webcamProducer.rtpParameters,
          codec: this._webcamProducer.rtpParameters.codecs[0].mimeType.split(
            '/'
          )[1],
        })
      );

      this._webcamProducer.on('transportclose', () => {
        this._webcamProducer = null;
      });

      this._webcamProducer.on('trackended', () => {
        store.dispatch(
          requestActions.notify({
            type: 'error',
            text: 'Webcam disconnected!',
          })
        );

        this.disableWebcam().catch(() => {});
      });
    } catch (error) {
      logger.error('enableWebcam() | failed:%o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Error enabling webcam: ${error}`,
        })
      );

      if (track) track.stop();
    }

    store.dispatch(stateActions.setWebcamInProgress(false));
  }

  async disableWebcam() {
    logger.debug('disableWebcam()');

    if (!this._webcamProducer) return;

    this._webcamProducer.close();

    store.dispatch(stateActions.removeProducer(this._webcamProducer.id));

    try {
      if (_isNil(this._protoo)) {
        throw new Error('Cannot get this._protoo');
      }

      await this._protoo.request('closeProducer', {
        producerId: this._webcamProducer.id,
      });
    } catch (error) {
      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Error closing server-side webcam Producer: ${error}`,
        })
      );
    }

    this._webcamProducer = null;
  }

  async changeWebcam() {
    logger.debug('changeWebcam()');

    store.dispatch(stateActions.setWebcamInProgress(true));

    try {
      await this._updateWebcams();

      const array = Array.from(this._webcams.keys());
      const len = array.length;
      const deviceId = this._webcam.device
        ? this._webcam.device.deviceId
        : undefined;
      let idx = array.indexOf(deviceId);

      if (idx < len - 1) idx++;
      else idx = 0;

      this._webcam.device = this._webcams.get(array[idx]);

      logger.debug(
        'changeWebcam() | new selected webcam [device:%o]',
        this._webcam.device
      );

      // Reset video resolution to HD.
      this._webcam.resolution = 'hd';

      if (!this._webcam.device) throw new Error('no webcam devices');

      // Closing the current video track before asking for a new one (mobiles do not like
      // having both front/back cameras open at the same time).
      this._webcamProducer?.track?.stop();

      logger.debug('changeWebcam() | calling getUserMedia()');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: this._webcam.device.deviceId },
          ...VIDEO_CONSTRAINS[this._webcam.resolution],
        },
      });

      const track = stream.getVideoTracks()[0];

      await this._webcamProducer?.replaceTrack({ track });

      store.dispatch(
        stateActions.setProducerTrack(this._webcamProducer?.id, track)
      );
    } catch (error) {
      logger.error('changeWebcam() | failed: %o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Could not change webcam: ${error}`,
        })
      );
    }

    store.dispatch(stateActions.setWebcamInProgress(false));
  }

  async changeWebcamResolution() {
    logger.debug('changeWebcamResolution()');

    store.dispatch(stateActions.setWebcamInProgress(true));

    try {
      switch (this._webcam.resolution) {
        case 'qvga':
          this._webcam.resolution = 'vga';
          break;
        case 'vga':
          this._webcam.resolution = 'hd';
          break;
        case 'hd':
          this._webcam.resolution = 'qvga';
          break;
        default:
          this._webcam.resolution = 'hd';
      }

      logger.debug('changeWebcamResolution() | calling getUserMedia()');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: this._webcam.device.deviceId },
          ...VIDEO_CONSTRAINS[this._webcam.resolution],
        },
      });

      const track = stream.getVideoTracks()[0];

      await this._webcamProducer?.replaceTrack({ track });

      store.dispatch(
        stateActions.setProducerTrack(this._webcamProducer?.id, track)
      );
    } catch (error) {
      logger.error('changeWebcamResolution() | failed: %o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Could not change webcam resolution: ${error}`,
        })
      );
    }

    store.dispatch(stateActions.setWebcamInProgress(false));
  }

  async enableShare() {
    logger.debug('enableShare()');

    if (this._shareProducer) {
      return;
    } else if (this._webcamProducer) {
      await this.disableWebcam();
    }

    if (!this._mediasoupDevice?.canProduce('video')) {
      logger.error('enableShare() | cannot produce video');

      return;
    }

    let track;

    store.dispatch(stateActions.setShareInProgress(true));

    try {
      logger.debug('enableShare() | calling getUserMedia()');

      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: {
          displaySurface: 'monitor',
          logicalSurface: true,
          cursor: true,
          width: { max: 1920 },
          height: { max: 1080 },
          frameRate: { max: 30 },
        },
      });

      // May mean cancelled (in some implementations).
      if (!stream) {
        store.dispatch(stateActions.setShareInProgress(true));

        return;
      }

      track = stream.getVideoTracks()[0];

      if (this._useSharingSimulcast) {
        // If VP9 is the only available video codec then use SVC.
        const firstVideoCodec = this._mediasoupDevice.rtpCapabilities.codecs?.find(
          (c) => c.kind === 'video'
        );

        let encodings;

        if (firstVideoCodec?.mimeType.toLowerCase() === 'video/vp9') {
          encodings = VIDEO_SVC_ENCODINGS;
        } else {
          encodings = VIDEO_SIMULCAST_ENCODINGS.map((encoding) => ({
            ...encoding,
            dtx: true,
          }));
        }

        if (_isNil(this._sendTransport)) {
          throw new Error('Cannot get this._sendTransport');
        }

        this._shareProducer = await this._sendTransport.produce({
          track,
          encodings,
          codecOptions: {
            videoGoogleStartBitrate: 1000,
          },
          appData: {
            share: true,
          },
        });
      } else {
        if (_isNil(this._sendTransport)) {
          throw new Error('Cannot get this._sendTransport');
        }

        this._shareProducer = await this._sendTransport.produce({ track });
      }

      store.dispatch(
        stateActions.addProducer({
          id: this._shareProducer.id,
          type: 'share',
          paused: this._shareProducer.paused,
          track: this._shareProducer.track,
          rtpParameters: this._shareProducer.rtpParameters,
          codec: this._shareProducer.rtpParameters.codecs[0].mimeType.split(
            '/'
          )[1],
        })
      );

      this._shareProducer.on('transportclose', () => {
        this._shareProducer = null;
      });

      this._shareProducer.on('trackended', () => {
        store.dispatch(
          requestActions.notify({
            type: 'error',
            text: 'Share disconnected!',
          })
        );

        this.disableShare().catch(() => {});
      });
    } catch (error) {
      logger.error('enableShare() | failed:%o', error);

      if (error.name !== 'NotAllowedError') {
        store.dispatch(
          requestActions.notify({
            type: 'error',
            text: `Error sharing: ${error}`,
          })
        );
      }

      if (track) track.stop();
    }

    store.dispatch(stateActions.setShareInProgress(false));
  }

  async disableShare() {
    logger.debug('disableShare()');

    if (!this._shareProducer) return;

    this._shareProducer.close();

    store.dispatch(stateActions.removeProducer(this._shareProducer.id));

    try {
      if (_isNil(this._protoo)) {
        throw new Error('Cannot get this._protoo');
      }

      await this._protoo.request('closeProducer', {
        producerId: this._shareProducer.id,
      });
    } catch (error) {
      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Error closing server-side share Producer: ${error}`,
        })
      );
    }

    this._shareProducer = null;
  }

  async enableAudioOnly() {
    logger.debug('enableAudioOnly()');

    store.dispatch(stateActions.setAudioOnlyInProgress(true));

    this.disableWebcam();

    for (const consumer of Array.from(this._consumers.values())) {
      if (consumer.kind !== 'video') continue;

      this._pauseConsumer(consumer);
    }

    store.dispatch(stateActions.setAudioOnlyState(true));

    store.dispatch(stateActions.setAudioOnlyInProgress(false));
  }

  async disableAudioOnly() {
    logger.debug('disableAudioOnly()');

    store.dispatch(stateActions.setAudioOnlyInProgress(true));

    const devices = (await settingManager.getDevices()) || {
      webcamEnabled: false,
    };

    if (!this._webcamProducer && this._produce && devices.webcamEnabled) {
      this.enableWebcam();
    }

    for (const consumer of Array.from(this._consumers.values())) {
      if (consumer.kind !== 'video') continue;

      this._resumeConsumer(consumer);
    }

    store.dispatch(stateActions.setAudioOnlyState(false));

    store.dispatch(stateActions.setAudioOnlyInProgress(false));
  }

  /**
   * 关闭所有生产者
   */
  async disableAll() {
    return Promise.all([
      this.disableMic(),
      this.disableShare(),
      this.disableWebcam(),
    ]);
  }

  async muteAudio() {
    logger.debug('muteAudio()');

    store.dispatch(stateActions.setAudioMutedState(true));
  }

  async unmuteAudio() {
    logger.debug('unmuteAudio()');

    store.dispatch(stateActions.setAudioMutedState(false));
  }

  async restartIce() {
    logger.debug('restartIce()');

    store.dispatch(stateActions.setRestartIceInProgress(true));

    try {
      if (_isNil(this._protoo)) {
        throw new Error('Cannot get this._protoo');
      }

      if (this._sendTransport) {
        const iceParameters = await this._protoo.request('restartIce', {
          transportId: this._sendTransport.id,
        });

        await this._sendTransport.restartIce({ iceParameters });
      }

      if (this._recvTransport) {
        const iceParameters = await this._protoo.request('restartIce', {
          transportId: this._recvTransport.id,
        });

        await this._recvTransport.restartIce({ iceParameters });
      }

      store.dispatch(
        requestActions.notify({
          text: 'ICE restarted',
        })
      );
    } catch (error) {
      logger.error('restartIce() | failed:%o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `ICE restart failed: ${error}`,
        })
      );
    }

    store.dispatch(stateActions.setRestartIceInProgress(false));
  }

  async setMaxSendingSpatialLayer(spatialLayer) {
    logger.debug('setMaxSendingSpatialLayer() [spatialLayer:%s]', spatialLayer);

    try {
      if (this._webcamProducer)
        await this._webcamProducer.setMaxSpatialLayer(spatialLayer);
      else if (this._shareProducer)
        await this._shareProducer.setMaxSpatialLayer(spatialLayer);
    } catch (error) {
      logger.error('setMaxSendingSpatialLayer() | failed:%o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Error setting max sending video spatial layer: ${error}`,
        })
      );
    }
  }

  async setConsumerPreferredLayers(consumerId, spatialLayer, temporalLayer) {
    logger.debug(
      'setConsumerPreferredLayers() [consumerId:%s, spatialLayer:%s, temporalLayer:%s]',
      consumerId,
      spatialLayer,
      temporalLayer
    );

    try {
      if (_isNil(this._protoo)) {
        throw new Error('Cannot get this._protoo');
      }

      await this._protoo.request('setConsumerPreferredLayers', {
        consumerId,
        spatialLayer,
        temporalLayer,
      });

      store.dispatch(
        stateActions.setConsumerPreferredLayers(
          consumerId,
          spatialLayer,
          temporalLayer
        )
      );
    } catch (error) {
      logger.error('setConsumerPreferredLayers() | failed:%o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Error setting Consumer preferred layers: ${error}`,
        })
      );
    }
  }

  async setConsumerPriority(consumerId, priority) {
    logger.debug(
      'setConsumerPriority() [consumerId:%s, priority:%d]',
      consumerId,
      priority
    );

    try {
      if (_isNil(this._protoo)) {
        throw new Error('Cannot get this._protoo');
      }

      await this._protoo.request('setConsumerPriority', {
        consumerId,
        priority,
      });

      store.dispatch(stateActions.setConsumerPriority(consumerId, priority));
    } catch (error) {
      logger.error('setConsumerPriority() | failed:%o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Error setting Consumer priority: ${error}`,
        })
      );
    }
  }

  async requestConsumerKeyFrame(consumerId) {
    logger.debug('requestConsumerKeyFrame() [consumerId:%s]', consumerId);

    try {
      if (_isNil(this._protoo)) {
        throw new Error('Cannot get this._protoo');
      }

      await this._protoo.request('requestConsumerKeyFrame', { consumerId });

      store.dispatch(
        requestActions.notify({
          text: 'Keyframe requested for video consumer',
        })
      );
    } catch (error) {
      logger.error('requestConsumerKeyFrame() | failed:%o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Error requesting key frame for Consumer: ${error}`,
        })
      );
    }
  }

  async enableChatDataProducer() {
    logger.debug('enableChatDataProducer()');

    if (!this._useDataChannel) return;

    // NOTE: Should enable this code but it's useful for testing.
    // if (this._chatDataProducer)
    // 	return;

    try {
      if (_isNil(this._sendTransport)) {
        throw new Error('Cannot get this._sendTransport');
      }

      // Create chat DataProducer.
      this._chatDataProducer = await this._sendTransport.produceData({
        ordered: false,
        maxRetransmits: 1,
        label: 'chat',
        priority: 'medium',
        appData: { info: 'my-chat-DataProducer' },
      });

      store.dispatch(
        stateActions.addDataProducer({
          id: this._chatDataProducer.id,
          sctpStreamParameters: this._chatDataProducer.sctpStreamParameters,
          label: this._chatDataProducer.label,
          protocol: this._chatDataProducer.protocol,
        })
      );

      this._chatDataProducer.on('transportclose', () => {
        this._chatDataProducer = null;
      });

      this._chatDataProducer.on('open', () => {
        logger.debug('chat DataProducer "open" event');
      });

      this._chatDataProducer.on('close', () => {
        logger.error('chat DataProducer "close" event');

        this._chatDataProducer = null;

        store.dispatch(
          requestActions.notify({
            type: 'error',
            text: 'Chat DataProducer closed',
          })
        );
      });

      this._chatDataProducer.on('error', (error) => {
        logger.error('chat DataProducer "error" event:%o', error);

        store.dispatch(
          requestActions.notify({
            type: 'error',
            text: `Chat DataProducer error: ${error}`,
          })
        );
      });

      this._chatDataProducer.on('bufferedamountlow', () => {
        logger.debug('chat DataProducer "bufferedamountlow" event');
      });
    } catch (error) {
      logger.error('enableChatDataProducer() | failed:%o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Error enabling chat DataProducer: ${error}`,
        })
      );

      throw error;
    }
  }

  async enableBotDataProducer() {
    logger.debug('enableBotDataProducer()');

    if (!this._useDataChannel) return;

    // NOTE: Should enable this code but it's useful for testing.
    // if (this._botDataProducer)
    // 	return;

    try {
      if (_isNil(this._sendTransport)) {
        throw new Error('Cannot get this._sendTransport');
      }

      // Create chat DataProducer.
      this._botDataProducer = await this._sendTransport.produceData({
        ordered: false,
        maxPacketLifeTime: 2000,
        label: 'bot',
        priority: 'medium',
        appData: { info: 'my-bot-DataProducer' },
      });

      store.dispatch(
        stateActions.addDataProducer({
          id: this._botDataProducer.id,
          sctpStreamParameters: this._botDataProducer.sctpStreamParameters,
          label: this._botDataProducer.label,
          protocol: this._botDataProducer.protocol,
        })
      );

      this._botDataProducer.on('transportclose', () => {
        this._botDataProducer = null;
      });

      this._botDataProducer.on('open', () => {
        logger.debug('bot DataProducer "open" event');
      });

      this._botDataProducer.on('close', () => {
        logger.error('bot DataProducer "close" event');

        this._botDataProducer = null;

        store.dispatch(
          requestActions.notify({
            type: 'error',
            text: 'Bot DataProducer closed',
          })
        );
      });

      this._botDataProducer.on('error', (error) => {
        logger.error('bot DataProducer "error" event:%o', error);

        store.dispatch(
          requestActions.notify({
            type: 'error',
            text: `Bot DataProducer error: ${error}`,
          })
        );
      });

      this._botDataProducer.on('bufferedamountlow', () => {
        logger.debug('bot DataProducer "bufferedamountlow" event');
      });
    } catch (error) {
      logger.error('enableBotDataProducer() | failed:%o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Error enabling bot DataProducer: ${error}`,
        })
      );

      throw error;
    }
  }

  async sendChatMessage(text) {
    logger.debug('sendChatMessage() [text:"%s]', text);

    if (!this._chatDataProducer) {
      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: 'No chat DataProducer',
        })
      );

      return;
    }

    try {
      this._chatDataProducer.send(text);
    } catch (error) {
      logger.error('chat DataProducer.send() failed:%o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `chat DataProducer.send() failed: ${error}`,
        })
      );
    }
  }

  async sendBotMessage(text) {
    logger.debug('sendBotMessage() [text:"%s]', text);

    if (!this._botDataProducer) {
      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: 'No bot DataProducer',
        })
      );

      return;
    }

    try {
      this._botDataProducer.send(text);
    } catch (error) {
      logger.error('bot DataProducer.send() failed:%o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `bot DataProducer.send() failed: ${error}`,
        })
      );
    }
  }

  async changeDisplayName(displayName) {
    logger.debug('changeDisplayName() [displayName:"%s"]', displayName);

    // Store in rnStorage.
    settingManager.setUser({ displayName });

    try {
      if (_isNil(this._protoo)) {
        throw new Error('Cannot get this._protoo');
      }

      await this._protoo.request('changeDisplayName', { displayName });

      this._displayName = displayName;

      store.dispatch(stateActions.setDisplayName(displayName));

      store.dispatch(
        requestActions.notify({
          text: 'Display name changed',
        })
      );
    } catch (error) {
      logger.error('changeDisplayName() | failed: %o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Could not change display name: ${error}`,
        })
      );

      // We need to refresh the component for it to render the previous
      // displayName again.
      store.dispatch(stateActions.setDisplayName());
    }
  }

  async getSendTransportRemoteStats() {
    logger.debug('getSendTransportRemoteStats()');

    if (!this._sendTransport) return;

    return this._protoo?.request('getTransportStats', {
      transportId: this._sendTransport.id,
    });
  }

  async getRecvTransportRemoteStats() {
    logger.debug('getRecvTransportRemoteStats()');

    if (!this._recvTransport) return;

    return this._protoo?.request('getTransportStats', {
      transportId: this._recvTransport.id,
    });
  }

  async getAudioRemoteStats() {
    logger.debug('getAudioRemoteStats()');

    if (!this._micProducer) return;

    return this._protoo?.request('getProducerStats', {
      producerId: this._micProducer.id,
    });
  }

  async getVideoRemoteStats() {
    logger.debug('getVideoRemoteStats()');

    const producer = this._webcamProducer || this._shareProducer;

    if (!producer) return;

    return this._protoo?.request('getProducerStats', {
      producerId: producer.id,
    });
  }

  async getConsumerRemoteStats(consumerId) {
    logger.debug('getConsumerRemoteStats()');

    const consumer = this._consumers.get(consumerId);

    if (!consumer) return;

    return this._protoo?.request('getConsumerStats', { consumerId });
  }

  async getChatDataProducerRemoteStats() {
    logger.debug('getChatDataProducerRemoteStats()');

    const dataProducer = this._chatDataProducer;

    if (!dataProducer) return;

    return this._protoo?.request('getDataProducerStats', {
      dataProducerId: dataProducer.id,
    });
  }

  async getBotDataProducerRemoteStats() {
    logger.debug('getBotDataProducerRemoteStats()');

    const dataProducer = this._botDataProducer;

    if (!dataProducer) return;

    return this._protoo?.request('getDataProducerStats', {
      dataProducerId: dataProducer.id,
    });
  }

  async getDataConsumerRemoteStats(dataConsumerId) {
    logger.debug('getDataConsumerRemoteStats()');

    const dataConsumer = this._dataConsumers.get(dataConsumerId);

    if (!dataConsumer) return;

    return this._protoo?.request('getDataConsumerStats', { dataConsumerId });
  }

  async getSendTransportLocalStats() {
    logger.debug('getSendTransportLocalStats()');

    if (!this._sendTransport) return;

    return this._sendTransport.getStats();
  }

  async getRecvTransportLocalStats() {
    logger.debug('getRecvTransportLocalStats()');

    if (!this._recvTransport) return;

    return this._recvTransport.getStats();
  }

  async getAudioLocalStats() {
    logger.debug('getAudioLocalStats()');

    if (!this._micProducer) return;

    return this._micProducer.getStats();
  }

  async getVideoLocalStats() {
    logger.debug('getVideoLocalStats()');

    const producer = this._webcamProducer || this._shareProducer;

    if (!producer) return;

    return producer.getStats();
  }

  async getConsumerLocalStats(consumerId) {
    const consumer = this._consumers.get(consumerId);

    if (!consumer) return;

    return consumer.getStats();
  }

  async applyNetworkThrottle({ uplink, downlink, rtt, secret }) {
    logger.debug(
      'applyNetworkThrottle() [uplink:%s, downlink:%s, rtt:%s]',
      uplink,
      downlink,
      rtt
    );

    try {
      if (_isNil(this._protoo)) {
        throw new Error('Cannot get this._protoo');
      }

      await this._protoo.request('applyNetworkThrottle', {
        uplink,
        downlink,
        rtt,
        secret,
      });
    } catch (error) {
      logger.error('applyNetworkThrottle() | failed:%o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Error applying network throttle: ${error}`,
        })
      );
    }
  }

  async resetNetworkThrottle({ silent = false, secret }) {
    logger.debug('resetNetworkThrottle()');

    try {
      if (_isNil(this._protoo)) {
        throw new Error('Cannot get this._protoo');
      }

      await this._protoo.request('resetNetworkThrottle', { secret });
    } catch (error) {
      if (!silent) {
        logger.error('resetNetworkThrottle() | failed:%o', error);

        store.dispatch(
          requestActions.notify({
            type: 'error',
            text: `Error resetting network throttle: ${error}`,
          })
        );
      }
    }
  }

  private async _joinRoom() {
    logger.debug('_joinRoom()');

    try {
      this._mediasoupDevice = new Device({
        handlerName: this._handlerName,
      });

      if (_isNil(this._protoo)) {
        throw new Error('Cannot get this._protoo');
      }

      const routerRtpCapabilities = await this._protoo.request(
        'getRouterRtpCapabilities'
      );

      await this._mediasoupDevice.load({ routerRtpCapabilities });

      // NOTE: Stuff to play remote audios due to browsers' new autoplay policy.
      //
      // Just get access to the mic and DO NOT close the mic track for a while.
      // Super hack!
      {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const audioTrack = stream.getAudioTracks()[0];

        audioTrack.enabled = false;

        this._hardcodeAudioTrack = audioTrack;

        setTimeout(() => audioTrack.stop(), 120000);
      }

      // Create mediasoup Transport for sending (unless we don't want to produce).
      if (this._produce) {
        const transportInfo = await this._protoo.request(
          'createWebRtcTransport',
          {
            forceTcp: this._forceTcp,
            producing: true,
            consuming: false,
            sctpCapabilities: this._useDataChannel
              ? this._mediasoupDevice.sctpCapabilities
              : undefined,
          }
        );

        const {
          id,
          iceParameters,
          iceCandidates,
          dtlsParameters,
          sctpParameters,
        } = transportInfo;

        this._sendTransport = this._mediasoupDevice.createSendTransport({
          id,
          iceParameters,
          iceCandidates,
          dtlsParameters,
          sctpParameters,
          iceServers: [],
          proprietaryConstraints: PC_PROPRIETARY_CONSTRAINTS,
        });

        this._sendTransport.on(
          'connect',
          (
            { dtlsParameters },
            callback,
            errback // eslint-disable-line no-shadow
          ) => {
            this._protoo
              ?.request('connectWebRtcTransport', {
                transportId: this._sendTransport?.id,
                dtlsParameters,
              })
              .then(callback)
              .catch(errback);
          }
        );

        this._sendTransport.on(
          'produce',
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          async ({ kind, rtpParameters, appData }, callback, errback) => {
            try {
              if (_isNil(this._protoo)) {
                throw new Error('Cannot get this._protoo');
              }

              // eslint-disable-next-line no-shadow
              const { id } = await this._protoo.request('produce', {
                transportId: this._sendTransport?.id,
                kind,
                rtpParameters,
                appData,
              });

              callback({ id });
            } catch (error) {
              errback(error);
            }
          }
        );

        this._sendTransport.on(
          'producedata',
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          async (
            { sctpStreamParameters, label, protocol, appData },
            callback,
            errback
          ) => {
            logger.debug(
              '"producedata" event: [sctpStreamParameters:%o, appData:%o]',
              sctpStreamParameters,
              appData
            );

            try {
              if (_isNil(this._protoo)) {
                throw new Error('Cannot get this._protoo');
              }

              // eslint-disable-next-line no-shadow
              const { id } = await this._protoo.request('produceData', {
                transportId: this._sendTransport?.id,
                sctpStreamParameters,
                label,
                protocol,
                appData,
              });

              callback({ id });
            } catch (error) {
              errback(error);
            }
          }
        );
      }

      // Create mediasoup Transport for sending (unless we don't want to consume).
      if (this._consume) {
        const transportInfo = await this._protoo.request(
          'createWebRtcTransport',
          {
            forceTcp: this._forceTcp,
            producing: false,
            consuming: true,
            sctpCapabilities: this._useDataChannel
              ? this._mediasoupDevice.sctpCapabilities
              : undefined,
          }
        );

        const {
          id,
          iceParameters,
          iceCandidates,
          dtlsParameters,
          sctpParameters,
        } = transportInfo;

        this._recvTransport = this._mediasoupDevice.createRecvTransport({
          id,
          iceParameters,
          iceCandidates,
          dtlsParameters,
          sctpParameters,
          iceServers: [],
        });

        this._recvTransport.on(
          'connect',
          (
            { dtlsParameters },
            callback,
            errback // eslint-disable-line no-shadow
          ) => {
            this._protoo
              ?.request('connectWebRtcTransport', {
                transportId: this._recvTransport?.id,
                dtlsParameters,
              })
              .then(callback)
              .catch(errback);
          }
        );
      }

      // Join now into the room.
      // NOTE: Don't send our RTP capabilities if we don't want to consume.
      const { peers } = await this._protoo.request('join', {
        displayName: this._displayName,
        device: this._device,
        rtpCapabilities: this._consume
          ? this._mediasoupDevice.rtpCapabilities
          : undefined,
        sctpCapabilities:
          this._useDataChannel && this._consume
            ? this._mediasoupDevice.sctpCapabilities
            : undefined,
      });

      store.dispatch(stateActions.setRoomState('connected'));

      // Clean all the existing notifcations.
      store.dispatch(stateActions.removeAllNotifications());

      store.dispatch(
        requestActions.notify({
          text: 'You are in the room!',
          timeout: 3000,
        })
      );

      for (const peer of peers) {
        store.dispatch(
          stateActions.addPeer({ ...peer, consumers: [], dataConsumers: [] })
        );
      }

      // Enable mic/webcam.
      if (this._produce) {
        // Set our media capabilities.
        store.dispatch(
          stateActions.setMediaCapabilities({
            canSendMic: this._mediasoupDevice.canProduce('audio'),
            canSendWebcam: this._mediasoupDevice.canProduce('video'),
          })
        );

        this.enableMic();

        const devicesCookie = await settingManager.getDevices();

        if (
          !devicesCookie ||
          devicesCookie.webcamEnabled ||
          this._externalVideo
        ) {
          this.enableWebcam();
        }

        this._sendTransport?.on('connectionstatechange', (connectionState) => {
          if (connectionState === 'connected') {
            this.enableChatDataProducer();
            this.enableBotDataProducer();
          }
        });
      }

      // NOTE: For testing.
      // if (window.SHOW_INFO) {
      //   const { me } = store.getState();

      //   store.dispatch(stateActions.setRoomStatsPeerId(me.id));
      // }
    } catch (error) {
      logger.error('_joinRoom() failed:%o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Could not join the room: ${error}`,
        })
      );

      this.close();
    }
  }

  private async _updateWebcams() {
    logger.debug('_updateWebcams()');

    // Reset the list.
    this._webcams = new Map();

    logger.debug('_updateWebcams() | calling enumerateDevices()');

    const devices = await navigator.mediaDevices.enumerateDevices();

    for (const device of devices) {
      if (device.kind !== 'videoinput') continue;

      this._webcams.set(device.deviceId, device);
    }

    const array = Array.from(this._webcams.values());
    const len = array.length;
    const currentWebcamId = this._webcam.device
      ? this._webcam.device.deviceId
      : undefined;

    logger.debug('_updateWebcams() [webcams:%o]', array);

    if (len === 0) this._webcam.device = null;
    else if (!this._webcams.has(currentWebcamId))
      this._webcam.device = array[0];

    store.dispatch(stateActions.setCanChangeWebcam(this._webcams.size > 1));
  }

  private _getWebcamType(device) {
    if (/(back|rear)/i.test(device.label)) {
      logger.debug('_getWebcamType() | it seems to be a back camera');

      return 'back';
    } else {
      logger.debug('_getWebcamType() | it seems to be a front camera');

      return 'front';
    }
  }

  private async _pauseConsumer(consumer: MediasoupType.Consumer) {
    if (consumer.paused) return;

    try {
      if (_isNil(this._protoo)) {
        throw new Error('Cannot get this._protoo');
      }

      await this._protoo.request('pauseConsumer', { consumerId: consumer.id });

      consumer.pause();

      store.dispatch(stateActions.setConsumerPaused(consumer.id, 'local'));
    } catch (error) {
      logger.error('_pauseConsumer() | failed:%o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Error pausing Consumer: ${error}`,
        })
      );
    }
  }

  private async _resumeConsumer(consumer: MediasoupType.Consumer) {
    if (!consumer.paused) return;

    try {
      if (_isNil(this._protoo)) {
        throw new Error('Cannot get this._protoo');
      }

      await this._protoo.request('resumeConsumer', { consumerId: consumer.id });

      consumer.resume();

      store.dispatch(stateActions.setConsumerResumed(consumer.id, 'local'));
    } catch (error) {
      logger.error('_resumeConsumer() | failed:%o', error);

      store.dispatch(
        requestActions.notify({
          type: 'error',
          text: `Error resuming Consumer: ${error}`,
        })
      );
    }
  }

  private async _getExternalVideoStream() {
    if (this._externalVideoStream) return this._externalVideoStream;

    if (this._externalVideo.readyState < 3) {
      await new Promise((resolve) =>
        this._externalVideo.addEventListener('canplay', resolve)
      );
    }

    if (this._externalVideo.captureStream)
      this._externalVideoStream = this._externalVideo.captureStream();
    else if (this._externalVideo.mozCaptureStream)
      this._externalVideoStream = this._externalVideo.mozCaptureStream();
    else throw new Error('video.captureStream() not supported');

    return this._externalVideoStream;
  }
}
