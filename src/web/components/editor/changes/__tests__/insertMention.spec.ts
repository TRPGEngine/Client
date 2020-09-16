import { createTestEditorWithContent } from '../../__tests__/utils';
import { insertMention } from '../insertMention';

test('insertMention', () => {
  const editor = createTestEditorWithContent('text ');

  insertMention(editor, { text: 'user' });

  expect(editor.selection).toMatchObject({
    anchor: { path: [1, 0], offset: 5 },
    focus: { path: [1, 0], offset: 5 },
  });
  expect(editor.children).toMatchObject([
    { children: [{ text: 'text ' }] },
    { type: 'mention', data: { text: 'user' }, children: [{ text: '@user' }] },
  ]);
});
