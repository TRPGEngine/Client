import _flatten from 'lodash/flatten';
import _get from 'lodash/get';

/**
 * 类似于join，但是返回一个数组
 * join会将元素强制转化为字符串
 */
export function joinArray<T, K>(arr: T[], separator: K): (T | K)[] {
  return _flatten(
    arr.map((item, i) => {
      if (i === 0) {
        return [item];
      } else {
        return [separator, item];
      }
    })
  );
}

/**
 * 随机获取数组中的一项
 * @param arr 数组
 */
export function getRandomItem<T>(arr: T[]): T {
  return _get(arr, Math.floor(Math.random() * arr.length));
}
