import React from 'react';
import XMLBuilder from '@shared/components/layout/XMLBuilder';
import { render } from '@testing-library/react';
import { sleep } from '@test/utils';

const wrapXML = (xml: string) => `<Template>${xml}</Template>`;
const renderXML = (xml: string) => render(<XMLBuilder xml={wrapXML(xml)} />);

describe('layout', () => {
  test('basic', async () => {
    const wrapper = renderXML('');
    expect(wrapper.asFragment()).toMatchSnapshot();

    await sleep(100);

    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  test('some text', async () => {
    const text = '<span>some text</span>';
    const wrapper = renderXML(text);

    expect(wrapper.asFragment()).toMatchSnapshot();

    await sleep(100);

    expect(wrapper.asFragment()).toMatchSnapshot();
    expect(wrapper.getByText('some text')).toBeInTheDocument();
  });
});
