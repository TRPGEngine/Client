import React, { Fragment } from 'react';
import { View } from 'react-native';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import _invoke from 'lodash/invoke';
import { createImageProgress } from 'react-native-image-progress';
// import ProgressBar from 'react-native-progress/Circle';

const LoadingImage = createImageProgress(FastImage);

interface Props extends Omit<FastImageProps, 'source'> {
  url: string;
  hideLoading?: boolean;
}
export default class TImage extends React.PureComponent<Props> {
  render() {
    const { url, hideLoading } = this.props;

    const props: FastImageProps = {
      resizeMode: FastImage.resizeMode.contain,
      fallback: false,
      ...this.props,
      source: {
        uri: url,
        priority: FastImage.priority.normal,
        // cache: FastImage.cacheControl.immutable, // TODO: 关注https://github.com/DylanVann/react-native-fast-image/pull/654的进展。
      },
    };

    return (
      <View>
        {hideLoading !== true ? (
          <Fragment>
            {/* react-native-progress depends art has some problem which will make application crash. */}
            {/* for detail: https://github.com/oblador/react-native-progress/issues/179 */}
            {/* Use native ActivityIndicator to as alternative */}
            {/* <LoadingImage indicator={ProgressBar} {...props} /> */}
            <LoadingImage {...props} />
          </Fragment>
        ) : (
          <FastImage {...props} />
        )}
      </View>
    );
  }
}
