import { shallow, mount } from 'enzyme';
import App from '@web/containers/App';
import React from 'react';

test('renders without crashing', async () => {
  // TODO: should test it with mount
  mount(<App />);
});
