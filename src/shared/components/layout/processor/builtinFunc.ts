import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _find from 'lodash/find';
import _keys from 'lodash/keys';
import _map from 'lodash/map';
import _inRange from 'lodash/inRange';
import _isString from 'lodash/isString';
import _toNumber from 'lodash/toNumber';
import _isArray from 'lodash/isArray';
import _indexOf from 'lodash/indexOf';
import _flatten from 'lodash/flatten';
import _isObject from 'lodash/isObject';
import _forEach from 'lodash/forEach';
import _assign from 'lodash/assign';
import _concat from 'lodash/concat';
import _range from 'lodash/range';

import Debug from 'debug';
const debug = Debug('trpg:layout:sandbox');

/**
 * 获取沙盒内建函数
 */
export function getBuiltinFunc() {
  return {
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
    _isObject,
    _forEach,
    _assign,
    _concat,
    _indexOf,
    _flatten,
    _range,
    AND(...args: any[]): boolean {
      return args.map(Boolean).reduce((prev, cur) => prev && cur, true);
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
  };
}
