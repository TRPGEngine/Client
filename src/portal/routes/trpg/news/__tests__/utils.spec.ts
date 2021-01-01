import { getFirstImageUrlFromHTML } from '../utils';

describe('getFirstImageUrlFromHTML', () => {
  const target = 'https://baidu.com';

  test.each([
    ['<img src="https://baidu.com" />'],
    ['<img src="https://baidu.com" /><img src="https://baidu2.com" />'],
    ['<body><div><img src="https://baidu.com" /></div></body>'],
    ['<body><div><img /><img src="https://baidu.com" /></div></body>'],
  ])('%s', (html: string) => {
    expect(getFirstImageUrlFromHTML(html)).toBe(target);
  });
});
