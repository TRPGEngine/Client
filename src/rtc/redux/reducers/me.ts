import { createReducer } from '@reduxjs/toolkit';

const initialState = {
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

export default createReducer(initialState, (builder) => {
  builder
    .addCase<string, any>('SET_ROOM_STATE', (state, action) => {
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
    .addCase<string, any>('SET_ME', (state, action) => {
      const { peerId, displayName, displayNameSet, device } = action.payload;

      state.id = peerId;
      state.displayName = displayName;
      state.displayNameSet = displayNameSet;
      state.device = device;
    })
    .addCase<string, any>('SET_MEDIA_CAPABILITIES', (state, action) => {
      const { canSendMic, canSendWebcam } = action.payload;

      state.canSendMic = canSendMic;
      state.canSendWebcam = canSendWebcam;
    })
    .addCase<string, any>('SET_CAN_CHANGE_WEBCAM', (state, action) => {
      const canChangeWebcam = action.payload;

      state.canChangeWebcam = canChangeWebcam;
    })
    .addCase<string, any>('SET_WEBCAM_IN_PROGRESS', (state, action) => {
      const { flag } = action.payload;

      state.webcamInProgress = flag;
    })
    .addCase<string, any>('SET_SHARE_IN_PROGRESS', (state, action) => {
      const { flag } = action.payload;

      state.shareInProgress = flag;
    })
    .addCase<string, any>('SET_DISPLAY_NAME', (state, action) => {
      let { displayName } = action.payload;

      // Be ready for undefined displayName (so keep previous one).
      if (!displayName) {
        displayName = state.displayName;
      }

      state.displayName = displayName;
      state.displayNameSet = true;
    })
    .addCase<string, any>('SET_AUDIO_ONLY_STATE', (state, action) => {
      const { enabled } = action.payload;

      state.audioOnly = enabled;
    })
    .addCase<string, any>('SET_AUDIO_ONLY_IN_PROGRESS', (state, action) => {
      const { flag } = action.payload;

      state.audioOnlyInProgress = flag;
    })
    .addCase<string, any>('SET_AUDIO_MUTED_STATE', (state, action) => {
      const { enabled } = action.payload;

      state.audioMuted = enabled;
    })
    .addCase<string, any>('SET_RESTART_ICE_IN_PROGRESS', (state, action) => {
      const { flag } = action.payload;

      state.restartIceInProgress = flag;
    });
});
