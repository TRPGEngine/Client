import { combineReducers } from 'redux-immutable';

const reducers = combineReducers({
  ui: require('./ui'),
  chat: require('./chat'),
})

module.exports = reducers;
