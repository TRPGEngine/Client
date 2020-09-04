import { Editor, createEditor } from 'slate';

/**
 * 创建一个测试用的编辑器实例
 */
export function createTestEditorWithContent(text: string): Editor {
  const editor = createEditor();
  editor.children = [
    {
      children: [{ text: '' }],
    },
  ];
  editor.selection = {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 0 },
  };

  editor.insertText(text);

  return editor;
}
