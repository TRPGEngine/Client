import React from 'react';
import { Avatar as AntdAvatar } from 'antd';
import _head from 'lodash/head';
import { AvatarProps } from 'antd/lib/avatar';
import { getAbsolutePath } from '@shared/utils/file-helper';

interface Props extends AvatarProps {
  name?: string;
}

const Avatar = React.memo((props: Props) => {
  const src = getAbsolutePath(props.src);

  return (
    <AntdAvatar {...props} src={src}>
      {_head(props.name)}
    </AntdAvatar>
  );
});

export default Avatar;
