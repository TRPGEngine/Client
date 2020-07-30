import {
  getUserInfo,
  getGroupInfo,
  getTemplateInfo,
  getActorInfo,
  getGroupInviteInfo,
  getFriendInviteInfo,
} from '@redux/actions/cache';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
import { isUserUUID } from './uuid';
import { CacheKey } from '@redux/types/cache';
import { TRPGAction } from '@redux/types/__all__';

let _store;
export const attachStore = function(store) {
  _store = store;
};

export const checkUser = function(uuid, type = 'user') {
  if (!uuid) {
    // 如果UUID不存在。则跳过
    return;
  }

  if (uuid.toString().substr(0, 4) === 'trpg') {
    // 不检测trpg开头的内置系统用户
    return;
  }

  if (!isUserUUID(uuid)) {
    console.warn('该UUID不是一个合法的UUID:', uuid);
    return;
  }

  const store = _store;
  if (!!store && !!store.dispatch) {
    if (type === 'user') {
      getUserInfoCache(uuid);
    }
  } else {
    throw new Error('checkUser func should bind store');
  }
};

export const checkTemplate = function(uuid) {
  const store = _store;
  if (!!store && !!store.dispatch) {
    const state = store.getState();
    const info = _get(state, ['cache', 'template', uuid]);
    if (!info) {
      store.dispatch(getTemplateInfo(uuid));
    }
  } else {
    throw new Error('checkUser func should bind store');
  }
};

export const savecache = function() {
  // TODO
};

export const loadcache = function() {
  // TODO
};

type GetCacheCompletedCallback = () => void;
export type GetCacheDispatchActionFn = (
  uuid: string,
  onCompleted: GetCacheCompletedCallback
) => TRPGAction;

interface ReduxCacheFactoryInstance {
  (uuid: string): any;

  refresh: (uuid: string) => void;
}

/**
 * 一个工厂类，用于生成获取缓存的方法
 * 获取数据缓存，如果缓存已存在则从缓存中获取数据
 * example: const getUserInfoCache = reduxCacheFactory('user');
 * @param cacheScope 缓存对象, 必须是redux cache 下的变量
 */
function reduxCacheFactory(
  cacheScope: CacheKey,
  getCacheDispatch: GetCacheDispatchActionFn
): ReduxCacheFactoryInstance {
  const isGettingDataUUIDList: string[] = [];

  /**
   * 从服务端获取缓存信息
   */
  function _fetchCacheFromServer(uuid: string) {
    if (isGettingDataUUIDList.indexOf(uuid) === -1) {
      // 没有正在获取用户信息
      console.log(`缓存[${cacheScope}: ${uuid}]不存在， 自动获取`);
      _store.dispatch(
        getCacheDispatch(uuid, () => {
          // 从列表中移除
          const index = isGettingDataUUIDList.indexOf(uuid);
          if (index !== -1) {
            isGettingDataUUIDList.splice(index, 1);
          }
        })
      );
      isGettingDataUUIDList.push(uuid);
    }
  }

  function getCache(uuid: string) {
    if (_isNil(_store) || _isNil(_store.dispatch)) {
      throw new Error('get cache func should bind store');
    }

    if (_isNil(uuid) || uuid.toString().substr(0, 4) === 'trpg') {
      // 如果uuid为undefined或null
      // 或以trpg开头
      // 直接返回空Map
      return {};
    }

    const state = _store.getState();
    const data = _get(state, ['cache', cacheScope, uuid]);
    if (!_isNil(data)) {
      return data;
    }

    _fetchCacheFromServer(uuid);

    return {};
  }

  getCache.refresh = (uuid: string) => {
    // 重新获取缓存
    _fetchCacheFromServer(uuid);
  };

  return getCache;
}

/**
 * 用户信息缓存
 * 获取用户信息并缓存，如果缓存中已经有记录了则从缓存中获取
 * @param {string} uuid 用户UUID
 */
export const getUserInfoCache = reduxCacheFactory(
  'user',
  (uuid: string, onCompleted: GetCacheCompletedCallback) =>
    getUserInfo(uuid, onCompleted)
);

/**
 * 团信息缓存
 * 获取团信息并缓存，如果缓存中已经有记录了则从缓存中获取
 * @param {string} uuid 团UUID
 */
export const getGroupInfoCache = reduxCacheFactory(
  'group',
  (uuid: string, onCompleted: GetCacheCompletedCallback) =>
    getGroupInfo(uuid, onCompleted)
);

/**
 * 角色信息缓存
 * 获取角色信息并缓存，如果缓存中已经有记录了则从缓存中获取
 * @param {string} uuid 角色UUID
 */
export const getActorInfoCache = reduxCacheFactory(
  'actor',
  (uuid: string, onCompleted: GetCacheCompletedCallback) =>
    getActorInfo(uuid, onCompleted)
);

/**
 * 模板信息缓存
 * 获取模板信息并缓存，如果缓存中已经有记录了则从缓存中获取
 * @param {string} uuid 角色UUID
 */
export const getTemplateInfoCache = reduxCacheFactory(
  'template',
  (uuid: string, onCompleted: GetCacheCompletedCallback) =>
    getTemplateInfo(uuid, onCompleted)
);

/**
 * 好友邀请信息缓存
 * 获取信息并缓存，如果缓存中已经有记录了则从缓存中获取
 * @param {string} uuid 角色UUID
 */
export const getFriendInviteInfoCache = reduxCacheFactory(
  'friendInvite',
  (uuid: string, onCompleted: GetCacheCompletedCallback) =>
    getFriendInviteInfo(uuid, onCompleted)
);

/**
 * 团邀请信息缓存
 * 获取信息并缓存，如果缓存中已经有记录了则从缓存中获取
 * @param {string} uuid 角色UUID
 */
export const getGroupInviteInfoCache = reduxCacheFactory(
  'groupInvite',
  (uuid: string, onCompleted: GetCacheCompletedCallback) =>
    getGroupInviteInfo(uuid, onCompleted)
);

/**
 * 获取缓存的用户名
 * @param uuid 用户UUID
 */
export const getCachedUserName = (uuid: string): string => {
  const info = getUserInfoCache(uuid);
  return info.nickname ?? info.username ?? '';
};
