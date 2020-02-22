import React, { useMemo } from 'react';
import { Avatar as AntdAvatar } from 'antd';
import _head from 'lodash/head';
import _upperCase from 'lodash/upperCase';
import { AvatarProps } from 'antd/lib/avatar';
import { getAbsolutePath } from '@shared/utils/file-helper';

interface Props extends AvatarProps {
  name?: string;
}

const Avatar = React.memo((props: Props) => {
  const src = getAbsolutePath(props.src);

  const name = useMemo(() => _upperCase(_head(props.name)), [props.name]);

  return (
    <AntdAvatar {...props} src={src}>
      {name}
    </AntdAvatar>
  );
});
Avatar.displayName = 'Avatar';

export default Avatar;
