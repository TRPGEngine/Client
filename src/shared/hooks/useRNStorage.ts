import { useState, useEffect, useCallback } from 'react';
import rnStorage from '@shared/api/rn-storage.api';

/**
 * 沟通RNStorage的hook
 * @param key 键
 * @param defaultValue 默认值
 * @param isPersist 是否永久存储
 */
export function useRNStorage<T = {}>(
  key: string,
  defaultValue?: T,
  isPersist = false
): [T | null, (val: T) => Promise<T>] {
  const [value, setValue] = useState<T | null>(defaultValue ?? null);

  useEffect(() => {
    rnStorage.get(key, defaultValue).then((val) => setValue(val));
  }, [key]);

  const set = useCallback(
    (val: T): Promise<T> => {
      const p = isPersist ? rnStorage.save(key, val) : rnStorage.set(key, val);

      return p.then((val: any) => {
        setValue(val!);
        return val!;
      });
    },
    [key, isPersist]
  );

  return [value, set];
}
