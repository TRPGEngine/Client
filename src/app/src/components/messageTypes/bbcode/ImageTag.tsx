import React, { useState } from 'react';
import config from '@shared/project.config';
import { TImageViewer } from '@src/app/src/components/TComponent';
import { TagProps } from '@src/shared/components/bbcode/type';
import TImage from '../../TComponent/TImage';

const maxWidth = 180;
const maxHeight = 120;

const ImageTag = React.memo((props: TagProps) => {
  const { node } = props;
  const { attrs } = node;
  const [width, setWidth] = useState(maxWidth);
  const [height, setHeight] = useState(maxHeight);

  // 等比例缩放图片
  const setImageSize = (targetWidth: number, targetHeight: number) => {
    if (!(targetWidth > 0 && targetHeight > 0)) {
      // 如果没有满足宽高大于0
      return;
    }

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
      <TImage
        style={{
          width,
          height,
        }}
        {...attrs}
        url={url}
        onLoad={(e) => {
          const { width, height } = e.nativeEvent;
          setImageSize(width, height);
        }}
      />
    </TImageViewer>
  );
});

export default ImageTag;
