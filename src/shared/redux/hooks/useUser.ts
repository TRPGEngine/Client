import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';

export function useCurrentUserInfo() {
  const userInfo = useTRPGSelector((state) => state.user.info);

  return userInfo;
}
