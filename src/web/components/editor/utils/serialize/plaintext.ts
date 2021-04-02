import { Node } from 'slate';
import type { TRPGEditorNode } from '../../types';

/**
 * 序列化为普通文本
 */
export function serializeToPlaintext(nodes: TRPGEditorNode[]) {
  return nodes.map((n) => Node.string(n)).join('\n');
}
