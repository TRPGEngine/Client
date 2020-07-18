import { XMLBuilderContext } from '../XMLBuilder';
import memoizeOne from 'memoize-one';
import { builtinFunc } from './builtinFunc';
import { parseDataText } from './';
import _isEmpty from 'lodash/isEmpty';
import _isString from 'lodash/isString';

/**
 * 生成沙盒上下文
 */
export const generateSandboxContext = memoizeOne(
  (context: XMLBuilderContext) => {
    const sandbox = {
      ...context.state.global,
      ...context.state.data,
      ...context.state,
      ...builtinFunc,
      // tslint:disable-next-line: no-unnecessary-initializer
      evalParse(text: string, fallback: any = undefined) {
        if (_isEmpty(text) || !_isString(text)) {
          return fallback;
        }

        return parseDataText(`{{${text}}}`, context) || fallback;
      },
      getStateData() {
        return { ...context.state.data };
      },
    };

    return sandbox;
  }
);

type Sandbox = {};
const sandboxProxies = new WeakMap<Sandbox, Sandbox>();

/**
 * Usage: compileCode(srcCode)(sandbox)
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
