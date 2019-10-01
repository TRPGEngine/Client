import React, { Fragment } from 'react';
import renderer from 'react-test-renderer';
import { preProcessText, parse } from '@src/app/src/utils/text-parser';

describe('bbcode-parser', () => {
  describe('preprocess', () => {
    it('simple url parse', () => {
      const text = preProcessText('http://baidu.com');
      expect(text).toBe('[url]http://baidu.com[/url]');
    });

    it('mix text and url parse', () => {
      const text = preProcessText('open:http://baidu.com');
      expect(text).toBe('open:[url]http://baidu.com[/url]');
    });

    it('mix text and more url parse', () => {
      const text = preProcessText(
        'open:http://baidu.com and http://google.com'
      );
      expect(text).toBe(
        'open:[url]http://baidu.com[/url] and [url]http://google.com[/url]'
      );
    });
  });

  // 文本解析成组件测试
  describe('text parse component', () => {
    const cases = [
      {
        title: 'plain text',
        text: 'TestString',
      },
      {
        title: 'plain text with space',
        text: 'Test String',
      },
      {
        title: 'pure image',
        text: '[img]http://exampleimg.com[/img]',
      },
      {
        title: 'mix image and text',
        text: '测试文字1[img]http://exampleimg.com[/img]测试文字2',
      },
      {
        title: 'simple url',
        text: 'http://baidu.com',
      },
      {
        title: 'mix url and text',
        text: '百度:http://baidu.com',
      },
      {
        title: 'mix more url and text',
        text: '百度:http://baidu.com 谷歌:http://google.com',
      },
      {
        title: 'mix url and text with no separation',
        text: '百度http://baidu.com',
      },
      {
        title: 'mix more url and text with no separation',
        text: '百度http://baidu.com谷歌http://google.com',
      },
      {
        title: 'mix url and image and text',
        text: '百度:[img]http://exampleimg.com[/img] http://baidu.com',
      },
    ];

    for (const item of cases) {
      it(item.title, () => {
        const Component = parse(item.text);
        const result = renderer
          .create(<Fragment>{Component}</Fragment>)
          .toJSON();
        expect(result).toMatchSnapshot();
      });
    }
  });
});
