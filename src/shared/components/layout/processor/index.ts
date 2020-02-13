import * as tags from '../tags';
import { XMLElement } from '../parser/xml-parser';
import parseText from '../parser/text-parser';
import { XMLBuilderContext } from '../XMLBuilder';
import _get from 'lodash/get';
import _has from 'lodash/has';
import _isNil from 'lodash/isNil';
import { compileCode } from './sandbox';
import React from 'react';
import { parseAttrStyle } from './style';

export interface LayoutProps {
  _name: string;
  _childrenEl: XMLElement[];
  key: string;
  [attrs: string]: any;
}

// 解析带数据的文本信息。根据state返回实际文本内容
// 格式为{{text}}
export function parseDataText(
  text: string,
  context: XMLBuilderContext
): string {
  const { expression, tokens } = parseText(text);
  const sandbox = context.state;

  return compileCode(`return ${expression}`)(sandbox);
}

/**
 * XML渲染引擎，每次渲染组件都会循环调用该方法
 * 返回一个react vdom
 * @param data XML的ast
 * @param context 上下文，包括状态和dispatch和布局类型
 */
export function render(data: XMLElement, context: XMLBuilderContext) {
  const { type } = data;
  const layoutType = context.layoutType || 'edit';

  // 仅渲染元素类型与文本类型与根节点
  if (!['element', 'text', 'root'].includes(type)) {
    return;
  }

  // type 为文本
  if (type === 'text') {
    return parseDataText(String(data.text), context);
  }

  // type 为 element 或 root
  const { name, attributes, elements } = data;

  // 预处理style属性
  if (_has(attributes, 'style')) {
    parseAttrStyle(attributes);
  }

  // 预处理attributes。 将: 开头的参数作为变量处理
  if (attributes && typeof attributes === 'object') {
    Object.keys(attributes)
      .filter((key) => key.startsWith(':'))
      .forEach((key) => {
        const value = attributes[key];
        const realKey = key.substr(1);
        const realVal = parseDataText(`{{(${value})}}`, context);
        attributes[realKey] = realVal;
      });
  }

  // 尝试使用新的注册机制
  const tag = tags.getTag(layoutType, name);
  if (!_isNil(tag)) {
    // 如果存在新机制注册的元素
    return React.createElement(tag, {
      ...attributes,
      _name: name,
      _childrenEl: elements,
    });
  }

  // 使用老机制
  const _type = tags.get(name);

  if (layoutType === 'edit') {
    return _type.getEditView({
      tagName: name,
      attributes,
      elements: elements || [],
      context,
    });
  } else {
    return _type.getDetailView({
      tagName: name,
      attributes,
      elements: elements || [],
      context,
    });
  }
}
