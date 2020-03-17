import { PlayerUser, fetchUserInfo } from '@portal/model/player';
import { useState, useEffect } from 'react';

export function useUserInfo(uuid: string): PlayerUser {
  const [userInfo, setUserInfo] = useState<PlayerUser>();

  useEffect(() => {
    fetchUserInfo(uuid).then((info) => setUserInfo(info));
  }, [uuid]);

  return userInfo;
}
