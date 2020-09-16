import { serializeToPlaintext } from '../plaintext';

test('serializeToPlaintext', () => {
  const text = serializeToPlaintext([
    {
      type: 'paragraph',
      children: [{ text: 'An opening paragraph...' }],
    },
    {
      type: 'quote',
      children: [{ text: 'A wise quote.' }],
    },
    {
      type: 'paragraph',
      children: [{ text: 'A closing paragraph!' }],
    },
  ]);

  expect(text).toBe(
    'An opening paragraph...\nA wise quote.\nA closing paragraph!'
  );
});
