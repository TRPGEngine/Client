import React, { Fragment } from 'react';
import bbcodeParser from '../../src/utils/bbcode-parser';
import renderer from 'react-test-renderer';
import { preProcessText } from '@src/app/src/utils/text-parser';

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

  describe('bbcode parse component', () => {
    const cases = [
      {
        title: 'plain text',
        bbcode: 'TestString',
      },
      {
        title: 'plain text with space',
        bbcode: 'Test String',
      },
      {
        title: 'pure image',
        bbcode: '[img]http://exampleimg.com[/img]',
      },
      {
        title: 'mix image and text',
        bbcode: '测试文字1[img]http://exampleimg.com[/img]测试文字2',
      },
    ];

    for (const item of cases) {
      it(item.title, () => {
        const Component = bbcodeParser.parse(item.bbcode);
        const result = renderer
          .create(<Fragment>{Component}</Fragment>)
          .toJSON();
        expect(result).toMatchSnapshot();
      });
    }
  });
});
