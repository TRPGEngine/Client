import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import { useCachedUserInfo } from '@shared/hooks/cache';
import { getUserName } from '@shared/utils/data-helper';

/**
 * 获取当前用户登录信息
 */
export function useCurrentUserInfo() {
  const userInfo = useTRPGSelector((state) => state.user.info);

  return userInfo;
}

/**
 * 获取当前登录用户的UUID
 */
export function useCurrentUserUUID() {
  return useTRPGSelector((state) => state.user.info.uuid);
}

/**
 * 返回用户名
 * @param uuid 用户UUID
 */
export function useUserName(uuid: string) {
  const userinfo = useCachedUserInfo(uuid);

  return getUserName(userinfo);
}
