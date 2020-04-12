import { preProcessLinkText } from '../index';

describe('bbcode common', () => {
  describe('preprocess text', () => {
    it('simple url parse', () => {
      const text = preProcessLinkText('http://baidu.com');
      expect(text).toBe('[url]http://baidu.com[/url]');
    });

    it('mix text and url parse', () => {
      const text = preProcessLinkText('open:http://baidu.com');
      expect(text).toBe('open:[url]http://baidu.com[/url]');
    });

    it('mix text and more url parse', () => {
      const text = preProcessLinkText(
        'open:http://baidu.com and http://google.com'
      );
      expect(text).toBe(
        'open:[url]http://baidu.com[/url] and [url]http://google.com[/url]'
      );
    });
  });
});
