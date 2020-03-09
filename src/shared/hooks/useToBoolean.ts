import { useMemo } from 'react';
import { is } from '@shared/utils/string-helper';

/**
 * 确保传入的数据为数组
 */
export function useToBoolean(input: any): boolean {
  return useMemo(() => {
    if (typeof input === 'boolean') {
      return input;
    } else if (typeof input === 'string') {
      return is(input);
    } else {
      return Boolean(input);
    }
  }, [input]);
}
