import React, { useMemo } from 'react';
import { Avatar as AntdAvatar } from 'antd';
import _head from 'lodash/head';
import _upperCase from 'lodash/upperCase';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import { AvatarProps } from 'antd/lib/avatar';
import { getAbsolutePath } from '@shared/utils/file-helper';
import { getAvatarColorHex } from '@shared/utils/string-helper';
import { TMemo } from '@shared/components/TMemo';

interface Props extends AvatarProps {
  name?: string;
}

const Avatar: React.FC<Props> = TMemo((props) => {
  const src = !_isEmpty(props.src) ? getAbsolutePath(props.src) : undefined;

  const name = useMemo(() => _upperCase(_head(props.name)), [props.name]);

  const color = useMemo(
    () =>
      // 如果src为空 且 icon为空 则给个固定颜色
      _isEmpty(src) && _isNil(props.icon)
        ? getAvatarColorHex(props.name)
        : undefined,
    [src, props.name]
  );

  return (
    <AntdAvatar
      {...props}
      src={src}
      style={{
        cursor: 'default',
        userSelect: 'none',
        ...props.style,
        backgroundColor: color,
      }}
    >
      {name}
    </AntdAvatar>
  );
});
Avatar.displayName = 'Avatar';

export default Avatar;
