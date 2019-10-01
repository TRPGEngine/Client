import React, { useState } from 'react';
import FastImage from 'react-native-fast-image';
import { TagProps } from './types';
import config from '../../../../shared/project.config';
import { TImageViewer } from '@src/app/src/components/TComponent';

const maxWidth = 180;
const maxHeight = 120;

const ImageTag = React.memo((props: TagProps) => {
  const { node } = props;
  const { attrs } = node;
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
});

export default ImageTag;
