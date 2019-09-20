import { preParse } from '@src/shared/utils/msg-parser';

describe('pre-parse', () => {
  it('pure text', () => {
    const ret = preParse('text');
    expect(ret).toBe('text');
  });

  it('url string', () => {
    const ret = preParse('https://baidu.com');
    expect(ret).toBe('https://baidu.com');
  });

  it('url with port string', () => {
    const ret = preParse('https://baidu.com:443/');
    expect(ret).toBe('https://baidu.com:443/');
  });

  it('emoji string', () => {
    const ret = preParse(':smile:');
    expect(ret).toBe('[emoji]smile[/emoji]');
  });
});
