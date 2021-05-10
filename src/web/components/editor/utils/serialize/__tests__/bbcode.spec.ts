import type { TRPGEditorElement } from '@web/components/editor/types';
import { serializeToBBCode } from '../bbcode';

describe('serializeToBBCode', () => {
  test('parse mention', () => {
    const res = serializeToBBCode([
      {
        children: [
          { text: '测试' },
          {
            type: 'mention',
            data: {
              uuid: '232a7ea0-5521-11e9-a029-7742fd774d52',
              text: 'admin1',
            },
            children: [{ text: '' }],
          },
          { text: '' },
        ],
      } as TRPGEditorElement,
    ]);

    expect(res).toBe(
      '测试[at uuid=232a7ea0-5521-11e9-a029-7742fd774d52]admin1[/at]'
    );
  });

  test('parse image', () => {
    const res = serializeToBBCode([
      {
        children: [
          { text: '测试' },
          {
            type: 'image',
            url: 'http://image.baidu.com',
            children: [{ text: '' }],
          },
          { text: '' },
        ],
      } as TRPGEditorElement,
    ]);

    expect(res).toBe('测试[img]http://image.baidu.com[/img]');
  });

  test('parse line break', () => {
    const res = serializeToBBCode([
      { type: 'paragraph', children: [{ text: '这是第一行' }] },
      { type: 'paragraph', children: [{ text: '这是第二行' }] },
    ]);

    expect(res).toBe('这是第一行\n这是第二行');
  });
});
