import React from 'react';
import { Text } from 'react-native';
import Base from './Base';

class Default extends Base {
  getContent() {
    const info = this.props.info || {};
    return <Text>{info.message}</Text>;
  }
}

export default Default;
