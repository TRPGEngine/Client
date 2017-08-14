import { combineReducers } from 'redux-immutable';

const reducers = combineReducers({
  ui: require('./ui')
})

module.exports = reducers;
