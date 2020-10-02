import { createAction } from '@reduxjs/toolkit';
import type { RoomState } from './types/room';

export const setRoomUrl = createAction('SET_ROOM_URL', (url: string) => {
  return {
    payload: { url },
  };
});

export const setRoomId = createAction(
  'SET_ROOM_ID',
  (roomId: string | null) => {
    return {
      payload: { roomId },
    };
  }
);

export const setRoomState = createAction(
  'SET_ROOM_STATE',
  (state: RoomState) => {
    return {
      payload: { state },
    };
  }
);

export const setRoomActiveSpeaker = createAction(
  'SET_ROOM_ACTIVE_SPEAKER',
  (peerId) => {
    return {
      payload: { peerId },
    };
  }
);

export const setRoomStatsPeerId = createAction(
  'SET_ROOM_STATS_PEER_ID',
  (peerId) => {
    return {
      payload: { peerId },
    };
  }
);

export const setRoomFaceDetection = createAction(
  'SET_FACE_DETECTION',
  (flag) => {
    return {
      payload: flag,
    };
  }
);

export const setMe = createAction(
  'SET_ME',
  ({ peerId, displayName, displayNameSet, device }) => {
    return {
      payload: { peerId, displayName, displayNameSet, device },
    };
  }
);

export const setMediaCapabilities = createAction(
  'SET_MEDIA_CAPABILITIES',
  ({ canSendMic, canSendWebcam }) => {
    return {
      payload: { canSendMic, canSendWebcam },
    };
  }
);

export const setCanChangeWebcam = createAction(
  'SET_CAN_CHANGE_WEBCAM',
  (flag) => {
    return {
      payload: flag,
    };
  }
);

export const setDisplayName = createAction(
  'SET_DISPLAY_NAME',
  (displayName?: string) => {
    return {
      payload: { displayName },
    };
  }
);

export const setAudioOnlyState = createAction(
  'SET_AUDIO_ONLY_STATE',
  (enabled) => {
    return {
      payload: { enabled },
    };
  }
);

export const setAudioOnlyInProgress = createAction(
  'SET_AUDIO_ONLY_IN_PROGRESS',
  (flag) => {
    return {
      type: 'SET_AUDIO_ONLY_IN_PROGRESS',
      payload: { flag },
    };
  }
);

export const setAudioMutedState = createAction(
  'SET_AUDIO_MUTED_STATE',
  (enabled) => {
    return {
      type: 'SET_AUDIO_MUTED_STATE',
      payload: { enabled },
    };
  }
);

export const setRestartIceInProgress = createAction(
  'SET_RESTART_ICE_IN_PROGRESS',
  (flag) => {
    return {
      payload: { flag },
    };
  }
);

export const addProducer = createAction('ADD_PRODUCER', (producer) => {
  return {
    payload: { producer },
  };
});

export const removeProducer = createAction('REMOVE_PRODUCER', (producerId) => {
  return {
    payload: { producerId },
  };
});

export const setProducerPaused = createAction(
  'SET_PRODUCER_PAUSED',
  (producerId) => {
    return {
      payload: { producerId },
    };
  }
);

export const setProducerResumed = createAction(
  'SET_PRODUCER_RESUMED',
  (producerId) => {
    return {
      payload: { producerId },
    };
  }
);

export const setProducerTrack = createAction(
  'SET_PRODUCER_TRACK',
  (producerId, track) => {
    return {
      payload: { producerId, track },
    };
  }
);

export const setProducerScore = createAction(
  'SET_PRODUCER_SCORE',
  (producerId, score) => {
    return {
      payload: { producerId, score },
    };
  }
);

export const addDataProducer = createAction(
  'ADD_DATA_PRODUCER',
  (dataProducer) => {
    return {
      payload: { dataProducer },
    };
  }
);

export const removeDataProducer = createAction(
  'REMOVE_DATA_PRODUCER',
  (dataProducerId) => {
    return {
      payload: { dataProducerId },
    };
  }
);

export const setWebcamInProgress = createAction(
  'SET_WEBCAM_IN_PROGRESS',
  (flag) => {
    return {
      payload: { flag },
    };
  }
);

export const setShareInProgress = createAction(
  'SET_SHARE_IN_PROGRESS',
  (flag) => {
    return {
      payload: { flag },
    };
  }
);

export const addPeer = createAction('ADD_PEER', (peer) => {
  return {
    payload: { peer },
  };
});

export const removePeer = createAction('REMOVE_PEER', (peerId) => {
  return {
    payload: { peerId },
  };
});

export const setPeerDisplayName = createAction(
  'SET_PEER_DISPLAY_NAME',
  (displayName, peerId) => {
    return {
      payload: { displayName, peerId },
    };
  }
);

export const addConsumer = createAction('ADD_CONSUMER', (consumer, peerId) => {
  return {
    payload: { consumer, peerId },
  };
});

export const removeConsumer = createAction(
  'REMOVE_CONSUMER',
  (consumerId, peerId) => {
    return {
      payload: { consumerId, peerId },
    };
  }
);

export const setConsumerPaused = createAction(
  'SET_CONSUMER_PAUSED',
  (consumerId, originator) => {
    return {
      payload: { consumerId, originator },
    };
  }
);

export const setConsumerResumed = createAction(
  'SET_CONSUMER_RESUMED',
  (consumerId, originator) => {
    return {
      payload: { consumerId, originator },
    };
  }
);

export const setConsumerCurrentLayers = createAction(
  'SET_CONSUMER_CURRENT_LAYERS',
  (consumerId, spatialLayer, temporalLayer) => {
    return {
      payload: { consumerId, spatialLayer, temporalLayer },
    };
  }
);

export const setConsumerPreferredLayers = createAction(
  'SET_CONSUMER_PREFERRED_LAYERS',
  (consumerId, spatialLayer, temporalLayer) => {
    return {
      payload: { consumerId, spatialLayer, temporalLayer },
    };
  }
);

export const setConsumerPriority = createAction(
  'SET_CONSUMER_PRIORITY',
  (consumerId, priority) => {
    return {
      payload: { consumerId, priority },
    };
  }
);

export const setConsumerTrack = createAction(
  'SET_CONSUMER_TRACK',
  (consumerId, track) => {
    return {
      payload: { consumerId, track },
    };
  }
);

export const setConsumerScore = createAction(
  'SET_CONSUMER_SCORE',
  (consumerId, score) => {
    return {
      payload: { consumerId, score },
    };
  }
);

export const addDataConsumer = createAction(
  'ADD_DATA_CONSUMER',
  (dataConsumer, peerId) => {
    return {
      payload: { dataConsumer, peerId },
    };
  }
);

export const removeDataConsumer = createAction(
  'REMOVE_DATA_CONSUMER',
  (dataConsumerId, peerId) => {
    return {
      payload: { dataConsumerId, peerId },
    };
  }
);

export const addNotification = createAction(
  'ADD_NOTIFICATION',
  (notification) => {
    return {
      payload: { notification },
    };
  }
);

export const removeNotification = createAction(
  'REMOVE_NOTIFICATION',
  (notificationId) => {
    return {
      payload: { notificationId },
    };
  }
);

export const removeAllNotifications = createAction('REMOVE_ALL_NOTIFICATIONS');
