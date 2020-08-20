import React from 'react';
import { TagProps } from '@shared/components/bbcode/type';

const UrlTag: React.FC<TagProps> = React.memo((props) => {
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
