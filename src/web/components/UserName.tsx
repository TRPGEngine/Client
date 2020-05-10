import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useUserName } from '@redux/hooks/useUser';

interface Props {
  uuid: string;
}
export const UserName: React.FC<Props> = TMemo((props) => {
  const displayName = useUserName(props.uuid);

  return <span>{displayName}</span>;
});
UserName.displayName = 'UserName';
