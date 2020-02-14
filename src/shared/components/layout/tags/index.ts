// 这个文件是用于获取与注册所有可用类型
import React from 'react';
import _set from 'lodash/set';
import _get from 'lodash/get';
import { TagBaseShared } from './Base/shared';

/**
 * 新版本的注册机制
 */
type TagType = 'detail' | 'edit';
const tagMap = {
  detail: {},
  edit: {},
};
export const registerTag = (
  type: TagType,
  name: string,
  tag: React.ComponentType
) => {
  _set(tagMap, [type, name], tag);
};

export const getTag = (type: TagType, name: string) => {
  return _get(tagMap, [type, name], TagBaseShared);
};
