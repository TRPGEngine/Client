import { Fragment } from 'react';
import _get from 'lodash/get';
import _set from 'lodash/set';
import { XMLBuilderState, XMLBuilderContext } from '@shared/layout/XMLBuilder';
import { StateDataType, StateActionType } from '@shared/layout/types';

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
 * @param str 要转换的文本
 */
export const tryToNumber = (str: string): number | string => {
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

  return _get(context.state, [scope, field].join('.'));
};

/**
 * 设置状态的值
 */
export const setStateValue = (
  context: XMLBuilderContext,
  bindingName: string,
  value: StateDataType
): void => {
  const { state, dispatch } = context;
  const { scope, field } = getOperationData(bindingName);

  // 该操作是为了能让下面获取到payload。也许需要修改?
  _set(state, [scope, field].join('.'), value);

  dispatch({ type: StateActionType.UpdateData, payload: state[scope], scope });
};
