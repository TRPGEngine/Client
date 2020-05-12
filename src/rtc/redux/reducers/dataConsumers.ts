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
    .addCase<string, any>('ADD_DATA_CONSUMER', (state, action) => {
      const { dataConsumer } = action.payload;

      state[dataConsumer.id] = dataConsumer;
    })
    .addCase<string, any>('REMOVE_DATA_CONSUMER', (state, action) => {
      const { dataConsumerId } = action.payload;

      delete state[dataConsumerId];
    });
});
