// 这个文件是用于获取与注册所有可用类型
import type React from 'react';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import { TagBaseShared } from './Base/shared';

/**
 * 新版本的注册机制
 */
type TagType = 'detail' | 'edit';
const tagMap = {
  detail: {},
  edit: {},
};

/**
 * 注册标签
 * @param name 标签名
 * @param detailTag 详情标签组件
 * @param editTag 编辑标签组件 如果不填则注册edit组件为第二个参数得值
 */
export const registerTag = (
  name: string,
  detailTag: React.ComponentType<any>,
  editTag?: React.ComponentType<any>
) => {
  _set(tagMap, ['detail', name], detailTag);
  if (_isNil(editTag)) {
    _set(tagMap, ['edit', name], detailTag);
  } else {
    _set(tagMap, ['edit', name], editTag);
  }
};

export const getTag = (type: TagType, name: string) => {
  return _get(tagMap, [type, name], TagBaseShared);
};
