import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useCachedUserInfo } from '@shared/hooks/useCache';
import Avatar from './Avatar';
import { getUserName } from '@shared/utils/data-helper';

interface Props {
  uuid: string;
  size?: 'large' | 'small' | 'default' | number;
}
export const UserAvatar: React.FC<Props> = TMemo((props) => {
  const userInfo = useCachedUserInfo(props.uuid);

  return (
    <Avatar
      name={getUserName(userInfo) ?? ''}
      src={userInfo.avatar}
      size={props.size}
    />
  );
});
UserAvatar.displayName = 'UserAvatar';
