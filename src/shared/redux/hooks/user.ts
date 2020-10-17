import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import { useCachedUserInfo } from '@shared/hooks/useCache';
import { getUserName } from '@shared/utils/data-helper';
import type { UserInfo } from '@redux/types/user';

/**
 * 获取当前用户登录信息
 */
export function useCurrentUserInfo(): Partial<UserInfo> {
  const userInfo = useTRPGSelector((state) => state.user.info);

  return userInfo;
}

/**
 * 获取当前登录用户的UUID
 */
export function useCurrentUserUUID(): string {
  return useTRPGSelector((state) => state.user.info.uuid ?? '');
}

/**
 * 返回用户名
 * @param uuid 用户UUID
 */
export function useUserName(uuid: string) {
  const userinfo = useCachedUserInfo(uuid);

  return getUserName(userinfo);
}
