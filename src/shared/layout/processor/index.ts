import * as types from '../types';
import { XMLElement } from '../parser/xml-parser';
import parseText from '../parser/text-parser';
import { XMLBuilderContext } from '../XMLBuilder';
import _get from 'lodash/get';
import { compileCode } from './sandbox';

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
 * XML渲染引擎，是一个入口
 * 返回一个react vdom
 * @param data XML的ast
 * @param context 上下文，包括状态和dispatch
 * @param layoutType 布局类型, 为edit或detail
 */
export function render(
  data: XMLElement,
  context: XMLBuilderContext,
  layoutType: string = 'edit'
) {
  const { type } = data;

  // 仅渲染元素类型与文本类型与根节点
  if (!['element', 'text', 'root'].includes(type)) {
    return;
  }

  // type 为文本
  if (type === 'text') {
    return parseDataText(data.text, context);
  }

  // type 为 element 或 root
  const { name, attributes, elements } = data;
  const _type = types.get(name);

  if (layoutType === 'edit') {
    return _type.getEditView(name, attributes, elements || [], context);
  } else {
    return _type.getDetailView(name, attributes, elements || [], context);
  }
}
