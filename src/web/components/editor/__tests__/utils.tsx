import { Editor, createEditor } from 'slate';
import { getHeadSelection } from '../utils';

/**
 * 创建一个测试用的编辑器实例
 */
export function createTestEditorWithContent(text: string): Editor {
  const editor = createEditor();
  editor.children = [
    {
      children: [{ text: '' }],
    },
  ] as any;
  editor.selection = getHeadSelection();

  editor.insertText(text);

  return editor;
}
