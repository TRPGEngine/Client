import { Editor, Range } from 'slate';
import _get from 'lodash/get';
import _last from 'lodash/last';

export function checkMention(
  editor: Editor
): {
  target: Range;
  searchText: string;
} | null {
  const { selection, operations } = editor;

  if (selection && Range.isCollapsed(selection)) {
    // 处理输入时前面有@的情况
    const [start] = Range.edges(selection);
    const wordBefore = Editor.before(editor, start, { unit: 'word' });
    const before = wordBefore && Editor.before(editor, wordBefore);
    const beforeRange = before && Editor.range(editor, before, start);
    const beforeText = beforeRange && Editor.string(editor, beforeRange);
    const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
    const after = Editor.after(editor, start);
    const afterRange = Editor.range(editor, start, after);
    const afterText = Editor.string(editor, afterRange);
    const afterMatch = afterText.match(/^(\s|$)/);

    if (beforeMatch && afterMatch) {
      return {
        target: beforeRange!,
        searchText: beforeMatch[1],
      };
    }
  }

  if (
    _get(operations, [0, 'type']) === 'insert_text' &&
    _get(operations, [0, 'text']) === '@'
  ) {
    // 处理输入@的情况
    const range = Editor.range(editor, _get(operations, [0, 'path']));
    return {
      target: range,
      searchText: '',
    };
  }

  return null;
}
