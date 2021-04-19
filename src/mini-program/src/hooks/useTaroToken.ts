import { getStorage } from '@shared/manager/storage';
import { TARO_JWT_KEY } from '@shared/utils/consts';
import { useEffect, useState } from 'react';

/**
 * 管理Taro的Token
 */
export function useTaroToken(): string | null {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getStorage()
      .get(TARO_JWT_KEY, '')
      .then((t) => {
        setToken(String(t));
      });
  }, []);

  return token;
}
