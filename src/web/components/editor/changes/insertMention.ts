import { Editor, Transforms } from 'slate';
import type { EditorMentionListItem } from '../context/EditorMentionListContext';

/**
 * 插入提及
 */
export const insertMention = (
  editor: Editor,
  mentionData: EditorMentionListItem
) => {
  const mention = [
    {
      type: 'mention',
      data: mentionData,
      children: [{ text: `@${mentionData.text}` }],
    },
  ];
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};
