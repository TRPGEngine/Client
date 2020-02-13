import { Fragment } from 'react';
import _get from 'lodash/get';
import _set from 'lodash/set';
import _isNil from 'lodash/isNil';
import _clone from 'lodash/clone';
import _toPairs from 'lodash/toPairs';
import _fromPairs from 'lodash/fromPairs';
import {
  XMLBuilderState,
  XMLBuilderContext,
} from '@shared/components/layout/XMLBuilder';
import {
  StateDataType,
  StateActionType,
} from '@shared/components/layout/types';

export type OperationDataType = {
  scope: string;
  field: string;
};

/**
 * 获取需要操作的变量的作用域与操作的变量名
 * 作用域默认为data
 * 用于独立一个path的第一段
 * example:
 * - 'a' => {scope: 'data', field: 'a'}
 * - 'a.b' => {scope: 'a', field: 'b'}
 * - 'a.b.c' => {scope: 'a', field: 'b.c'}
 *
 * @param str 操作参数字符串
 */
export const getOperationData = (str: string): OperationDataType => {
  const [scope, ...fields] = str.split('.');

  if (fields.length > 0) {
    // 如果为abc.def
    return {
      scope,
      field: fields.join('.'),
    };
  } else {
    // 如果为abc
    return {
      scope: 'data',
      field: scope,
    };
  }
};

/**
 * 尝试将文本转化为数字
 * 用于表单数据转换
 * @param str 要转换的文本
 */
export const tryToNumber = (str: string): number | string => {
  if (typeof str === 'string' && str === '') {
    // 空字符串直接返回空字符串
    return '';
  }

  if (typeof str === 'string' && (str.length > 15 || str.startsWith(' '))) {
    // 大于15位的数字视为字符串
    // 输入空格视为字符串
    return str;
  }

  const num = Number(str);
  return !isNaN(num) ? num : str;
};

/**
 * 标准化标签名。返回字符串或空节点
 * @param tagName 标签名
 */
export const normalizeTagName = (tagName: string): string | typeof Fragment => {
  // 如果是首字母开头。视为没有做定义的内置操作。改为t-xxx的格式防止抛出命名警告
  if (typeof tagName === 'string' && /[A-Z]/.test(tagName[0])) {
    tagName = 't-' + tagName.toLowerCase();
  }

  // 如果是空字符串或者undefined。使用react的Fragment
  if (!tagName) {
    return Fragment;
  }

  return tagName;
};

/**
 * 根据上下文获取指定状态的数据
 */
export const getStateValue = (
  context: XMLBuilderContext,
  bindingName: string
): StateDataType => {
  const { scope, field } = getOperationData(bindingName);
  let path = field;
  if (scope !== 'data') {
    path = [scope, field].join('.');
  }

  const ret = _get(context.state.data, path);
  if (typeof ret === 'object') {
    return '';
  }

  return ret;
};

/**
 * 设置状态的值
 */
export const setStateValue = (
  context: XMLBuilderContext,
  bindingName: string,
  value: StateDataType
): void => {
  const { dispatch } = context;
  const { scope, field } = getOperationData(bindingName);

  dispatch({
    type: StateActionType.UpdateData,
    payload: {
      scope,
      field,
      value,
    },
  });
};
/**
 * 将属性中额私有参数提取出来(以下划线开头_的成员变量)
 * 返回一个新的对象
 */
export const removePrivateProps = <T extends object>(props: T): Partial<T> => {
  return _fromPairs(
    _toPairs(props).filter(([key, value]) => !key.startsWith('_'))
  ) as T;
};

/**
 * 处理xml读取到的多行文本
 */
export const parseMultilineText = (text: string) => {
  // 支持\n的渲染 拿到的换行符为\\n
  if (_isNil(text) || typeof text !== 'string') {
    return '';
  }

  return text.replace(new RegExp('\\\\n', 'g'), '\n');
};
