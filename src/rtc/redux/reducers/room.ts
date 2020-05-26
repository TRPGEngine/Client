import { createReducer } from '@reduxjs/toolkit';
import {
  setRoomUrl,
  setRoomState,
  setRoomActiveSpeaker,
  setRoomStatsPeerId,
  setRoomFaceDetection,
  removePeer,
} from '../stateActions';

interface StateType {
  url: string;
  state: 'new' | 'connecting' | 'connected' | 'closed';
  activeSpeakerId: string;
  statsPeerId: string;
  faceDetection: boolean;
}

const initialState: StateType = {
  url: null,
  state: 'new', // new/connecting/connected/disconnected/closed,
  activeSpeakerId: null,
  statsPeerId: null,
  faceDetection: false,
};

export default createReducer<StateType>(initialState, (builder) => {
  builder
    .addCase(setRoomUrl, (state, action) => {
      const { url } = action.payload;

      state.url = url;
    })
    .addCase(setRoomState, (state, action) => {
      const roomState = action.payload.state;

      state.state = roomState;
      if (roomState !== 'connected') {
        state.activeSpeakerId = null;
        state.statsPeerId = null;
      }
    })
    .addCase(setRoomActiveSpeaker, (state, action) => {
      const { peerId } = action.payload;
      state.activeSpeakerId = peerId;
    })
    .addCase(setRoomStatsPeerId, (state, action) => {
      const { peerId } = action.payload;

      if (state.statsPeerId === peerId) {
        state.statsPeerId = null;
      } else {
        state.statsPeerId = peerId;
      }
    })
    .addCase(setRoomFaceDetection, (state, action) => {
      const flag = action.payload;

      state.faceDetection = flag;
    })
    .addCase(removePeer, (state, action) => {
      const { peerId } = action.payload;

      if (peerId && peerId === state.activeSpeakerId) {
        state.activeSpeakerId = null;
      }

      if (peerId && peerId === state.statsPeerId) {
        state.statsPeerId = null;
      }
    });
});
