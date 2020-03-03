import * as tags from '../tags';
import { XMLElement } from '../parser/xml-parser';
import parseText from '../parser/text-parser';
import { XMLBuilderContext } from '../XMLBuilder';
import _has from 'lodash/has';
import _isNil from 'lodash/isNil';
import { compileCode, generateSandboxContext } from './sandbox';
import React from 'react';
import { parseAttrStyle } from './style';
import Debug from 'debug';
const debug = Debug('trpg:layout:processor');

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
  const sandbox = generateSandboxContext(context);

  return evalScript(expression, sandbox);
}

/**
 * 执行源码并返回结果
 * @param sourceCode 源码
 */
export function evalScript(sourceCode: string, sandbox: object) {
  try {
    return compileCode(`return ${sourceCode}`)(sandbox);
  } catch (e) {
    debug(
      'CompileCode Error: \n\tcode: %s\n\tsandbox: %o\n\terror :%s',
      sourceCode,
      sandbox,
      String(e)
    );
    return null;
  }
}

/**
 * @deprecated
 * XML渲染引擎，每次渲染组件都会循环调用该方法
 * 返回一个react vdom
 * @param el XML的ast 节点
 * @param context 上下文，包括状态和dispatch和布局类型
 */
export function render(el: XMLElement, context: XMLBuilderContext) {
  const { type } = el;
  const layoutType = context.layoutType || 'edit';

  // 仅渲染元素类型与文本类型与根节点
  if (!['element', 'text', 'root'].includes(type)) {
    return;
  }

  // type 为文本
  if (type === 'text') {
    return parseDataText(String(el.text), context);
  }

  // type 为 element 或 root
  const { name, attributes, elements } = el;

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
        try {
          const realVal = parseDataText(`{{(${value})}}`, context);
          attributes[realKey] = realVal;
        } catch (e) {
          // 不处理解析错误的变量
          console.warn('Cannot parse attr:', key, value, e);
        }
      });
  }

  // 尝试使用新的注册机制
  const tag = tags.getTag(layoutType, name);
  if (!_isNil(tag)) {
    // 如果存在新机制注册的元素
    return React.createElement(tag, {
      ...attributes,
      _name: name,
      _el: el,
      _childrenEl: elements,
    });
  }
}
