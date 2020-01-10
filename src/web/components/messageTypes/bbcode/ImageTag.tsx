import React from 'react';
import { TagProps } from '@shared/components/bbcode/type';
import Image from '@web/components/Image';
import config from '@shared/project.config';

const ImageTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const { attrs } = node;
  let src = node.content.join('');
  src = config.file.getAbsolutePath(src);

  return <Image src={src} {...attrs} role="chatimage" />;
});
ImageTag.displayName = 'ImageTag';

export default ImageTag;
