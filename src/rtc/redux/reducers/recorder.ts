import { createReducer } from '@reduxjs/toolkit';
import { setIsRecordingAudio } from '../stateActions';
import { RecorderStateType } from '../types/recorder';

const initialState: RecorderStateType = {
  isRecordingAudio: false,
};

export default createReducer<RecorderStateType>(initialState, (builder) => {
  builder.addCase(setIsRecordingAudio, (state, action) => {
    state.isRecordingAudio = action.payload;
  });
});
