import { fetchUserInfo, PlayerUser } from '@shared/model/player';
import { getJWTPayload, JWTUserInfoData } from '@shared/utils/jwt-helper';
import { useEffect, useState } from 'react';
import { useTaroToken } from './useTaroToken';

/**
 * Taro 获取用户信息
 */
export function useTaroUserInfo() {
  const token = useTaroToken();
  const [playerUser, setPlayerUser] = useState<PlayerUser | null>(null);

  useEffect(() => {
    if (token === null) {
      return;
    }

    const userInfo = getJWTPayload<JWTUserInfoData>(token);
    const userUUID = userInfo.uuid;
    fetchUserInfo(userUUID).then((info) => {
      setPlayerUser(info);
    });
  }, [token]);

  return playerUser;
}
