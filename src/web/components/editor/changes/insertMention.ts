import { Editor, Transforms } from 'slate';

/**
 * 插入提及
 */
export const insertMention = (editor: Editor, character: string) => {
  const mention = { type: 'mention', character, children: [{ text: '' }] };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};
