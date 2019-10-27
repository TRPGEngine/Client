import immutable from 'immutable';
import constants from '@redux/constants';
import config from '@shared/project.config';
import { SettingsState } from '@redux/types/settings';

const {
  RESET,
  SET_USER_SETTINGS,
  SET_SYSTEM_SETTINGS,
  UPDATE_NOTIFICATION_PERMISSION,
  ADD_FAVORITE_DICE,
  REMOVE_FAVORITE_DICE,
  UPDATE_FAVORITE_DICE,
} = constants;

const initialState: SettingsState = immutable.fromJS({
  ...config.defaultSettings,
  notificationPermission: 'default', // granted, denied, default in web
});

export default function settings(state = initialState, action) {
  switch (action.type) {
    case RESET:
      return initialState;
    case SET_USER_SETTINGS:
      return state.set(
        'user',
        state.get('user').merge(immutable.fromJS(action.payload))
      );
    case SET_SYSTEM_SETTINGS:
      return state.set(
        'system',
        state.get('system').merge(immutable.fromJS(action.payload))
      );
    case UPDATE_NOTIFICATION_PERMISSION:
      return state.set('notificationPermission', action.payload);
    case ADD_FAVORITE_DICE:
      return state.updateIn(['user', 'favoriteDice'], (list) =>
        list.push(immutable.fromJS({ title: '常用骰', value: '1d100' }))
      );
    case REMOVE_FAVORITE_DICE:
      return state.updateIn(['user', 'favoriteDice'], (list) =>
        list.delete(action.index)
      );
    case UPDATE_FAVORITE_DICE:
      return state.setIn(
        ['user', 'favoriteDice', action.index],
        immutable.fromJS(action.payload)
      );
    default:
      return state;
  }
}
