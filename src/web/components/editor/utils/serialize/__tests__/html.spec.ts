import type { TRPGEditorNode } from '../../../types';
import { serializeToHtml } from '../html';

test('serializeToHtml', () => {
  const html = serializeToHtml({
    children: [
      {
        type: 'paragraph',
        children: [
          { text: 'An opening paragraph with a ' },
          {
            type: 'link',
            url: 'https://example.com',
            children: [{ text: 'link' }],
          },
          { text: ' in it.' },
        ],
      },
      {
        type: 'block-quote',
        children: [{ text: 'A wise quote.' }],
      },
      {
        type: 'paragraph',
        children: [{ text: 'A closing paragraph!' }],
      },
    ],
  } as TRPGEditorNode);

  expect(html).toBe(
    '<p>An opening paragraph with a <a href="https://example.com">link</a> in it.</p><blockquote><p>A wise quote.</p></blockquote><p>A closing paragraph!</p>'
  );
});
