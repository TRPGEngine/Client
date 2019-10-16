import React from 'react';
import Link from '../../Link';
import { TagProps } from '@src/shared/components/bbcode/type';

const UrlTag = React.memo((props: TagProps) => {
  const { node } = props;
  const url = node.content.join('');

  return <Link url={url}>{url}</Link>;
});

export default UrlTag;
