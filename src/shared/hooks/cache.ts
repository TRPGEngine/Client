import { CacheKey } from '@redux/types/cache';
import { GetCacheDispatchActionFn } from '@shared/utils/cache-helper';
import {
  getGroupInfo,
  getUserInfo,
  getTemplateInfo,
  getActorInfo,
} from '@redux/actions/cache';
import { useSelector, useDispatch } from 'react-redux';
import { TRPGState } from '@redux/types/__all__';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import { useEffect } from 'react';
import { UserInfo } from '@redux/types/user';
import { GroupInfo } from '@redux/types/group';
import { ActorType } from '@redux/types/actor';

/**
 * 用于redux的缓存hook
 * @shared/utils/cache-helper 的 hook版本
 */
function reduxHookCacheFactory<T>(
  cacheScope: CacheKey,
  getCacheDispatch: GetCacheDispatchActionFn
) {
  const isGettingDataUUIDList = []; // 正在请求的UUID列表

  // 检查是否需要跳过处理
  const isSkipUUID = (uuid: string) =>
    _isNil(uuid) || uuid.toString().substr(0, 4) === 'trpg';

  return function hook(uuid: string): Partial<T> {
    const data = useSelector<TRPGState, T>((state) =>
      _get(state, ['cache', cacheScope, uuid])
    );
    const dispatch = useDispatch();

    useEffect(() => {
      if (_isNil(data) && !isSkipUUID(uuid)) {
        // 如果没有数据则请求数据
        // 从服务端获取缓存信息
        if (isGettingDataUUIDList.indexOf(uuid) === -1) {
          // 没有正在获取缓存信息
          console.log(`缓存[${cacheScope}: ${uuid}]不存在， 自动获取`);
          dispatch(
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
