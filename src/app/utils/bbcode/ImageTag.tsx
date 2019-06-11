import React from 'react';
import { Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { AstNodeObj } from './types';
import config from '../../../../config/project.config';

export default function ImageTag(node: AstNodeObj, attrs: {}) {
  let url = node.content.join('');
  url = config.file.getAbsolutePath(url);
  // return <Text>{url}</Text>;

  return (
    <FastImage
      style={{
        width: 180,
        height: 120,
      }}
      {...attrs}
      source={{
        uri: url,
        priority: FastImage.priority.low,
        cache: FastImage.cacheControl.web,
      }}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
}
