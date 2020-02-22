import { useMemo, DependencyList, useRef } from 'react';
import _isEqual from 'lodash/isEqual';

/**
 * 深度比较依赖版本的useMemo
 * NOTICE: 适合处理一些简单的依赖，如果依赖深度较大需要考虑是否值得
 */
export function useDeepCompareMemo<T>(
  factory: () => T,
  deps: DependencyList | undefined
): T {
  const ref = useRef<DependencyList | undefined>(undefined);

  if (!ref.current || !_isEqual(deps, ref.current)) {
    ref.current = deps;
  }

  return useMemo(factory, ref.current);
}
