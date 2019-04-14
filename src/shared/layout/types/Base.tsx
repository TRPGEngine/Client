import * as React from 'react';
const Fragment = React.Fragment;
import processor from '../processor/';
import _get from 'lodash/get';
import _set from 'lodash/set';
import { Row } from 'antd';
import styled from 'styled-components';

export default class Base {
  name = 'Base';

  // 预处理tag name
  parseName(name) {
    // 如果是首字母开头。视为没有做定义的内置操作。改为t-xxx的格式防止抛出命名警告
    if (typeof name === 'string' && /[A-Z]/.test(name[0])) {
      name = 't-' + name.toLowerCase();
    }

    // 如果是空字符串或者undefined。使用react的Fragment
    if (!name) {
      name = Fragment;
    }

    return name;
  }

  // 生成子元素唯一key
  childrenKey(parentName, childrenName, index) {
    return `${parentName}-${childrenName}-${index}`;
  }

  // 渲染子元素的方法
  renderChildren(childElements = []) {
    return childElements.map((el, index) => {
      if (!_get(el, 'attributes.key')) {
        _set(el, 'attributes.key', this.childrenKey(name, el.name, index)); // 增加一个默认的key
      }

      return processor.render(el, 'edit');
    });
  }

  // 获取编辑视图
  getEditView(name, attributes, elements) {
    name = this.parseName(name);

    return React.createElement(name, attributes, this.renderChildren(elements));
  }

  // 获取详情视图
  getDetailView(name, attributes, elements) {
    name = this.parseName(name);

    return React.createElement(name, attributes, this.renderChildren(elements));
  }
}

export const BaseTypeRow = styled(Row)`
  margin-bottom: 0.5rem;
`;
