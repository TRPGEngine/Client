import { fetchUserInfo } from '@portal/model/player';
import { useState, useEffect } from 'react';
import { isUUID } from '@shared/utils/uuid';
import { PlayerUser } from '@shared/model/player';

export function useUserInfo(uuid: string): PlayerUser {
  const [userInfo, setUserInfo] = useState<PlayerUser>();

  useEffect(() => {
    if (isUUID(uuid)) {
      fetchUserInfo(uuid).then((info) => setUserInfo(info));
    }
  }, [uuid]);

  return userInfo ?? ({} as PlayerUser);
}
