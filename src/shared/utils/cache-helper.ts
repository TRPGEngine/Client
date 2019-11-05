import {
  getUserInfo,
  getGroupInfo,
  getTemplateInfo,
  getActorInfo,
  getGroupInviteInfo,
} from '@redux/actions/cache';
import immutable, { Map } from 'immutable';
import _isNil from 'lodash/isNil';
import { isUserUUID } from './uuid';
import { CacheScope } from '@redux/types/cache';
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

  let store = _store;
  if (!!store && !!store.dispatch) {
    if (type === 'user') {
      exports.getUserInfoCache(uuid);
    }
  } else {
    throw new Error('checkUser func should bind store');
  }
};

export const checkTemplate = function(uuid) {
  let store = _store;
  if (!!store && !!store.dispatch) {
    const state = store.getState();
    let info = state.getIn(['cache', 'template', uuid]);
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
type GetCacheDispatchActionFn = (
  uuid: string,
  onCompleted: GetCacheCompletedCallback
) => TRPGAction;
/**
 * 一个工厂类，用于生成获取缓存的方法
 * 获取数据缓存，如果缓存已存在则从缓存中获取数据
 * example: const getUserInfoCache = reduxCacheFactory('user');
 * @param cacheScope 缓存对象, 必须是redux cache 下的变量
 */
function reduxCacheFactory(
  cacheScope: CacheScope,
  getCacheDispatch: GetCacheDispatchActionFn
): (uuid: string) => Map<any, any> {
  const isGettingDataUUIDList = [];

  return function getCache(uuid: string) {
    const store = _store;
    if (_isNil(store) || _isNil(store.dispatch)) {
      throw new Error('get cache func should bind store');
    }

    if (uuid.toString().substr(0, 4) === 'trpg') {
      return Map(); // 不检测trpg开头的内置系统信息
    }

    const state = store.getState();
    const data = state.getIn(['cache', cacheScope, uuid]);
    if (data) {
      return data;
    }

    if (isGettingDataUUIDList.indexOf(uuid) === -1) {
      // 没有正在获取用户信息
      console.log(`缓存[${cacheScope}: ${uuid}]不存在， 自动获取`);
      store.dispatch(
        getCacheDispatch(uuid, () => {
          // 从列表中移除
          let index = isGettingDataUUIDList.indexOf(uuid);
          if (index !== -1) {
            isGettingDataUUIDList.splice(index, 1);
          }
        })
      );
      isGettingDataUUIDList.push(uuid);
    }
    return Map();
  };
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
 * 团邀请信息缓存
 * 获取团邀请信息并缓存，如果缓存中已经有记录了则从缓存中获取
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
  return info.get('nickname') || info.get('username') || '';
};
