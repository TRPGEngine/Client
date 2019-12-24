import { combineReducers } from 'redux';
import ui from './ui';
import chat from './chat';
import user from './user';
import cache from './cache';
import note from './note';
import actor from './actor';
import group from './group';
import settings from './settings';

const reducers = {
  ui,
  chat,
  user,
  cache,
  note,
  actor,
  group,
  settings,
};

// 可以从外部传入额外的reducer
export function getCombineReducers(otherReducers = {}) {
  return combineReducers({ ...reducers, ...otherReducers });
}
