import constants from '@redux/constants';
import config from '@shared/project.config';
import { SettingsState } from '@redux/types/settings';
import produce from 'immer';
import _isNil from 'lodash/isNil';
import _pullAt from 'lodash/pullAt';
import _set from 'lodash/set';
import _merge from 'lodash/merge';

const {
  RESET,
  SET_USER_SETTINGS,
  SET_SYSTEM_SETTINGS,
  UPDATE_NOTIFICATION_PERMISSION,
  UPDATE_CONFIG,
  ADD_FAVORITE_DICE,
  REMOVE_FAVORITE_DICE,
  UPDATE_FAVORITE_DICE,
} = constants;

const initialState: SettingsState = {
  ...config.defaultSettings,
  notificationPermission: 'default', // granted, denied, default in web
  config: {},
};

export default produce((draft: SettingsState, action) => {
  switch (action.type) {
    case RESET:
      return initialState;
    case SET_USER_SETTINGS:
      draft.user = {
        ...draft.user,
        ...action.payload,
      };
      return;
    // return state.set(
    //   'user',
    //   state.get('user').merge(immutable.fromJS(action.payload))
    // );
    case SET_SYSTEM_SETTINGS:
      draft.system = {
        ...draft.system,
        ...action.payload,
      };
      return;
    // return state.set(
    //   'system',
    //   state.get('system').merge(immutable.fromJS(action.payload))
    // );
    case UPDATE_NOTIFICATION_PERMISSION:
      draft.notificationPermission = action.payload;
      return;
    // return state.set('notificationPermission', action.payload);
    case UPDATE_CONFIG: {
      _merge(draft.config, action.payload);
      return;
    }
    case ADD_FAVORITE_DICE:
      if (_isNil(draft.user.favoriteDice)) {
        draft.user.favoriteDice = [];
      }
      draft.user.favoriteDice.push({ title: '常用骰', value: '1d100' });
      return;

    // return state.updateIn(['user', 'favoriteDice'], (list) =>
    //   list.push(immutable.fromJS({ title: '常用骰', value: '1d100' }))
    // );
    case REMOVE_FAVORITE_DICE:
      _pullAt(draft.user.favoriteDice, action.index);
      return;
    // return state.updateIn(['user', 'favoriteDice'], (list) =>
    //   list.delete(action.index)
    // );
    case UPDATE_FAVORITE_DICE:
      _set(draft.user, ['favoriteDice', action.index], action.payload);
      return;
    // return state.setIn(
    //   ['user', 'favoriteDice', action.index],
    //   immutable.fromJS(action.payload)
    // );
  }
}, initialState);
