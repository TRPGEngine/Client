import React from 'react';
import { Text } from 'react-native';
import Base from './Base';
import { parse } from '../../utils/textParser';

class Default extends Base {
  getContent() {
    const info = this.props.info || {};
    return <Text>{parse(info.message)}</Text>;
  }
}

export default Default;
