import React from 'react';
import XMLBuilder from '@shared/components/layout/XMLBuilder';
import { shallow, mount } from 'enzyme';

const wrapXML = (xml: string) => `<Template>${xml}</Template>`;
const renderXML = (xml: string) => shallow(<XMLBuilder xml={wrapXML(xml)} />);
// const mountXML = (xml: string) => mount(<XMLBuilder xml={wrapXML(xml)} />); // 使用会抛个bug，暂时不要用

describe('layout', () => {
  test('basic', () => {
    const wrapper = renderXML('');
    expect(wrapper.children()).toHaveLength(1);
    expect(wrapper.toJson()).toMatchSnapshot();
  });

  test('some text', () => {
    const text = '<span>some text</span>';
    const wrapper = renderXML(text);

    expect(
      wrapper
        .children()
        .children()
        .html()
    ).toBe(text);
    expect(wrapper.toJson()).toMatchSnapshot();
  });

  test.only('layout should update when xml change', () => {
    const text = '<span>some text</span>';
    const text2 = '<span>some text2</span>';
    const wrapper = renderXML(text);

    expect(
      wrapper
        .children()
        .children()
        .html()
    ).toBe(text);
    expect(wrapper.toJson()).toMatchSnapshot();

    wrapper.setProps({ xml: wrapXML(text2) });

    expect(
      wrapper
        .children()
        .children()
        .html()
    ).toBe(text2);
    expect(wrapper.toJson()).toMatchSnapshot();
  });
});
