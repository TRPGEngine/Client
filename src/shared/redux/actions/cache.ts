import constants from '../constants';
const {
  GET_USER_INFO,
  GET_TEMPLATE_INFO,
  GET_ACTOR_INFO,
  GET_GROUP_INFO_SUCCESS,
  GET_FRIEND_INVITE_INFO,
  GET_GROUP_INVITE_INFO,
} = constants;
import * as trpgApi from '@shared/api/trpg.api';
const api = trpgApi.getInstance();
import config from '@shared/project.config';
import rnStorage from '@shared/api/rn-storage.api';
import type { TRPGAction } from '@shared/redux/types/__all__';
import _isNil from 'lodash/isNil';
import { showToasts } from '@shared/manager/ui';

// 加载本地缓存信息
export const loadLocalCache = function () {
  return function (dispatch, getState) {
    // TODO: 用户缓存，列表缓存，等等等等
    rnStorage.get('localCache').then((res) => {
      console.log('TODO: loadLocalCache', res); // TODO: 待实现
    });
  };
};

export const saveLocalCache = function (): TRPGAction {
  return function (dispatch, getState) {
    console.log('save local cache');
    const usercache = getState().cache.user;
    const templatecache = getState().cache.template;

    const saveData = { usercache, templatecache };
    rnStorage.save('localCache', saveData); // TODO: 可能需要一个优化。用一个存储列表来处理短时间多次请求保存本地缓存的问题
  };
};

export const getUserInfo = function (uuid, onCompleted?) {
  if (!uuid) {
    throw new Error('getUserInfo need uuid');
  }

  return function (dispatch, getState) {
    return api.emit('player::getInfo', { type: 'user', uuid }, function (data) {
      if (data.result) {
        data.info.avatar = config.file.getAbsolutePath!(data.info.avatar);
        dispatch({ type: GET_USER_INFO, payload: data.info });
        dispatch(saveLocalCache()); // 保存到本地缓存
      } else {
        console.error(data.msg);
      }

      onCompleted && onCompleted(data);
    });
  };
};

/**
 * 获取角色模板信息
 */
export const getTemplateInfo = function (
  uuid: string,
  onCompleted?: () => void
): TRPGAction {
  if (!uuid) {
    throw new Error('getTemplateInfo need uuid');
  }

  const cacheKey = `cache$template#${uuid}`;

  return async function (dispatch, getState) {
    // 先尝试从storage中获取
    try {
      const cache = await rnStorage.get(cacheKey);
      if (!_isNil(cache)) {
        dispatch({ type: GET_TEMPLATE_INFO, payload: cache });
        onCompleted && onCompleted();
        return;
      }
    } catch (err) {}

    // 没有在缓存中找到
    console.log('没有在缓存中找到');
    const data = await api.emitP('actor::getTemplate', { uuid });

    if (data.result) {
      const template = data.template;
      if (template) {
        dispatch({ type: GET_TEMPLATE_INFO, payload: template });
        rnStorage.set(cacheKey, template); // 添加到缓存中
      } else {
        showToasts(`获取模板失败, 该模板不存在: ${uuid}`);
      }
    } else {
      console.error(data.msg);
    }

    onCompleted && onCompleted();
  };
};

export const getActorInfo = function (uuid, onCompleted?) {
  if (!uuid) {
    throw new Error('getActorInfo need uuid');
  }

  return function (dispatch, getState) {
    return api.emit('actor::getActor', { uuid }, function (data) {
      if (data.result) {
        const actor = data.actor ? data.actor : data.actors[0];
        actor.avatar = config.file.getAbsolutePath!(actor.avatar);
        dispatch({ type: GET_ACTOR_INFO, payload: actor });
      } else {
        console.error(data.msg);
      }

      onCompleted && onCompleted(data);
    });
  };
};

/**
 * 获取团信息
 * @param {string} uuid 团唯一标识
 * @param {function} onCompleted 完成后回调
 */
export const getGroupInfo = function (uuid, onCompleted?) {
  if (!uuid) {
    throw new Error('getGroupInfo need uuid');
  }

  return function (dispatch, getState) {
    return api.emit('group::getInfo', { uuid }, function (data) {
      if (data.result) {
        data.group.avatar = config.file.getAbsolutePath!(data.group.avatar);
        dispatch({ type: GET_GROUP_INFO_SUCCESS, payload: data.group });
      } else {
        console.error(data.msg);
      }

      onCompleted && onCompleted(data);
    });
  };
};

export const getFriendInviteInfo = (
  uuid: string,
  onCompleted?: (data) => void
): TRPGAction => {
  if (!uuid) {
    throw new Error('getGroupInviteInfo need uuid');
  }

  return function (dispatch, getState) {
    return api.emit('player::getFriendInviteDetail', { uuid }, function (data) {
      if (data.result) {
        dispatch({ type: GET_FRIEND_INVITE_INFO, payload: data.invite });
      } else {
        console.error(data.msg);
        showToasts(data.msg);
      }

      onCompleted && onCompleted(data);
    });
  };
};

/**
 * 获取团邀请的详情内容
 * @param uuid 团邀请UUID
 * @param onCompleted 完成回调
 */
export const getGroupInviteInfo = (
  uuid: string,
  onCompleted?: (data) => void
): TRPGAction => {
  if (!uuid) {
    throw new Error('getGroupInviteInfo need uuid');
  }

  return function (dispatch, getState) {
    return api.emit('group::getGroupInviteDetail', { uuid }, function (data) {
      if (data.result) {
        dispatch({ type: GET_GROUP_INVITE_INFO, payload: data.invite });
      } else {
        console.error(data.msg);
      }

      onCompleted && onCompleted(data);
    });
  };
};
