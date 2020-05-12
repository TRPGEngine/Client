import { createReducer } from '@reduxjs/toolkit';

const initialState = {};

export default createReducer(initialState, (builder) => {
  builder
    .addCase<string, any>('SET_ROOM_STATE', (state, action) => {
      const roomState = action.payload.state;

      if (roomState === 'closed') {
        state = {};
      }
    })
    .addCase<string, any>('ADD_DATA_PRODUCER', (state, action) => {
      const { dataProducer } = action.payload;

      state[dataProducer.id] = dataProducer;
    })
    .addCase<string, any>('REMOVE_DATA_PRODUCER', (state, action) => {
      const { dataProducerId } = action.payload;

      delete state[dataProducerId];
    });
});
