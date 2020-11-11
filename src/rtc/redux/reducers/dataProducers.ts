import { createReducer } from '@reduxjs/toolkit';
import {
  setRoomState,
  addDataProducer,
  removeDataProducer,
} from '../stateActions';
import { DataProducersStateType } from '../types/dataProducers';

const initialState: DataProducersStateType = {};

export default createReducer<DataProducersStateType>(
  initialState,
  (builder) => {
    builder
      .addCase(setRoomState, (state, action) => {
        const roomState = action.payload.state;

        if (roomState === 'closed') {
          state = {};
        }
      })
      .addCase(addDataProducer, (state, action) => {
        const { dataProducer } = action.payload;

        state[dataProducer.id] = dataProducer;
      })
      .addCase(removeDataProducer, (state, action) => {
        const { dataProducerId } = action.payload;

        delete state[dataProducerId];
      });
  }
);
