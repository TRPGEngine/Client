import { useMemo } from 'react';
import { evalScript } from '@shared/components/layout/processor';

/**
 * 确保传入的数据为数组
 */
export function useToFunction(input: any): (...args: any[]) => {} | undefined {
  return useMemo(() => {
    if (typeof input === 'function') {
      return input;
    } else if (typeof input === 'string') {
      return evalScript(input, {});
    } else {
      return undefined;
    }
  }, [input]);
}
