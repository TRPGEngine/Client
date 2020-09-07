import { Editor, Transforms } from 'slate';
import { EditorMentionListItem } from '../context/EditorMentionListContext';

/**
 * 插入提及
 */
export const insertMention = (
  editor: Editor,
  character: EditorMentionListItem
) => {
  const mention = {
    type: 'mention',
    data: character,
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};
