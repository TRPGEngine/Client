import { combineReducers } from 'redux-immutable';

const reducers = combineReducers({
  ui: require('./ui'),
  chat: require('./chat'),
  user: require('./user'),
  cache: require('./cache'),
})

module.exports = reducers;
