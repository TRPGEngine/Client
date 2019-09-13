import React, { Fragment } from 'react';
import bbcodeParser from '../../src/utils/bbcode-parser';
import renderer from 'react-test-renderer';

describe('bbcode-parser', () => {
  it('plain text', () => {
    const Component = bbcodeParser.parse('TestString');
    const msg = renderer.create(<Fragment>{Component}</Fragment>).toJSON();
    expect(msg).toMatchSnapshot();
  });
});
