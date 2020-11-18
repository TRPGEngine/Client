import React from 'react';
import XMLBuilder from '@shared/components/layout/XMLBuilder';
import TestRenderer from 'react-test-renderer';

const wrapXML = (xml: string) => `<Template>${xml}</Template>`;
const renderXML = (xml: string) =>
  TestRenderer.create(<XMLBuilder xml={wrapXML(xml)} />);

describe('layout', () => {
  test('basic', () => {
    const wrapper = renderXML('');
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  test('some text', () => {
    const text = '<span>some text</span>';
    const wrapper = renderXML(text);

    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
