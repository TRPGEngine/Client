import type { TRPGEditorNode } from '../../types';
import { Text, Editor } from 'slate';
import _get from 'lodash/get';

/**
 * 解析单个节点
 */
function serializeToBBCodeNode(node: TRPGEditorNode): string {
  if (Text.isText(node)) {
    return node.text;
  }

  const children = node.children.map((n) => serializeToBBCodeNode(n)).join('');

  if (Editor.isEditor(node)) {
    return children;
  }

  switch (node.type) {
    case 'mention':
      return `[at uuid=${_get(node, 'data.uuid', '')}]${_get(
        node,
        'data.text',
        ''
      )}[/at]`;
    case 'image':
      return `[img]${_get(node, 'url', '')}[/img]`;
    default:
      return children;
  }
}

/**
 * 将节点解析为BBCode
 */
export function serializeToBBCode(nodes: TRPGEditorNode[]): string {
  return nodes.map((node) => serializeToBBCodeNode(node)).join('\n');
}
