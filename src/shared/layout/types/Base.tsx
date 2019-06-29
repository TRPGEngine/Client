import React from 'react';
const Fragment = React.Fragment;
import { XMLElement, XMLElementAttributes } from '../parser/xml-parser';
import * as processor from '../processor/';
import _get from 'lodash/get';
import _set from 'lodash/set';
import { Row } from 'antd';
import styled from 'styled-components';
import { XMLBuilderContext } from '../XMLBuilder';

// defined from facebook/react/packages/react-dom/src/shared/voidElementTags.js
// https://github.com/facebook/react/blob/b0657fde6a/packages/react-dom/src/shared/voidElementTags.js
const voidElementTags = [
  'menuitem',
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

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

  parseMultilineText(text: string) {
    // 支持\n的渲染 拿到的换行符为\\n
    return text.replace(new RegExp('\\\\n', 'g'), '\n');
  }

  // 生成子元素唯一key
  childrenKey(parentName: string, childrenName: string, index: number) {
    return `${parentName}-${childrenName}-${index}`;
  }

  // 当挂载时回调
  onMounted() {}

  /**
   * 渲染子节点的方法
   * @param childElements 子节点自己的相关参数
   * @param context 通用上下文
   */
  renderChildren(
    childElements: Array<XMLElement> = [],
    context: XMLBuilderContext
  ) {
    return childElements.map((el, index) => {
      if (!_get(el, 'attributes.key')) {
        _set(el, 'attributes.key', this.childrenKey(this.name, el.name, index)); // 增加一个默认的key
      }

      if (!_get(el, 'attributes.ref')) {
        _set(el, 'attributes.ref', () => this.onMounted()); // 增加挂载回调
      }

      // NOTE: 所有的组件返回的实例都应当有key. 因为这个元素是map出来的
      return processor.render(el, context, 'edit');
    });
  }

  // 获取编辑视图
  getEditView(
    tagName: string,
    attributes: XMLElementAttributes,
    elements: Array<XMLElement>,
    context: XMLBuilderContext
  ) {
    let childrens = [];
    if (voidElementTags.includes(tagName)) {
      childrens = undefined;
    } else {
      childrens = this.renderChildren(elements, context);
    }

    return React.createElement(
      this.parseTagName(tagName),
      attributes,
      childrens
    );
  }

  // 获取详情视图
  getDetailView(
    tagName: string,
    attributes: XMLElementAttributes,
    elements: Array<XMLElement>,
    context: XMLBuilderContext
  ) {
    let childrens = [];
    if (voidElementTags.includes(tagName)) {
      childrens = undefined;
    } else {
      childrens = this.renderChildren(elements, context);
    }

    return React.createElement(
      this.parseTagName(tagName),
      attributes,
      childrens
    );
  }
}

export const BaseTypeRow = styled(Row)`
  margin-bottom: 0.5rem;
`;
