import request from '@shared/utils/request';
import { useWebToken } from './useWebToken';
import { useCallback } from 'react';

/**
 * 获取带JWT信息的request函数
 */
export function useWebAuthRequest() {
  const jwt = useWebToken();

  return useCallback(
    <T = any>(path: string, method: 'get' | 'post' = 'get', data?: any) => {
      return request<T>(path, method, data, {
        headers: {
          'X-Token': jwt,
        },
      });
    },
    [jwt]
  );
}
