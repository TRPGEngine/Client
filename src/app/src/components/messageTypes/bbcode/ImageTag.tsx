import React, { useState, useMemo } from 'react';
import config from '@shared/project.config';
import { TImageViewer } from '@src/app/src/components/TComponent';
import { TagProps } from '@src/shared/components/bbcode/type';
import TImage from '../../TComponent/TImage';
import { useMsgListContextImageUrls } from '@shared/context/MsgListContext';
import _findLastIndex from 'lodash/findLastIndex';

const maxWidth = 180;
const maxHeight = 120;

const ImageTag = React.memo((props: TagProps) => {
  const { node } = props;
  const { attrs } = node;
  const [width, setWidth] = useState(maxWidth);
  const [height, setHeight] = useState(maxHeight);
  const imageUrls = useMsgListContextImageUrls();

  // 此处有一个反转的Image Urls, 因为app的msgList排序是基于时间倒序的
  // 在此处反转是因为相比在context设置时反转整个msgList性能没有在此处反转几个url字符串性能高(虽然需要更新多次)
  const reversedImageUrls = useMemo(() => [...imageUrls].reverse(), [
    imageUrls,
  ]);

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
  url = config.file.getAbsolutePath!(url);

  // 获取当前图片在所有图片中的位置
  const imageIndex = _findLastIndex(reversedImageUrls, (u) => u === url);
  const images = imageIndex >= 0 ? reversedImageUrls : url;

  return (
    <TImageViewer images={images} initIndex={imageIndex}>
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
