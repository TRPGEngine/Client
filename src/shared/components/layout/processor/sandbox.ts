import { XMLBuilderContext } from '../XMLBuilder';
import { parseDataText } from './';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _find from 'lodash/find';
import _keys from 'lodash/keys';
import _map from 'lodash/map';
import _inRange from 'lodash/inRange';
import _isEmpty from 'lodash/isEmpty';
import _isString from 'lodash/isString';
import _toNumber from 'lodash/toNumber';
import _isArray from 'lodash/isArray';
import _indexOf from 'lodash/indexOf';
import _flatten from 'lodash/flatten';
import _range from 'lodash/range';
import Debug from 'debug';
import memoizeOne from 'memoize-one';
const debug = Debug('trpg:layout:sandbox');

/**
 * 生成沙盒上下文
 */
export const generateSandboxContext = memoizeOne(
  (context: XMLBuilderContext) => {
    const sandbox = {
      ...context.state.global,
      ...context.state.data,
      ...context.state,
      Math,
      JSON,
      _get,
      _isNil,
      _find,
      _map,
      _keys,
      _inRange,
      _toNumber,
      _isArray,
      _isString,
      _indexOf,
      _flatten,
      _range,
      AND(a: any, b: any) {
        return a && b;
      },
      evalParse(text: string, fallback: any = undefined) {
        if (_isEmpty(text) || !_isString(text)) {
          return fallback;
        }

        return parseDataText(`{{${text}}}`, context) || fallback;
      },
      debug(first, ...other) {
        debug(first, ...other);
        return first;
      },
      /**
       * 将参数中所有可用的数字加起来
       */
      SUM(...args: any[]) {
        if (args.length === 1 && _isArray(args[0])) {
          args = [...args[0]];
        }
        const nums = args.map(_toNumber).filter((n) => !isNaN(n));

        return nums.reduce((prev, cur) => prev + cur, 0);
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
