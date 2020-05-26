import { createReducer } from '@reduxjs/toolkit';
import {
  setRoomState,
  addDataConsumer,
  removeDataConsumer,
} from '../stateActions';

interface StateType {
  [dataConsumerId: string]: {
    id: string;
    sctpStreamParameters: {};
    label: string;
    protocol?: string;
  };
}

const initialState: StateType = {};

export default createReducer<StateType>(initialState, (builder) => {
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
});
