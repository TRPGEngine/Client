export interface ConsumerInfo {
  id: string;
  type: string;
  locallyPaused: boolean;
  remotelyPaused: boolean;
  rtpParameters: {};
  codec: string;
  spatialLayers: number;
  temporalLayers: number;
  currentSpatialLayer?: number;
  currentTemporalLayer?: number;
  preferredSpatialLayer?: number;
  preferredTemporalLayer?: number;
  priority: number;
  track: MediaStreamTrack;
  score: { ssrc: number; score: number }[];
}

export interface ConsumersStateType {
  [consumerId: string]: ConsumerInfo;
}
