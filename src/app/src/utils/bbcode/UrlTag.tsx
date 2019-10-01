import React from 'react';
import Link from '../../components/Link';
import { TagProps } from './types';

const UrlTag = React.memo((props: TagProps) => {
  const { node } = props;
  const url = node.content.join('');

  return <Link url={url}>{url}</Link>;
});

export default UrlTag;
