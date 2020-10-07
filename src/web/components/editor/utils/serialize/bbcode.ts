import { TRPGEditorNode } from '../../types';
import { Text } from 'slate';
import _get from 'lodash/get';

export function serializeToBBCode(node: TRPGEditorNode): string {
  if (Text.isText(node)) {
    return node.text;
  }

  const children = node.children.map((n) => serializeToBBCode(n)).join('');

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
