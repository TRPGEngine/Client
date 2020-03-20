import { useEffect, useState } from 'react';

/**
 * 为loading增加一个延时操作
 * 对于loading变为true的值。设定必须保持delay时间后才会返回true
 * 对于loading变为false的值。直接返回false
 *
 * 一般情况下，一个一闪而逝的loading表示反而会让其他人体验到更加长的等待时间
 */
export function useDelayLoading(loading: boolean, delay: number = 200) {
  const [delayLoading, setDelayLoading] = useState(false);
  useEffect(() => {
    if (loading === true && delayLoading === false && delay > 0) {
      // 如果开始为
      const timer = setTimeout(() => {
        if (loading === true) {
          // 如果在delay时间内loading仍为true 则设定delayLoading
          setDelayLoading(true);
        }
      }, delay);

      return () => {
        clearTimeout(timer);
      };
    } else if (loading === false) {
      // 如果loading为false 则立即设置delayLoading为false
      setDelayLoading(false);
    }
  }, [loading]);

  return delayLoading;
}
