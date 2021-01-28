import React from 'react';
import type { TagProps } from '@shared/components/bbcode/type';
import { TMemo } from '@shared/components/TMemo';

const UrlTag: React.FC<TagProps> = TMemo((props) => {
  const { node } = props;
  const text = node.content.join('');
  const url = node.attrs.url ?? text;

  return (
    <a href={url} title={text} target="_blank" rel="noopener">
      {text}
    </a>
  );
});
UrlTag.displayName = 'UrlTag';

export default UrlTag;
