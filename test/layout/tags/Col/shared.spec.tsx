import React from 'react';
import { mount } from 'enzyme';
import XMLBuilder from '@shared/components/layout/XMLBuilder';
import { Col } from 'antd';

describe('Tag: Col', () => {
  test.each<[string, number, number]>([
    ['sm="8"', 600, 8],
    // ['sm="8"', 375, 24], // TODO: 待实现测试, 不知道怎么测试比较好
  ])('%s in %i => %i', async (attrs, width, span) => {
    const xml = `<Col ${attrs}>Test Content</Col>`;
    const wrapper = mount(<XMLBuilder xml={xml} />);

    const colWrapper = wrapper.find(Col);

    expect(colWrapper).not.toBeNull();
    expect(colWrapper.toJson()).not.toBeNull();
    expect(colWrapper.props().span).toBe(span);
  });
});
