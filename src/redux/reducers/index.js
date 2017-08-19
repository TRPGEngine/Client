import { combineReducers } from 'redux-immutable';

const reducers = combineReducers({
  ui: require('./ui'),
  chat: require('./chat'),
  user: require('./user'),
})

module.exports = reducers;
