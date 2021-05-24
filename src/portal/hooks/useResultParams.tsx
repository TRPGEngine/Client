import { useMemo } from 'react';
import qs from 'qs';

interface ResultParams {
  title: string;
  subTitle: string;
}

/**
 * Result通用获取query参数
 */
export function useResultParams(): ResultParams {
  return useMemo(() => {
    const query = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });

    return {
      title: String(query.title),
      subTitle: String(query.subTitle),
    };
  }, []);
}
