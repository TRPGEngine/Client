import constants from '@redux/constants';
import config from '@shared/project.config';
import { SettingsState } from '@redux/types/settings';
import _isNil from 'lodash/isNil';
import _pullAt from 'lodash/pullAt';
import _set from 'lodash/set';
import _merge from 'lodash/merge';
import { createReducer } from '@reduxjs/toolkit';
import { addFavoriteDice, removeFavoriteDice } from '@redux/actions/settings';

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
  ...(config.defaultSettings as any),
  notificationPermission: 'default', // granted, denied, default in web
  config: {},
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(RESET, (state) => {
      state = initialState;
    })
    .addCase(SET_USER_SETTINGS, (state, action: any) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    })
    .addCase(SET_SYSTEM_SETTINGS, (state, action: any) => {
      state.system = {
        ...state.system,
        ...action.payload,
      };
    })
    .addCase(UPDATE_NOTIFICATION_PERMISSION, (state, action: any) => {
      state.notificationPermission = action.payload;
    })
    .addCase(UPDATE_CONFIG, (state, action: any) => {
      _merge(state.config, action.payload);
    })
    .addCase(addFavoriteDice, (state) => {
      if (_isNil(state.user.favoriteDice)) {
        state.user.favoriteDice = [];
      }
      state.user.favoriteDice.push({ title: '常用骰', value: '1d100' });
    })
    .addCase(removeFavoriteDice, (state, action) => {
      _pullAt(state.user.favoriteDice, action.payload);
    })
    .addCase(UPDATE_FAVORITE_DICE, (state, action: any) => {
      _set(state.user, ['favoriteDice', action.index], action.payload);
    });
});
