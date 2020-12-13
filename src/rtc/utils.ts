import type { RTCStoreType } from './redux';
import _mapValues from 'lodash/mapValues';
import _values from 'lodash/values';
import { Unsubscribe } from '@reduxjs/toolkit';

let isWatching = false;
let unsubscribeWatchingFn: Unsubscribe = () => {};

function buildEventFn(
  store: RTCStoreType,
  onAddTrack: (newTrack: MediaStreamTrack) => void
) {
  const alreadyTrackList: MediaStreamTrack[] = []; // 这是已经存储在列表中的音频轨道
  return () => {
    if (isWatching === false) {
      return;
    }

    const allAudioTracks = _values(store.getState().consumers)
      .map((consumer) => {
        return consumer.track;
      })
      .filter((track) => track.kind === 'audio');

    for (const track of allAudioTracks) {
      if (!alreadyTrackList.includes(track)) {
        alreadyTrackList.push(track);
        onAddTrack(track);
      }
    }
  };
}

export function startWatchAllAudioTrack(
  store: RTCStoreType,
  onAddTrack: (newTrack: MediaStreamTrack) => void
) {
  if (isWatching === true) {
    console.log('[startWatchAllAudioTrack] skip because is watching');
  }

  isWatching = true;
  const fn = buildEventFn(store, onAddTrack);
  fn(); // 开始时先调用一下
  unsubscribeWatchingFn = store.subscribe(fn);
}

export function stopWatchAllAudioTrack() {
  isWatching = false;
  unsubscribeWatchingFn();
}
