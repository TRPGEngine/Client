import { useState, useEffect } from 'react';
import { isUUID } from '@shared/utils/uuid';
import { PlayerUser, fetchUserInfo } from '@shared/model/player';

/**
 * 通过http请求获取用户信息的hook
 * @param uuid 用户UUID
 */
export function useUserInfo(uuid: string): PlayerUser {
  const [userInfo, setUserInfo] = useState<PlayerUser>();

  useEffect(() => {
    if (isUUID(uuid)) {
      fetchUserInfo(uuid).then((info) => setUserInfo(info));
    }
  }, [uuid]);

  return userInfo ?? ({} as PlayerUser);
}
