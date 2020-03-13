import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _isString from 'lodash/isString';
import { useMemo } from 'react';

/**
 * 获取当前jwt的数据并解析
 */
export function useWebTokenInfo(): {} | null {
  const jwt = window.localStorage.getItem('jwt');

  const infoString = useMemo(() => {
    if (_isString(jwt)) {
      return _get(jwt.split('.'), '1'); // 取第二段
    } else {
      return '';
    }
  }, [jwt]);

  const info = useMemo(() => {
    if (_isEmpty(infoString)) {
      return null;
    }

    try {
      return JSON.parse(atob(infoString));
    } catch (e) {
      return null;
    }
  }, [infoString]);

  return info;
}
