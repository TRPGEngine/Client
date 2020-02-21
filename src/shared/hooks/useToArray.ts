import _isArray from 'lodash/isArray';
import { useMemo } from 'react';

/**
 * 确保传入的数据为数组
 */
export function useToArray(arr: any): any[] {
  return useMemo(() => {
    if (_isArray(arr)) {
      return arr;
    } else {
      return [];
    }
  }, arr);
}
