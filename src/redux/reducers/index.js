import { combineReducers } from 'redux-immutable';
const config = require('../../../config/project.config');

const reducers = {
  ui: require('./ui'),
  chat: require('./chat'),
  user: require('./user'),
  cache: require('./cache'),
  note: require('./note'),
  actor: require('./actor'),
  group: require('./group'),
  settings: require('./settings'),
}

if(config.platform==='app') {
  reducers.nav = require('./nav')
}

module.exports = combineReducers(reducers);
