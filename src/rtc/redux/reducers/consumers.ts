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
    .addCase<string, any>('ADD_CONSUMER', (state, action) => {
      const { consumer } = action.payload;

      state[consumer.id] = consumer;
    })
    .addCase<string, any>('REMOVE_CONSUMER', (state, action) => {
      const { consumerId } = action.payload;

      delete state[consumerId];
    })
    .addCase<string, any>('SET_CONSUMER_PAUSED', (state, action) => {
      const { consumerId, originator } = action.payload;
      const consumer = state[consumerId];

      let newConsumer;

      if (originator === 'local') {
        newConsumer = { ...consumer, locallyPaused: true };
      } else {
        newConsumer = { ...consumer, remotelyPaused: true };
      }

      state[consumerId] = newConsumer;
    })
    .addCase<string, any>('SET_CONSUMER_RESUMED', (state, action) => {
      const { consumerId, originator } = action.payload;
      const consumer = state[consumerId];

      let newConsumer;

      if (originator === 'local') {
        newConsumer = { ...consumer, locallyPaused: false };
      } else {
        newConsumer = { ...consumer, remotelyPaused: false };
      }

      state[consumerId] = newConsumer;
    })
    .addCase<string, any>('SET_CONSUMER_CURRENT_LAYERS', (state, action) => {
      const { consumerId, spatialLayer, temporalLayer } = action.payload;
      const consumer = state[consumerId];
      const newConsumer = {
        ...consumer,
        currentSpatialLayer: spatialLayer,
        currentTemporalLayer: temporalLayer,
      };

      state[consumerId] = newConsumer;
    })
    .addCase<string, any>('SET_CONSUMER_PREFERRED_LAYERS', (state, action) => {
      const { consumerId, spatialLayer, temporalLayer } = action.payload;
      const consumer = state[consumerId];
      const newConsumer = {
        ...consumer,
        preferredSpatialLayer: spatialLayer,
        preferredTemporalLayer: temporalLayer,
      };

      state[consumerId] = newConsumer;
    })
    .addCase<string, any>('SET_CONSUMER_PRIORITY', (state, action) => {
      const { consumerId, priority } = action.payload;
      const consumer = state[consumerId];
      const newConsumer = { ...consumer, priority };

      state[consumerId] = newConsumer;
    })
    .addCase<string, any>('SET_CONSUMER_TRACK', (state, action) => {
      const { consumerId, track } = action.payload;
      const consumer = state[consumerId];
      const newConsumer = { ...consumer, track };

      state[consumerId] = newConsumer;
    })
    .addCase<string, any>('SET_CONSUMER_SCORE', (state, action) => {
      const { consumerId, score } = action.payload;
      const consumer = state[consumerId];

      if (!consumer) {
        return;
      }

      const newConsumer = { ...consumer, score };

      state[consumerId] = newConsumer;
    });
});
