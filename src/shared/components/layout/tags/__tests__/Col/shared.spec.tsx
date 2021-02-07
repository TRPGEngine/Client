import React from 'react';
import XMLBuilder from '@shared/components/layout/XMLBuilder';
import { render } from '@testing-library/react';
import { sleep } from '@test/utils';

describe('Tag: Col', () => {
  test.each<[string, number, number]>([
    ['sm="8"', 600, 8],
    // ['sm="8"', 375, 24], // TODO: 待实现测试, 不知道怎么测试比较好
  ])('%s in %i => %i', async (attrs, width, span) => {
    const xml = `<Col ${attrs}>Test Content</Col>`;

    const wrapper = render(<XMLBuilder xml={xml} />);

    expect(wrapper.asFragment()).toMatchSnapshot();

    await sleep(100);

    expect(wrapper.getByText('Test Content')).toBeInTheDocument();
    expect(wrapper.asFragment()).toMatchSnapshot();
  });
});
