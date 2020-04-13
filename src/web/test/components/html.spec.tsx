import React from 'react';
import HTML from '@web/components/HTML';
import { mount } from 'enzyme';

describe('HTML Component', () => {
  test.each([
    ['<h1>Test Title</h1>'],
    ['<script src="http://example.com/script.js"></script>'],
    ['<style>*{color: red;}</style>'],
  ])('render "%s"', (originText) => {
    const wrapper = mount(<HTML html={originText} />);
    expect(wrapper.toJson()).toMatchSnapshot();
  });
});
