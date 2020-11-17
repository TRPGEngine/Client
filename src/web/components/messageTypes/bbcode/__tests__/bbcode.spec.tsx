import React from 'react';
import BBCode from '@web/components/messageTypes/bbcode/__all__';
import { render } from '@testing-library/react';

describe('bbcode render', () => {
  test.each([
    [':cat:'],
    ['[img]http://example.com[/img]'],
    ['mix text image[img]http://example.com[/img]'],
    ['some sample text'],
    ['[asd]unrecognized tag should be ignore[/asd]'],
    ['http://baidu.com'],
    ['[url]http://baidu.com[/url]'],
    ['[url=http://baidu.com]百度[/url]'],
  ])('render "%s"', (originText) => {
    const { asFragment } = render(<BBCode plainText={originText} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
