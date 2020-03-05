import React, { useContext, Fragment, useEffect, useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { XMLElement } from '../parser/xml-parser';
import { LayoutStateContext } from '../context/LayoutStateContext';
import { parseDataText } from './index';
import { parseAttrStyle } from './style';
import _has from 'lodash/has';
import _isNil from 'lodash/isNil';
import { getTag } from '../tags';

interface Props {
  node: XMLElement;
}
export const LayoutNode: React.FC<Props> = TMemo((props) => {
  const node = props.node;
  const type = node.type;
  const context = useContext(LayoutStateContext);
  const layoutType = context.layoutType ?? 'edit';

  // 仅渲染元素类型与文本类型与根节点
  if (!['element', 'text', 'root'].includes(type)) {
    return null;
  }

  // type 为文本
  if (type === 'text') {
    return <Fragment>{parseDataText(String(node.text), context)}</Fragment>;
  }

  // type 为 element 或 root
  const { name, attributes, elements } = node;

  const tagProps = useMemo(() => {
    const p = { ...attributes };

    // 预处理style属性
    if (_has(p, 'style')) {
      parseAttrStyle(p);
    }

    // 预处理attributes。 将: 开头的参数作为变量处理
    if (p && typeof p === 'object') {
      Object.keys(p)
        .filter((key) => key.startsWith(':'))
        .forEach((key) => {
          const value = p[key];
          const realKey = key.substr(1);
          try {
            const realVal = parseDataText(`{{(${value})}}`, context);
            p[realKey] = realVal;
          } catch (e) {
            // 不处理解析错误的变量
            console.warn('Cannot parse attr:', key, value, e);
          }
        });
    }

    return p;
  }, [attributes, context]); // TODO: 需要改为动态依赖

  const tag = useMemo(() => {
    return getTag(layoutType, name);
  }, [getTag, layoutType, name]);

  return useMemo(() => {
    if (!_isNil(tag)) {
      // 如果存在新机制注册的元素
      return React.createElement(tag, {
        ...tagProps,
        _name: name,
        _el: node,
        _childrenEl: elements,
      });
    } else {
      return null;
    }
  }, [tag, tagProps, name, node, elements]);
});
LayoutNode.displayName = 'LayoutNode';
