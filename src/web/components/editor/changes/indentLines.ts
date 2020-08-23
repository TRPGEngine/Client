import { Editor, Range, Transforms } from 'slate';
import _range from 'lodash/range';

const defaultIndent = '    ';

/**
 * Indent all lines in selection
 */
function indentLines(editor: Editor, indent: string = defaultIndent) {
  const range = editor.selection;
  if (range) {
    if (Range.isCollapsed(range)) {
      // 没选中任何文本
      editor.insertText(indent);
    } else {
      // 选中了行

      // TODO: 功能是在所有选中的行前增加缩进 但是不知道如何实现
      // 先搞一个在最前增加tab的凑合用用
      const point = Editor.point(editor, range, { edge: 'start' });
      Transforms.insertText(editor, indent, { at: point });
    }
  }
}

export default indentLines;
