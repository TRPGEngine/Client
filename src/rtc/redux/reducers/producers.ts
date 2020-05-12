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
    .addCase<string, any>('ADD_PRODUCER', (state, action) => {
      const { producer } = action.payload;

      state[producer.id] = producer;
    })
    .addCase<string, any>('REMOVE_PRODUCER', (state, action) => {
      const { producerId } = action.payload;

      delete state[producerId];
    })
    .addCase<string, any>('SET_PRODUCER_PAUSED', (state, action) => {
      const { producerId } = action.payload;
      const producer = state[producerId];
      const newProducer = { ...producer, paused: true };

      state[producerId] = newProducer;
    })
    .addCase<string, any>('SET_PRODUCER_RESUMED', (state, action) => {
      const { producerId } = action.payload;
      const producer = state[producerId];
      const newProducer = { ...producer, paused: false };

      state[producerId] = newProducer;
    })
    .addCase<string, any>('SET_PRODUCER_TRACK', (state, action) => {
      const { producerId, track } = action.payload;
      const producer = state[producerId];
      const newProducer = { ...producer, track };

      state[producerId] = newProducer;
    })
    .addCase<string, any>('SET_PRODUCER_SCORE', (state, action) => {
      const { producerId, score } = action.payload;
      const producer = state[producerId];

      if (!producer) {
        return;
      }

      const newProducer = { ...producer, score };
      state[producerId] = newProducer;
    });
});
