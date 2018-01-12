import { combineReducers } from 'redux-immutable';
const config = require('../../../config/project.config');

const reducers = combineReducers({
  ui: require('./ui'),
  chat: require('./chat'),
  user: require('./user'),
  cache: require('./cache'),
  note: require('./note'),
  actor: require('./actor'),
  group: require('./group'),
  nav: config.platform==='app' ? require('./nav') : null,
})

module.exports = reducers;
