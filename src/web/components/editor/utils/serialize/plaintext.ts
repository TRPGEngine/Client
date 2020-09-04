import { TRPGEditorNode } from '../../types';

/**
 * 序列化为普通文本
 */
export function serializeToPlaintext(nodes: TRPGEditorNode[]) {
  return nodes.map((n) => TRPGEditorNode.string(n)).join('\n');
}
