import { render } from '@testing-library/react';
import React from 'react';
import { DeprecatedComponent } from '../DeprecatedComponent';

describe('DeprecatedComponent', () => {
  test('render', () => {
    const wrapper = render(<DeprecatedComponent />);
    expect(wrapper.container).toMatchSnapshot();
  });
});
