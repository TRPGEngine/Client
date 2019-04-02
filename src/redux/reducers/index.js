import { combineReducers } from 'redux-immutable';
import config from '../../../config/project.config';
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

if (config.platform === 'app') {
  reducers.nav = require('./nav');
}

export default combineReducers(reducers);
