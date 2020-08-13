/**
 * 构建一对get set 方法
 * 用于在不同平台拥有统一方式调用体验
 */

export function buildRegFn<F extends (...args: any[]) => any>(name: string) {
  let func: F;

  const get = (...args: Parameters<F>) => {
    if (!func) {
      throw new Error(`${name} not regist`);
    }
    func(...args);
  };

  const set = (fn: F) => {
    func = fn;
  };

  return [get, set] as const;
}
