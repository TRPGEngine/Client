import React from 'react';
import { View } from 'react-native';
import FastImage, { FastImageProperties } from 'react-native-fast-image';
import _invoke from 'lodash/invoke';
import { createImageProgress } from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Circle';

const Image = createImageProgress(FastImage);

interface Props extends Omit<FastImageProperties, 'source'> {
  url: string;
}
export default class TImage extends React.Component<Props> {
  render() {
    const { url } = this.props;
    return (
      <View>
        <Image
          resizeMode={FastImage.resizeMode.contain}
          indicator={ProgressBar}
          fallback={true}
          {...this.props}
          source={{
            uri: url,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
      </View>
    );
  }
}
