import React from 'react';
import Link from '../../components/Link';
import { TagProps } from './types';

const UrlTag = React.memo((props: TagProps) => {
  const { node } = props;

  return <Link>{node.content}</Link>;
});

export default UrlTag;
