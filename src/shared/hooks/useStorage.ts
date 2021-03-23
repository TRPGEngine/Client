import { useState, useEffect, useCallback } from 'react';
import { getStorage } from '@shared/manager/storage';

/**
 * 沟通RNStorage的hook
 * TODO: 这里的类型不知道怎么写，有时间研究一下
 * @param key 键
 * @param defaultValue 默认值
 * @param isPersist 是否永久存储
 */
export function useStorage<T = {}>(
  key: string,
  defaultValue?: T,
  isPersist = false
): [T, (val: T) => Promise<T>] {
  const [value, setValue] = useState<T>(defaultValue ?? (null as any));

  useEffect(() => {
    getStorage()
      .get(key, defaultValue)
      .then((val) => setValue(val));
  }, [key]);

  const set = useCallback(
    (val: T): Promise<T> => {
      setValue(val!);

      const p = isPersist
        ? getStorage().save(key, val)
        : getStorage().set(key, val);

      return p.then((val: any) => {
        return val!;
      });
    },
    [key, isPersist]
  );

  return [value, set];
}
