const {
  RESET,
  SET_USER_SETTINGS,
  SET_SYSTEM_SETTINGS,
  UPDATE_NOTIFICATION_PERMISSION,
} = require('../constants');
const config = require('../../../config/project.config');

const immutable = require('immutable');
const initialState = immutable.fromJS({
  ...config.defaultSettings,
  notificationPermission: 'default', // granted, denied, default in web
});

module.exports = function settings(state = initialState, action) {
  switch (action.type) {
    case RESET:
      return initialState;
    case SET_USER_SETTINGS:
      return state.set('user', state.get('user').merge(immutable.Map(action.payload)));
    case SET_SYSTEM_SETTINGS:
      return state.set('system', state.get('system').merge(immutable.Map(action.payload)));
    case UPDATE_NOTIFICATION_PERMISSION:
      return state.set('notificationPermission', action.payload);
    default:
      return state;
  }
}
