import { useEffect } from 'react';
import { useValueRef } from './useValueRef';
import _isNumber from 'lodash/isNumber';

/**
 * 每过一段时间执行一次函数
 * 函数完成后再进入下一个计时
 */
export function useAsyncTimeout(fn: () => Promise<void>, ms: number) {
  const fnRef = useValueRef(fn);

  useEffect(() => {
    let timer: number;
    function loop() {
      fnRef.current().then(() => {
        timer = setTimeout(() => {
          loop();
        }, ms);
      });
    }

    loop();

    return () => {
      if (_isNumber(timer)) {
        clearTimeout(timer);
      }
    };
  }, [ms]);
}
