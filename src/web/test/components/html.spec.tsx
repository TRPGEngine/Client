import React from 'react';
import HTML from '@web/components/HTML';
import { create } from 'react-test-renderer';

describe('HTML Component', () => {
  test.each([
    ['<h1>Test Title</h1>'],
    ['<script src="http://example.com/script.js"></script>'],
    ['<style>*{color: red;}</style>'],
  ])('render "%s"', (originText) => {
    const wrapper = create(<HTML html={originText} />);
    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
