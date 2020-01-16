import React from 'react';
import { shallow, mount } from 'enzyme';
import BBCode from '@web/components/messageTypes/bbcode/__all__';

describe('bbcode render', () => {
  test.each([
    [':cat:'],
    ['[img]http://example.com[/img]'],
    ['mix text image[img]http://example.com[/img]'],
    ['some sample text'],
    ['[asd]unrecognized tag should be ignore[/asd]'],
  ])('render "%s"', (originText) => {
    const wrapper = mount(<BBCode plainText={originText} />);
    expect(wrapper.toJson()).toMatchSnapshot();
  });
});
