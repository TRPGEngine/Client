import { useEffect } from 'react';
import { useValueRef } from './useValueRef';

/**
 * 每过一段时间执行一次函数
 * 函数完成后再进入下一个计时
 */
export function useAsyncTimeout(fn: () => Promise<void>, ms: number) {
  const fnRef = useValueRef(fn);

  useEffect(() => {
    function loop() {
      fnRef.current().then(() => {
        setTimeout(() => {
          loop();
        }, ms);
      });
    }

    loop();
  }, [ms]);
}
