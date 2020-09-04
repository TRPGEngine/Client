import React from 'react';
import { TagProps } from '@shared/components/bbcode/type';
import { TMemo } from '@shared/components/TMemo';

const UrlTag: React.FC<TagProps> = TMemo((props) => {
  const { node } = props;
  const url = node.content.join('');

  return (
    <a href={url} title={url} target="_blank" rel="noreferrer">
      {url}
    </a>
  );
});
UrlTag.displayName = 'UrlTag';

export default UrlTag;
