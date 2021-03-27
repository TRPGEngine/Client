import _isFunction from 'lodash/isFunction';
/**
 * 构建一对get set 方法
 * 用于在不同平台拥有统一方式调用体验
 */

export function buildRegFn<F extends (...args: any) => any>(
  name: string,
  defaultFunc?: F
) {
  let func: F;

  const get = (...args: Parameters<F>): ReturnType<F> => {
    if (!func) {
      if (_isFunction(defaultFunc)) {
        return defaultFunc(...args);
      }

      throw new Error(`${name} not regist`);
    }
    return func(...args);
  };

  const set = (fn: F): void => {
    func = fn;
  };

  return [get, set] as const;
}
