import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';

/**
 * 构建完整的编辑器实例
 */
export function createFullEditor() {
  return withHistory(withReact(createEditor()));
}
