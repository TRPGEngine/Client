import React, { useState } from 'react';
import FastImage from 'react-native-fast-image';
import { AstNodeObj } from './types';
import config from '../../../../config/project.config';
import { TImageViewer } from '@src/app/components/TComponent';

interface Props {
  node: AstNodeObj;
  attrs: {};
}

const maxWidth = 180;
const maxHeight = 120;

const ImageTag = (props: Props) => {
  const { node, attrs } = props;
  const [width, setWidth] = useState(180);
  const [height, setHeight] = useState(120);

  // 等比例缩放图片
  const setImageSize = (targetWidth: number, targetHeight: number) => {
    const radioWidth = maxWidth / targetWidth;
    const radioHeight = maxHeight / targetHeight;
    const radioTarget = Math.min(radioWidth, radioHeight);

    setWidth(radioTarget * targetWidth);
    setHeight(radioTarget * targetHeight);
  };

  let url = node.content.join('');
  url = config.file.getAbsolutePath(url);

  return (
    <TImageViewer images={url}>
      <FastImage
        style={{
          width,
          height,
        }}
        {...attrs}
        source={{
          uri: url,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
        resizeMode={FastImage.resizeMode.contain}
        onLoad={(e) => {
          const { width, height } = e.nativeEvent;
          setImageSize(width, height);
        }}
      />
    </TImageViewer>
  );
};

export default ImageTag;
