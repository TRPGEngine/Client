// 这个文件是用于获取与注册所有可用类型
import Base, { ILayoutType } from './Base';
import React from 'react';
import _set from 'lodash/set';
import _get from 'lodash/get';
const _list: Array<ILayoutType> = [];

interface RegisterType {
  new (): ILayoutType;
}

export const register = (Type: RegisterType) => {
  const type = new Type();
  const name = type.name;
  if (!name) {
    console.warn('register type Error name is require!', Type);
  }
  const isExist = _list.findIndex((val) => val.name === name);
  if (isExist >= 0) {
    return;
  }

  _list.push(type);
};

export const get = (name: string): ILayoutType => {
  const type = _list.find((val) => val.name === name);
  if (type) {
    return type;
  } else {
    const baseType = new Base();
    return baseType;
  }
};

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
  return _get(tagMap, [type, name]);
};
