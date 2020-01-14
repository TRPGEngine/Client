import React from 'react';
import { TagProps } from '@shared/components/bbcode/type';
import Image from '@web/components/Image';
import config from '@shared/project.config';
import ImageViewer from '@web/components/ImageViewer';

const ImageTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const { attrs } = node;
  let src = node.content.join('');
  src = config.file.getAbsolutePath(src);

  return (
    <ImageViewer originImageUrl={src}>
      <Image src={src} {...attrs} role="chatimage" />
    </ImageViewer>
  );
});
ImageTag.displayName = 'ImageTag';

export default ImageTag;
