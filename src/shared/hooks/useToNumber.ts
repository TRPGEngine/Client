import { useMemo } from 'react';
import _isNil from 'lodash/isNil';

/**
 * 确保传入数据为数字并缓存
 * @param num 要处理的数字
 */
export function useToNumber(num: any): number {
  const ret = useMemo(() => {
    if (_isNil(num)) {
      return num;
    }

    return Number(num) || 0;
  }, [num]);

  return ret;
}
