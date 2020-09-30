import { createReducer } from '@reduxjs/toolkit';
import { DeviceType } from '@src/rtc/type';
import {
  setRoomState,
  addPeer,
  removePeer,
  setPeerDisplayName,
  addConsumer,
  removeConsumer,
  addDataConsumer,
  removeDataConsumer,
} from '../stateActions';
import { PeersStateType } from '../types/peers';

const initialState: PeersStateType = {};

export default createReducer<PeersStateType>(initialState, (builder) => {
  builder
    .addCase(setRoomState, (state, action) => {
      const roomState = action.payload.state;

      if (roomState === 'closed') {
        state = {};
      }
    })
    .addCase(addPeer, (state, action) => {
      const { peer } = action.payload;

      state[peer.id] = peer;
    })
    .addCase(removePeer, (state, action) => {
      const { peerId } = action.payload;

      delete state[peerId];
    })
    .addCase(setPeerDisplayName, (state, action) => {
      const { displayName, peerId } = action.payload;
      const peer = state[peerId];

      if (!peer) {
        throw new Error('no Peer found');
      }

      peer.displayName = displayName;
    })
    .addCase(addConsumer, (state, action) => {
      const { consumer, peerId } = action.payload;
      const peer = state[peerId];

      if (!peer) {
        throw new Error('no Peer found');
      }

      peer.consumers = [...peer.consumers, consumer.id];
    })
    .addCase(removeConsumer, (state, action) => {
      const { consumerId, peerId } = action.payload;
      const peer = state[peerId];

      // NOTE: This means that the Peer was closed before, so it's ok.
      if (!peer) {
        return;
      }

      const idx = peer.consumers.indexOf(consumerId);
      if (idx === -1) {
        throw new Error('Consumer not found');
      }

      const newConsumers = peer.consumers.slice();

      newConsumers.splice(idx, 1);

      const newPeer = { ...peer, consumers: newConsumers };

      state[newPeer.id] = newPeer;
    })
    .addCase(addDataConsumer, (state, action) => {
      const { dataConsumer, peerId } = action.payload;

      // special case for bot DataConsumer.
      if (!peerId) {
        return;
      }

      const peer = state[peerId];

      if (!peer) {
        throw new Error('no Peer found for new DataConsumer');
      }

      const newDataConsumers = [...peer.dataConsumers, dataConsumer.id];

      peer.dataConsumers = newDataConsumers;
    })
    .addCase(removeDataConsumer, (state, action) => {
      const { dataConsumerId, peerId } = action.payload;

      // special case for bot DataConsumer.
      if (!peerId) {
        return;
      }

      const peer = state[peerId];

      // NOTE: This means that the Peer was closed before, so it's ok.
      if (!peer) {
        return;
      }

      const idx = peer.dataConsumers.indexOf(dataConsumerId);
      if (idx === -1) {
        throw new Error('DataConsumer not found');
      }

      const newDataConsumers = peer.dataConsumers.slice();

      newDataConsumers.splice(idx, 1);

      peer.dataConsumers = newDataConsumers;
    });
});
