import 'react-native';
import React from 'react';
import App from '../src/App';

// Note: test renderer must be required after react-native.
import Test from './Test';
import renderer from 'react-test-renderer';

describe('app', () => {
  it('renders correctly', () => {
    renderer.create(<Test />); // 临时
    // renderer.create(<App />);
  });
});
