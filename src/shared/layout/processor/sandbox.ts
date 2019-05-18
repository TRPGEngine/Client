type Sandbox = {};

const sandboxProxies = new WeakMap<Sandbox, Sandbox>();

/**
 * Usage: compileCode(srcCode)(context)
 * @param src 要执行的代码
 */
export function compileCode(src: string) {
  src = `with (sandbox) { ${src} }`;
  const code = new Function('sandbox', src);

  function has(target: Sandbox, key: PropertyKey): boolean {
    return true;
  }

  function get(target: Sandbox, key: PropertyKey) {
    if (key === Symbol.unscopables) return undefined;
    return target[String(key)];
  }

  return function(sandbox: Sandbox) {
    if (!sandboxProxies.has(sandbox)) {
      const sandboxProxy = new Proxy<Sandbox>(sandbox, { has, get });
      sandboxProxies.set(sandbox, sandboxProxy);
    }
    return code(sandboxProxies.get(sandbox));
  };
}
