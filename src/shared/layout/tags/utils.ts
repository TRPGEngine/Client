import { Fragment } from 'react';
import _get from 'lodash/get';
import { XMLBuilderState } from '@shared/layout/XMLBuilder';

export type OperationDataType = {
  scope: string;
  field: string;
};

/**
 * 获取需要操作的变量的作用域与操作的变量名
 * 作用域默认为data
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
 * 根据状态获取指定路径数据
 */
export const getStateValue = (state: XMLBuilderState, bindingName: string) => {
  const { scope, field } = getOperationData(bindingName);

  return _get(state, [scope, field].join('.'));
};
