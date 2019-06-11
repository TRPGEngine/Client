import React from 'react';
import { View } from 'react-native';
import Base from './Base';
import { parse } from '../../utils/textParser';

class Default extends Base {
  getContent() {
    const info = this.props.info || {};
    return <View>{parse(info.message)}</View>;
  }
}

export default Default;
