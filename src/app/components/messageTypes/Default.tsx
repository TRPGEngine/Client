import React from 'react';
import { View } from 'react-native';
import _get from 'lodash/get';
import Base from './Base';
import { parse } from '../../utils/textParser';

class Default extends Base {
  get isMsgPadding() {
    const message = String(_get(this, 'props.info.message', ''));
    const isImage = message.startsWith('[img]') && message.endsWith('[/img]');
    return !isImage;
  }

  getContent() {
    const info = this.props.info || {};
    return <View>{parse(info.message)}</View>;
  }
}

export default Default;
