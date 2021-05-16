import constants from '../constants';
const {
  SET_USER_SETTINGS,
  SET_SYSTEM_SETTINGS,
  UPDATE_NOTIFICATION_PERMISSION,
  UPDATE_CONFIG,
  ADD_FAVORITE_DICE,
  REMOVE_FAVORITE_DICE,
  UPDATE_FAVORITE_DICE,
  FETCH_REMOTE_SETTINGS,
} = constants;
import config, { DefaultSettings } from '@src/shared/project.config';
import rnStorage from '../../api/rn-storage.api';
import * as trpgApi from '../../api/trpg.api';
import { TRPGAction, createTRPGAsyncThunk } from '@redux/types/__all__';
import type { ServerConfig } from '@redux/types/settings';
import request from '@shared/utils/request';
import { createAction } from '@reduxjs/toolkit';
import { showToasts } from '@shared/manager/ui';
import _once from 'lodash/once';
import { t } from '@shared/i18n';

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

/**
 * 将本地的设置同步到云端
 */
export const saveSettings = function (): TRPGAction {
  return async function (dispatch, getState) {
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
      function (data) {
        if (data.result) {
          console.log('设置成功保存到远程服务器');
        }
      }
    );
  };
};

/**
 * 从云端拉取用户设置
 */
export const fetchRemoteSettings = createTRPGAsyncThunk<void>(
  FETCH_REMOTE_SETTINGS,
  async (_, { dispatch }) => {
    // 从远程获取相关配置

    const res = await api.emitP('player::getSettings');

    if (res.result === true) {
      const { userSettings, systemSettings } = res;

      dispatch(setUserSettings(userSettings));
      dispatch(setSystemSettings(systemSettings));
    }
  }
);

export const setUserSettings = createTRPGAsyncThunk(
  SET_USER_SETTINGS,
  async (payload: Partial<DefaultSettings['user']>, { getState }) => {
    rnStorage.save('userSettings', {
      ...getState().settings.user,
      ...payload,
    }); // 异步

    return payload;
  }
);

const showNotificationPermissionDeniedToasts = _once(() => {
  showToasts(t('桌面通知权限已被禁止'));
});

export const setSystemSettings = function setSystemSettings(
  payload
): TRPGAction {
  return function (dispatch, getState) {
    if (
      config.platform !== 'app' &&
      payload.notification !== undefined &&
      payload.notification === true
    ) {
      if (Notification.permission === 'denied') {
        showNotificationPermissionDeniedToasts();
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
  return function (dispatch, getState) {
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

/**
 * 增加常用骰
 */
export const addFavoriteDice = createAction(ADD_FAVORITE_DICE);

/**
 * 移除常用骰
 * @param index 常用骰位置
 */
export const removeFavoriteDice = createAction(
  REMOVE_FAVORITE_DICE,
  (index: number) => {
    return { payload: index };
  }
);

/**
 * 更新常用骰
 * @param index 更新常用骰
 * @param payload 常用骰信息
 */
export const updateFavoriteDice = function updateFavoriteDice(index, payload) {
  return { type: UPDATE_FAVORITE_DICE, index, payload };
};
