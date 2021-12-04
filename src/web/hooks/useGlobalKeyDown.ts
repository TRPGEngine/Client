import { useLayoutEffect } from 'react';
import { useUpdateRef } from './useUpdateRef';

/**
 * keydown hooks
 * 仅接受最初的函数
 */
export function useGlobalKeyDown(fn: (e: KeyboardEvent) => void) {
  const fnRef = useUpdateRef(fn);

  useLayoutEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      typeof fnRef.current === 'function' && fnRef.current(e);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
