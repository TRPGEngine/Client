import type { CacheKey } from '@redux/types/cache';
import type { GetCacheDispatchActionFn } from '@shared/utils/cache-helper';
import {
  getGroupInfo,
  getUserInfo,
  getTemplateInfo,
  getActorInfo,
} from '@redux/actions/cache';
import { useSelector, useDispatch } from 'react-redux';
import type { TRPGState } from '@redux/types/__all__';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _toPairs from 'lodash/toPairs';
import _fromPairs from 'lodash/fromPairs';
import { useEffect, useMemo, useRef } from 'react';
import type { UserInfo } from '@redux/types/user';
import type { GroupInfo } from '@redux/types/group';
import type { ActorType } from '@redux/types/actor';

// 检查是否需要跳过处理
const isSkipUUID = (uuid: string) =>
  _isNil(uuid) ||
  uuid === '' ||
  typeof uuid !== 'string' ||
  uuid.toString().substr(0, 4) === 'trpg';

interface CacheHookOptions {
  forceFetch?: boolean;
}

/**
 * 用于redux的缓存hook
 * @shared/utils/cache-helper 的 hook版本
 */
function reduxHookCacheFactory<T>(
  cacheScope: CacheKey,
  getCacheDispatch: GetCacheDispatchActionFn
) {
  const isGettingDataUUIDList: string[] = []; // 正在请求的UUID列表

  return function hook(uuid: string, options?: CacheHookOptions): Partial<T> {
    const data = useSelector<TRPGState, T>((state) =>
      _get(state, ['cache', cacheScope, uuid])
    );
    const dispatch = useDispatch();
    const forceFetchRef = useRef(options?.forceFetch ?? false);

    useEffect(() => {
      if (
        (_isNil(data) || forceFetchRef.current === true) &&
        !isSkipUUID(uuid)
      ) {
        // 如果没有数据或设置了强制重新获取 且 不是内置的UUID
        // 从服务端获取缓存信息
        if (isGettingDataUUIDList.indexOf(uuid) === -1) {
          // 没有正在获取缓存信息
          console.log(`缓存[${cacheScope}: ${uuid}]不存在， 自动获取`);
          dispatch(
            getCacheDispatch(uuid, () => {
              // 从列表中移除
              const index = isGettingDataUUIDList.indexOf(uuid);
              if (index !== -1) {
                isGettingDataUUIDList.splice(index, 1);
              }
              forceFetchRef.current = false; // 不论怎么样都置为false 表示已经获取过了
            })
          );
          isGettingDataUUIDList.push(uuid);
        }
      }
    }, [data]);

    if (isSkipUUID(uuid)) {
      // 如果uuid为undefined或null
      // 或以trpg开头
      // 直接返回空Map
      return {};
    }

    return data ?? {};
  };
}

export const useCachedUserInfo = reduxHookCacheFactory<UserInfo>(
  'user',
  (uuid, onCompleted) => getUserInfo(uuid, onCompleted)
);

export const useCachedGroupInfo = reduxHookCacheFactory<GroupInfo>(
  'group',
  (uuid, onCompleted) => getGroupInfo(uuid, onCompleted)
);

export const useCachedActorInfo = reduxHookCacheFactory<ActorType>(
  'actor',
  (uuid, onCompleted) => getActorInfo(uuid, onCompleted)
);

export const useCachedActorTemplateInfo = reduxHookCacheFactory<GroupInfo>(
  'template',
  (uuid, onCompleted) => getTemplateInfo(uuid, onCompleted)
);

/**
 * redux 的批量获取hooks的构造器
 * 用于列表
 * @param cacheScope 缓存的域
 * @param getCacheDispatch 请求缓存的dispatch
 */
function reduxHookCacheListFactory<T>(
  cacheScope: CacheKey,
  getCacheDispatch: GetCacheDispatchActionFn
) {
  const isGettingDataUUIDList: string[] = []; // 正在请求的UUID列表

  return function hook<R = { [uuid: string]: T }>(uuids: string[]): R {
    const cacheList = useSelector<TRPGState, { [uuid: string]: T }>((state) =>
      _get(state, ['cache', cacheScope])
    );
    const dispatch = useDispatch();

    const resMap = useMemo<R>(() => {
      const map = {} as R;
      for (const uuid of uuids) {
        if (_isNil(cacheList[uuid]) && !isSkipUUID(uuid)) {
          // 如果没有数据则请求数据
          // 从服务端获取缓存信息
          if (isGettingDataUUIDList.indexOf(uuid) === -1) {
            // 没有正在获取缓存信息
            console.log(`缓存[${cacheScope}: ${uuid}]不存在， 自动获取`);
            dispatch(
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
          continue;
        }

        // 加入返回的map中
        map[uuid] = cacheList[uuid];
      }

      return map;
    }, [cacheList, uuids.join(',')]);

    return resMap;
  };
}
export const useCachedUserInfoList = reduxHookCacheListFactory<UserInfo>(
  'user',
  (uuid, onCompleted) => getUserInfo(uuid, onCompleted)
);
