import * as React from 'react';
const Fragment = React.Fragment;
import { XMLElement, XMLElementAttributes } from '../parser/xml-parser';
import { XMLBuilderContext } from '../XMLBuilder';
import processor from '../processor/';
import _get from 'lodash/get';
import _set from 'lodash/set';
import { Row } from 'antd';
import styled from 'styled-components';

export default class Base {
  name: string;

  // 预处理tag name
  parseTagName(tagName: string) {
    // 如果是首字母开头。视为没有做定义的内置操作。改为t-xxx的格式防止抛出命名警告
    if (typeof tagName === 'string' && /[A-Z]/.test(tagName[0])) {
      tagName = 't-' + tagName.toLowerCase();
    }

    // 如果是空字符串或者undefined。使用react的Fragment
    if (!tagName) {
      return Fragment;
    }

    return tagName;
  }

  // 生成子元素唯一key
  childrenKey(parentName, childrenName, index) {
    return `${parentName}-${childrenName}-${index}`;
  }

  // 渲染子元素的方法
  renderChildren(childElements = [], context) {
    return childElements.map((el, index) => {
      if (!_get(el, 'attributes.key')) {
        _set(el, 'attributes.key', this.childrenKey(name, el.name, index)); // 增加一个默认的key
      }

      return processor.render(el, context, 'edit');
    });
  }

  // 获取编辑视图
  getEditView(
    tagName: string,
    attributes: XMLElementAttributes,
    elements: Array<XMLElement>,
    context: React.Context<XMLBuilderContext>
  ) {
    return React.createElement(
      this.parseTagName(tagName),
      attributes,
      this.renderChildren(elements, context)
    );
  }

  // 获取详情视图
  getDetailView(
    tagName: string,
    attributes: XMLElementAttributes,
    elements: Array<XMLElement>,
    context: React.Context<XMLBuilderContext>
  ) {
    return React.createElement(
      this.parseTagName(tagName),
      attributes,
      this.renderChildren(elements, context)
    );
  }
}

export const BaseTypeRow = styled(Row)`
  margin-bottom: 0.5rem;
`;
