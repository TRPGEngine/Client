import { createTestEditorWithContent } from '../../__tests__/utils';
import { checkMention } from '../checkMention';

describe('checkMention', () => {
  test('should search', () => {
    const editor = createTestEditorWithContent('test @a');
    const res = checkMention(editor);

    expect(res).not.toBeNull();
    expect(res?.searchText).toBe('a');
  });

  test('should not search', () => {
    const editor = createTestEditorWithContent('test @');
    const res = checkMention(editor);

    expect(res).toBeNull();
  });
});
