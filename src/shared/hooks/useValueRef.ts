import { MutableRefObject, useRef } from 'react';

/**
 * 用于获取数据的引用
 * 以在无需更新的地方使用最新的数据
 */
export function useValueRef<T = any>(watchVal: T): MutableRefObject<T> {
  const ref = useRef<T>(watchVal);
  ref.current = watchVal;

  return ref;
}
