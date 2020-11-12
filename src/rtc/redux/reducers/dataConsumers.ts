import { createReducer } from '@reduxjs/toolkit';
import {
  setRoomState,
  addDataConsumer,
  removeDataConsumer,
} from '../stateActions';
import { DataConsumersStateType } from '../types/dataConsumers';

const initialState: DataConsumersStateType = {};

export default createReducer<DataConsumersStateType>(
  initialState,
  (builder) => {
    builder
      .addCase(setRoomState, (state, action) => {
        const roomState = action.payload.state;

        if (roomState === 'closed') {
          state = {};
        }
      })
      .addCase(addDataConsumer, (state, action) => {
        const { dataConsumer } = action.payload;

        state[dataConsumer.id] = dataConsumer;
      })
      .addCase(removeDataConsumer, (state, action) => {
        const { dataConsumerId } = action.payload;

        delete state[dataConsumerId];
      });
  }
);
