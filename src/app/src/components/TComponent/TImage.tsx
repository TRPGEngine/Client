import React from 'react';
import { View } from 'react-native';
import FastImage, { FastImageProperties } from 'react-native-fast-image';
import _invoke from 'lodash/invoke';
import { createImageProgress } from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Circle';

const LoadingImage = createImageProgress(FastImage);

interface Props extends Omit<FastImageProperties, 'source'> {
  url: string;
  hideLoading?: boolean;
}
export default class TImage extends React.PureComponent<Props> {
  render() {
    const { url, hideLoading } = this.props;

    const props = {
      resizeMode: FastImage.resizeMode.contain,
      fallback: false,
      ...this.props,
      source: {
        uri: url,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable,
      },
    };

    return (
      <View>
        {hideLoading !== true ? (
          <LoadingImage indicator={ProgressBar} {...props} />
        ) : (
          <FastImage {...props} />
        )}
      </View>
    );
  }
}
