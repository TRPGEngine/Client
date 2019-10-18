import React from 'react';
import renderer from 'react-test-renderer';
import BBCode from '@src/shared/components/bbcode';
import '@app/components/messageTypes/bbcode/__all__';

describe('bbcode-parser for app', () => {
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
        const result = renderer
          .create(<BBCode plainText={item.text} />)
          .toJSON();
        expect(result).toMatchSnapshot();
      });
    }
  });
});
