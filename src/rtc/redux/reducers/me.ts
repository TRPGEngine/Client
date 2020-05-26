import { createReducer } from '@reduxjs/toolkit';
import { DeviceType } from '@src/rtc/type';
import {
  setRoomState,
  setMe,
  setMediaCapabilities,
  setCanChangeWebcam,
  setWebcamInProgress,
  setShareInProgress,
  setDisplayName,
  setAudioOnlyState,
  setAudioOnlyInProgress,
  setAudioMutedState,
  setRestartIceInProgress,
} from '../stateActions';

interface StateType {
  id: string;
  displayName: string;
  displayNameSet: boolean;
  device: DeviceType;
  canSendMic: boolean;
  canSendWebcam: boolean;
  canChangeWebcam: boolean;
  webcamInProgress: boolean;
  shareInProgress: boolean;
  audioOnly: boolean;
  audioOnlyInProgress: boolean;
  audioMuted: boolean;
  restartIceInProgress: boolean;
}

const initialState: StateType = {
  id: null,
  displayName: null,
  displayNameSet: false,
  device: null,
  canSendMic: false,
  canSendWebcam: false,
  canChangeWebcam: false,
  webcamInProgress: false,
  shareInProgress: false,
  audioOnly: false,
  audioOnlyInProgress: false,
  audioMuted: false,
  restartIceInProgress: false,
};

export default createReducer<StateType>(initialState, (builder) => {
  builder
    .addCase(setRoomState, (state, action) => {
      const roomState = action.payload.state;

      if (roomState === 'closed') {
        state.webcamInProgress = false;
        state.shareInProgress = false;
        state.audioOnly = false;
        state.audioOnlyInProgress = false;
        state.audioMuted = false;
        state.restartIceInProgress = false;
      }
    })
    .addCase(setMe, (state, action) => {
      const { peerId, displayName, displayNameSet, device } = action.payload;

      state.id = peerId;
      state.displayName = displayName;
      state.displayNameSet = displayNameSet;
      state.device = device;
    })
    .addCase(setMediaCapabilities, (state, action) => {
      const { canSendMic, canSendWebcam } = action.payload;

      state.canSendMic = canSendMic;
      state.canSendWebcam = canSendWebcam;
    })
    .addCase(setCanChangeWebcam, (state, action) => {
      const canChangeWebcam = action.payload;

      state.canChangeWebcam = canChangeWebcam;
    })
    .addCase(setWebcamInProgress, (state, action) => {
      const { flag } = action.payload;

      state.webcamInProgress = flag;
    })
    .addCase(setShareInProgress, (state, action) => {
      const { flag } = action.payload;

      state.shareInProgress = flag;
    })
    .addCase(setDisplayName, (state, action) => {
      let { displayName } = action.payload;

      // Be ready for undefined displayName (so keep previous one).
      if (!displayName) {
        displayName = state.displayName;
      }

      state.displayName = displayName;
      state.displayNameSet = true;
    })
    .addCase(setAudioOnlyState, (state, action) => {
      const { enabled } = action.payload;

      state.audioOnly = enabled;
    })
    .addCase(setAudioOnlyInProgress, (state, action) => {
      const { flag } = action.payload;

      state.audioOnlyInProgress = flag;
    })
    .addCase(setAudioMutedState, (state, action) => {
      const { enabled } = action.payload;

      state.audioMuted = enabled;
    })
    .addCase(setRestartIceInProgress, (state, action) => {
      const { flag } = action.payload;

      state.restartIceInProgress = flag;
    });
});
