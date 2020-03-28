import { useState, useEffect, useCallback } from 'react';
import rnStorage from '@shared/api/rn-storage.api';

export function useRNStorage<T = {}>(
  key: string,
  defaultValue?: T
): [T | null, (val: T) => Promise<T>] {
  const [value, setValue] = useState<T>(defaultValue ?? null);

  useEffect(() => {
    rnStorage.get(key, defaultValue).then((val) => setValue(val));
  }, [key]);

  const set = useCallback(
    (val: T): Promise<T> => {
      return rnStorage.set(key, val).then((val: T) => {
        setValue(val);
        return val;
      });
    },
    [key]
  );

  return [value, set];
}
