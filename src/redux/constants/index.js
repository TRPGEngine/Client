import config from '../../../config/project.config';
import actor from './actor';
import cache from './cache';
import chat from './chat';
import group from './group';
import note from './note';
import ui from './ui';
import user from './user';
import settings from './settings';

// app
import nav from './nav';

const constants = Object.assign(
  {
    RESET: 'RESET',
  },
  actor,
  cache,
  chat,
  group,
  note,
  ui,
  user,
  settings,
  nav,
);

export default constants;
