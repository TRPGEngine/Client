import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  url: null,
  state: 'new', // new/connecting/connected/disconnected/closed,
  activeSpeakerId: null,
  statsPeerId: null,
  faceDetection: false,
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase<string, any>('SET_ROOM_URL', (state, action) => {
      const { url } = action.payload;

      state.url = url;
    })
    .addCase<string, any>('SET_ROOM_STATE', (state, action) => {
      const roomState = action.payload.state;

      state.state = roomState;
      if (roomState !== 'connected') {
        state.activeSpeakerId = null;
        state.statsPeerId = null;
      }
    })
    .addCase<string, any>('SET_ROOM_ACTIVE_SPEAKER', (state, action) => {
      const { peerId } = action.payload;
      state.activeSpeakerId = peerId;
    })
    .addCase<string, any>('SET_ROOM_STATS_PEER_ID', (state, action) => {
      const { peerId } = action.payload;

      if (state.statsPeerId === peerId) {
        state.statsPeerId = null;
      } else {
        state.statsPeerId = peerId;
      }
    })
    .addCase<string, any>('SET_FACE_DETECTION', (state, action) => {
      const flag = action.payload;

      state.faceDetection = flag;
    })
    .addCase<string, any>('REMOVE_PEER', (state, action) => {
      const { peerId } = action.payload;

      if (peerId && peerId === state.activeSpeakerId) {
        state.activeSpeakerId = null;
      }

      if (peerId && peerId === state.statsPeerId) {
        state.statsPeerId = null;
      }
    });
});
