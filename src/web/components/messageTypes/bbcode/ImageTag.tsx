import React from 'react';
import { TagProps } from '@shared/components/bbcode/type';
import Image from '@web/components/Image';
import config from '@shared/project.config';
import ImageViewer from '@web/components/ImageViewer';
import { useMsgListContextImageUrls } from '@shared/context/MsgListContext';
import { TMemo } from '@shared/components/TMemo';

const ImageTag: React.FC<TagProps> = TMemo((props) => {
  const { node } = props;
  const { attrs } = node;
  let src = node.content.join('');
  src = config.file.getAbsolutePath!(src);

  const imageUrls = useMsgListContextImageUrls();

  return (
    <ImageViewer originImageUrl={src} allImageUrls={imageUrls}>
      <Image src={src} {...attrs} role="chatimage" />
    </ImageViewer>
  );
});
ImageTag.displayName = 'ImageTag';

export default ImageTag;
