import { Transforms, Editor } from 'slate';
import type { TRPGEditorElement } from '../types';

/**
 * 插入图片
 * @param editor 编辑器
 * @param url 图片URL
 */
export function insertImage(editor: Editor, url: string) {
  const image: TRPGEditorElement = {
    type: 'image',
    url,
    children: [{ text: url }],
  };
  Transforms.insertNodes(editor, image);
  Transforms.move(editor);
}
