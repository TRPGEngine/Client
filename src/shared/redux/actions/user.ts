import constants from '../constants';
const {
  RESET,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGIN_TOKEN_SUCCESS,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  SET_WEB_TOKEN,
  FIND_USER_REQUEST,
  FIND_USER_SUCCESS,
  FIND_USER_FAILED,
  UPDATE_INFO_SUCCESS,
  ADD_FRIEND_SUCCESS,
  GET_FRIENDS_SUCCESS,
  SEND_FRIEND_INVITE_SUCCESS,
  AGREE_FRIEND_INVITE_SUCCESS,
  GET_FRIEND_INVITE_SUCCESS,
  REFUSE_FRIEND_INVITE_SUCCESS,
  ADD_FRIEND_INVITE,
} = constants;
import md5 from 'md5';
import rnStorage from '@shared/api/rn-storage.api';
import config from '@shared/project.config';
import * as trpgApi from '@shared/api/trpg.api';
import { showLoading, hideLoading, showAlert, showToast } from './ui';
import {
  checkUser,
  getFriendInviteInfoCache,
} from '@shared/utils/cache-helper';
import {
  runLoginSuccessCallback,
  runLogoutSuccessCallback,
} from '@shared/utils/inject';
import { setUserSettings, setSystemSettings } from './settings';

import { reloadConverseList, getUserEmotion } from './chat';
import { getTemplate, getActor } from './actor';
import { getGroupList, getGroupInvite } from './group';
import { getNote } from './note';
import { loadLocalCache } from './cache';
import { TRPGAction } from '../types/__all__';

const api = trpgApi.getInstance();

// 登录成功后获取数据
function loginSuccess(dispatch, getState) {
  if (!dispatch || !getState) {
    return;
  }

  dispatch(loadLocalCache()); // 加载本地缓存信息
  dispatch(reloadConverseList()); // 重新加载所有会话列表
  dispatch(getFriends());
  dispatch(getFriendsInvite());
  dispatch(getTemplate());
  dispatch(getActor());
  dispatch(getGroupList()); // 获取团列表
  dispatch(getGroupInvite());
  dispatch(getNote());
  dispatch(getSettings()); // 获取服务器上的用户设置信息

  dispatch(getUserEmotion()); // 获取用户表情数据

  dispatch(fetchWebToken()); // 登录成功后立刻获取最新的jwt信息

  runLoginSuccessCallback();
}

export const login = function(username: string, password: string): TRPGAction {
  return function(dispatch, getState) {
    password = md5(password);
    const isApp = config.platform === 'app';
    dispatch({ type: LOGIN_REQUEST });
    return api.emit(
      'player::login',
      { username, password, platform: config.platform, isApp },
      function(data) {
        dispatch(hideLoading());

        if (data.result) {
          // 登录成功
          const { uuid, token, app_token } = data.info;
          if (isApp) {
            // 如果是app的话，则永久储存
            rnStorage.save({ uuid, token: app_token });
          } else {
            rnStorage.set({ uuid, token });
          }
          console.log('set user token, user:', uuid);
          data.info.avatar = config.file.getAbsolutePath(data.info.avatar);
          dispatch({ type: LOGIN_SUCCESS, payload: data.info, isApp });
          loginSuccess(dispatch, getState); // 获取用户信息
        } else {
          rnStorage.remove('uuid');
          rnStorage.remove('token');
          dispatch(
            showAlert({
              type: 'alert',
              title: '登录失败',
              content: data.msg,
            })
          );
          dispatch({ type: LOGIN_FAILED, payload: data.msg });
        }
      }
    );
  };
};

export const loginWithToken = function(
  uuid: string,
  token: string,
  channel = null
): TRPGAction {
  return function(dispatch, getState) {
    const isApp = config.platform === 'app';
    dispatch({ type: LOGIN_REQUEST });
    return api.emit(
      'player::loginWithToken',
      { uuid, token, platform: config.platform, isApp, channel },
      function(data) {
        if (data.result) {
          data.info.avatar = config.file.getAbsolutePath(data.info.avatar);
          dispatch({ type: LOGIN_TOKEN_SUCCESS, payload: data.info, isApp });
          loginSuccess(dispatch, getState); // 获取用户信息
        } else {
          console.log(data);
          dispatch({ type: LOGIN_FAILED, payload: data.msg });
          if (getState().user.isLogin) {
            // 登录超时
            dispatch({ type: RESET }); // 登录超时以后重置数据内容。需要重新获取
            dispatch(
              showAlert({
                type: 'alert',
                title: '登录失败',
                content: '您的登录已超时，请重新登录',
              })
            );
          }
        }
      }
    );
  };
};

// 重新获取一次用户登录后的数据
export const updateAllInfo = function(): TRPGAction {
  return function(dispatch, getState) {
    if (getState().user.isLogin === true) {
      loginSuccess(dispatch, getState);
    }
  };
};

export const logout = function(): TRPGAction {
  const isApp = config.platform === 'app';
  return function(dispatch, getState) {
    const info = getState().user.info;
    const uuid = info.uuid;
    const token = isApp ? info.app_token : info.token;
    dispatch(showLoading());
    dispatch({ type: LOGOUT });
    api.emit('player::logout', { uuid, token, isApp }, function(data) {
      dispatch(hideLoading());
      if (data.result) {
        rnStorage.remove('uuid');
        rnStorage.remove('token');
        runLogoutSuccessCallback();
        dispatch({ type: RESET });
      } else {
        dispatch(showAlert(data.msg));
      }
    });
  };
};

export const register = function(
  username: string,
  password: string,
  onSuccess: () => void
): TRPGAction {
  password = md5(password);
  return function(dispatch, getState) {
    dispatch({ type: REGISTER_REQUEST });
    return api.emit('player::register', { username, password }, function(data) {
      dispatch(hideLoading());
      console.log(data);
      if (data.result) {
        dispatch({ type: REGISTER_SUCCESS, payload: data.results });
        onSuccess && onSuccess();
      } else {
        dispatch({ type: REGISTER_FAILED, payload: data.msg });
        dispatch(
          showAlert({
            type: 'alert',
            title: '注册失败',
            content: data.msg,
          })
        );
      }
    });
  };
};

/**
 * 获取用于web鉴权的jwt
 */
export const fetchWebToken = function(): TRPGAction {
  return function(dispatch, getState) {
    return api.emit('player::getWebToken', null, (data) => {
      const token = data.jwt ?? null;
      rnStorage.set('jwt', token);
      dispatch({
        type: SET_WEB_TOKEN,
        token,
      });
    });
  };
};

export const findUser = function(text: string, type: string): TRPGAction {
  return function(dispatch, getState) {
    dispatch({ type: FIND_USER_REQUEST });

    console.log({ text, type });
    return api.emit('player::findUser', { text, type }, function(data) {
      console.log('findUser', data);
      if (data.result) {
        const list = data.results;
        if (list && list.length > 0) {
          for (const user of list) {
            const uuid = user.uuid;
            if (!!uuid) {
              checkUser(uuid);
            }
            user.avatar = config.file.getAbsolutePath(user.avatar);
          }
        }
        dispatch({ type: FIND_USER_SUCCESS, payload: list });
      } else {
        dispatch({ type: FIND_USER_FAILED, payload: data.msg });
      }
    });
  };
};

export const updateInfo = function(
  updatedData: {},
  onSuccess?: () => void
): TRPGAction {
  return function(dispatch, getState) {
    return api.emit('player::updateInfo', updatedData, function(data) {
      if (data.result) {
        data.user.avatar = config.file.getAbsolutePath(data.user.avatar);
        dispatch({ type: UPDATE_INFO_SUCCESS, payload: data.user });
        onSuccess && onSuccess();
      } else {
        console.error(data.msg);
      }
    });
  };
};

export const changePassword = function(
  oldPassword: string,
  newPassword: string,
  onSuccess?: () => void,
  onError?: (msg: string) => void
): TRPGAction {
  oldPassword = md5(oldPassword);
  newPassword = md5(newPassword);
  return function(dispatch, getState) {
    return api.emit(
      'player::changePassword',
      { oldPassword, newPassword },
      function(data) {
        if (data.result) {
          console.log('密码修改成功');
          onSuccess && onSuccess();
        } else {
          console.error(data.msg);
          onError && onError(data.msg);
        }
      }
    );
  };
};

export const getFriends = function(): TRPGAction {
  return function(dispatch, getState) {
    return api.emit('player::getFriends', {}, function(data) {
      if (data.result) {
        const uuidList = [];
        for (const item of data.list) {
          const uuid = item.uuid;
          uuidList.push(uuid);
          checkUser(uuid);
        }

        dispatch({ type: GET_FRIENDS_SUCCESS, payload: uuidList });
      } else {
        console.error(data.msg);
      }
    });
  };
};

export const getFriendsInvite = function(): TRPGAction {
  return function(dispatch, getState) {
    return api.emit('player::getFriendsInvite', {}, function(data) {
      if (data.result) {
        for (const item of data.res) {
          checkUser(item.from_uuid);
        }
        dispatch({ type: GET_FRIEND_INVITE_SUCCESS, payload: data.res });
      } else {
        console.error(data.msg);
      }
    });
  };
};

/**
 * 发送好友邀请
 * @param uuid 目标用户UUID
 */
export const sendFriendInvite = function(uuid: string): TRPGAction {
  return function(dispatch, getState) {
    return api.emit('player::sendFriendInvite', { to: uuid }, function(data) {
      if (data.result) {
        dispatch(showToast('请求已发送'));
        dispatch({
          type: SEND_FRIEND_INVITE_SUCCESS,
          payload: data.invite,
          uuid,
        });
      } else {
        console.error(data.msg);
        dispatch(showAlert(data.msg));
      }
    });
  };
};

export const agreeFriendInvite = function(inviteUUID: string): TRPGAction {
  return function(dispatch, getState) {
    return api.emit('player::agreeFriendInvite', { uuid: inviteUUID }, function(
      data
    ) {
      if (data.result) {
        checkUser(data.invite.from_uuid);
        dispatch({ type: AGREE_FRIEND_INVITE_SUCCESS, payload: data.invite });
        getFriendInviteInfoCache.refresh(inviteUUID); // 操作成功后重新获取邀请信息缓存
      } else {
        console.error(data.msg);
        dispatch(showAlert(data.msg));
      }
    });
  };
};

export const refuseFriendInvite = function(inviteUUID: string): TRPGAction {
  return function(dispatch, getState) {
    return api.emit(
      'player::refuseFriendInvite',
      { uuid: inviteUUID },
      function(data) {
        if (data.result) {
          dispatch({ type: REFUSE_FRIEND_INVITE_SUCCESS, payload: data.res });
          getFriendInviteInfoCache.refresh(inviteUUID); // 操作成功后重新获取邀请信息缓存
        } else {
          dispatch(showAlert(data.msg));
        }
      }
    );
  };
};

export const addFriendInvite = function(invite: any): TRPGAction {
  return { type: ADD_FRIEND_INVITE, payload: invite };
};

export const getSettings = function(): TRPGAction {
  return function(dispatch, getState) {
    return api.emit('player::getSettings', {}, function(data) {
      if (data.result) {
        const { userSettings, systemSettings } = data;
        dispatch(setUserSettings(userSettings));
        dispatch(setSystemSettings(systemSettings));
      } else {
        console.error(data);
      }
    });
  };
};

export const saveSettings = function(): TRPGAction {
  return function(dispatch, getState) {
    const settings = getState().settings;
    return api.emit(
      'player::saveSettings',
      {
        userSettings: settings.user,
        systemSettings: settings.system,
      },
      function(data) {
        if (!data.result) {
          console.error(data);
        }
      }
    );
  };
};
