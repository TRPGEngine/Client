import constants from '../constants';
const {
  SET_USER_SETTINGS,
  SET_SYSTEM_SETTINGS,
  UPDATE_NOTIFICATION_PERMISSION,
  UPDATE_CONFIG,
  ADD_FAVORITE_DICE,
  REMOVE_FAVORITE_DICE,
  UPDATE_FAVORITE_DICE,
} = constants;
import { showAlert } from './ui';
import config from '@src/shared/project.config';
import rnStorage from '../../api/rn-storage.api';
import * as trpgApi from '../../api/trpg.api';
import { TRPGAction } from '@redux/types/__all__';
import { ServerConfig } from '@redux/types/settings';
import request from '@shared/utils/request';
// import { message } from 'antd'; // 这里会被app引用 请不要增加antd
const api = trpgApi.getInstance();

/**
 * 初始化配置
 */
export const initConfig = function initConfig(): TRPGAction {
  return async (dispatch, getState) => {
    // 系统设置
    const systemSettings =
      (await rnStorage.get('systemSettings')) || config.defaultSettings.system;
    if (systemSettings) {
      dispatch(setSystemSettings(systemSettings));
    }

    // 个人设置
    const userSettings =
      (await rnStorage.get('userSettings')) || config.defaultSettings.user;
    if (userSettings) {
      dispatch(setUserSettings(userSettings));
    }

    // OAuth 配置
    request('/oauth/enabled', 'get').then(({ data }) => {
      const list = data.list;
      dispatch(
        updateConfig({
          oauth: list,
        })
      );
    });
  };
};

export const saveSettings = function saveSettings() {
  return async function(dispatch, getState) {
    const userSettings = await rnStorage.save(
      'userSettings',
      getState().settings.user
    );
    const systemSettings = await rnStorage.save(
      'systemSettings',
      getState().settings.system
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
    rnStorage.save('userSettings', {
      ...getState().settings.user,
      ...payload,
    }); // 异步
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
        // message.warn('桌面通知权限已被禁止, 请手动修改后刷新应用');
        dispatch(showAlert('桌面通知权限已被禁止'));
        payload.notification = false;
      } else if (Notification.permission === 'default') {
        dispatch(requestNotificationPermission());
      }
    }

    rnStorage.save('systemSettings', {
      ...getState().settings.system,
      ...payload,
    }); // 异步
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

/**
 * 更新服务端全局设置
 * @param config 设置
 */
export const updateConfig = function updateConfig(
  config: ServerConfig
): TRPGAction {
  return {
    type: UPDATE_CONFIG,
    payload: config,
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
