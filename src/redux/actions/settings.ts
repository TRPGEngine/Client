import constants from '../constants';
const {
  SET_USER_SETTINGS,
  SET_SYSTEM_SETTINGS,
  UPDATE_NOTIFICATION_PERMISSION,
  ADD_FAVORITE_DICE,
  REMOVE_FAVORITE_DICE,
  UPDATE_FAVORITE_DICE,
} = constants;
import { showAlert } from './ui';
import config from '../../../config/project.config.js';
import rnStorage from '../../api/rnStorage.api';
import * as trpgApi from '../../api/trpg.api';
const api = trpgApi.getInstance();

export const saveSettings = function saveSettings() {
  return async function(dispatch, getState) {
    let userSettings = await rnStorage.save(
      'userSettings',
      getState().getIn(['settings', 'user'])
    );
    let systemSettings = await rnStorage.save(
      'systemSettings',
      getState().getIn(['settings', 'system'])
    );

    console.log('设置保存成功');

    return api.emit(
      'player::saveSettings',
      { userSettings, systemSettings },
      function(data) {
        if (data.result) {
          console.log('设置成功保存到远程服务器');
        }
      }
    );
  };
};

export const setUserSettings = function setUserSettings(payload) {
  return function(dispatch, getState) {
    rnStorage.save(
      'userSettings',
      getState()
        .getIn(['settings', 'user'])
        .merge(payload)
    ); // 异步
    dispatch({ type: SET_USER_SETTINGS, payload });
  };
};

export const setSystemSettings = function setSystemSettings(payload) {
  return function(dispatch, getState) {
    if (
      config.platform !== 'app' &&
      payload.notification !== undefined &&
      payload.notification === true
    ) {
      if (Notification.permission === 'denied') {
        dispatch(showAlert('桌面通知权限已被禁止, 请手动修改后刷新应用'));
        payload.notification = false;
      } else if (Notification.permission === 'default') {
        dispatch(requestNotificationPermission());
      }
    }

    rnStorage.save(
      'systemSettings',
      getState()
        .getIn(['settings', 'system'])
        .merge(payload)
    ); // 异步
    dispatch({ type: SET_SYSTEM_SETTINGS, payload });
  };
};

export const setNotificationPermission = function setNotificationPermission(
  notification
) {
  return { type: UPDATE_NOTIFICATION_PERMISSION, payload: notification };
};

export const requestNotificationPermission = function requestNotificationPermission() {
  return function(dispatch, getState) {
    Notification.requestPermission((result) => {
      console.log('授权结果:', result);
      dispatch(setNotificationPermission(result));

      if (result !== 'granted') {
        // 如果授权不成功, 则回退设置
        dispatch(setSystemSettings({ notification: false }));
      }
    });
  };
};

export const addFavoriteDice = function addFavoriteDice() {
  return { type: ADD_FAVORITE_DICE };
};

export const removeFavoriteDice = function removeFavoriteDice(index) {
  return { type: REMOVE_FAVORITE_DICE, index };
};

export const updateFavoriteDice = function updateFavoriteDice(index, payload) {
  return { type: UPDATE_FAVORITE_DICE, index, payload };
};
