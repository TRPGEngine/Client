import { serializeToBBCode } from '../bbcode';

describe('serializeToBBCode', () => {
  test('parse at', () => {
    const res = serializeToBBCode({
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
    });

    expect(res).toBe(
      '测试[at uuid=232a7ea0-5521-11e9-a029-7742fd774d52]admin1[/at]'
    );
  });
});
