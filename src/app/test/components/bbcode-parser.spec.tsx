import React, { Fragment } from 'react';
import bbcodeParser from '../../src/utils/bbcode-parser';
import renderer from 'react-test-renderer';

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

describe('bbcode-parser', () => {
  for (const item of cases) {
    it(item.title, () => {
      const Component = bbcodeParser.parse(item.bbcode);
      const result = renderer.create(<Fragment>{Component}</Fragment>).toJSON();
      expect(result).toMatchSnapshot();
    });
  }
});
