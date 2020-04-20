import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';

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
