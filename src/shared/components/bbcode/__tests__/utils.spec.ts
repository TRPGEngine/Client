import { AstNodeObj } from '../type';
import { getUrlTagRealUrl } from '../utils';

describe('getUrlTagRealUrl', () => {
  test.each([
    [
      {
        tag: 'url',
        attrs: { url: 'https://baidu.com' },
        content: ['百度'],
      },
      'https://baidu.com',
    ],
    [
      {
        tag: 'url',
        attrs: {},
        content: ['https://baidu.com'],
      },
      'https://baidu.com',
    ],
  ])('%s => %s', (input: AstNodeObj, output) => {
    expect(getUrlTagRealUrl(input)).toMatchObject(output);
  });
});
