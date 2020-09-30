import { createReducer } from '@reduxjs/toolkit';
import {
  setRoomState,
  addConsumer,
  removeConsumer,
  setConsumerPaused,
  setConsumerResumed,
  setConsumerCurrentLayers,
  setConsumerPreferredLayers,
  setConsumerPriority,
  setConsumerTrack,
  setConsumerScore,
} from '../stateActions';
import { ConsumersStateType } from '../types/consumers';

const initialState: ConsumersStateType = {};

export default createReducer<ConsumersStateType>(initialState, (builder) => {
  builder
    .addCase(setRoomState, (state, action) => {
      const roomState = action.payload.state;

      if (roomState === 'closed') {
        state = {};
      }
    })
    .addCase(addConsumer, (state, action) => {
      const { consumer } = action.payload;

      state[consumer.id] = consumer;
    })
    .addCase(removeConsumer, (state, action) => {
      const { consumerId } = action.payload;

      delete state[consumerId];
    })
    .addCase(setConsumerPaused, (state, action) => {
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
    .addCase(setConsumerResumed, (state, action) => {
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
    .addCase(setConsumerCurrentLayers, (state, action) => {
      const { consumerId, spatialLayer, temporalLayer } = action.payload;
      const consumer = state[consumerId];
      const newConsumer = {
        ...consumer,
        currentSpatialLayer: spatialLayer,
        currentTemporalLayer: temporalLayer,
      };

      state[consumerId] = newConsumer;
    })
    .addCase(setConsumerPreferredLayers, (state, action) => {
      const { consumerId, spatialLayer, temporalLayer } = action.payload;
      const consumer = state[consumerId];
      const newConsumer = {
        ...consumer,
        preferredSpatialLayer: spatialLayer,
        preferredTemporalLayer: temporalLayer,
      };

      state[consumerId] = newConsumer;
    })
    .addCase(setConsumerPriority, (state, action) => {
      const { consumerId, priority } = action.payload;
      const consumer = state[consumerId];
      const newConsumer = { ...consumer, priority };

      state[consumerId] = newConsumer;
    })
    .addCase(setConsumerTrack, (state, action) => {
      const { consumerId, track } = action.payload;
      const consumer = state[consumerId];
      const newConsumer = { ...consumer, track };

      state[consumerId] = newConsumer;
    })
    .addCase(setConsumerScore, (state, action) => {
      const { consumerId, score } = action.payload;
      const consumer = state[consumerId];

      if (!consumer) {
        return;
      }

      const newConsumer = { ...consumer, score };

      state[consumerId] = newConsumer;
    });
});
