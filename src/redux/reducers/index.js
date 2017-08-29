import { combineReducers } from 'redux-immutable';

const reducers = combineReducers({
  ui: require('./ui'),
  chat: require('./chat'),
  user: require('./user'),
  cache: require('./cache'),
  note: require('./note'),
})

module.exports = reducers;
