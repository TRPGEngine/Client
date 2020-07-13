import React from 'react';
import { Text } from 'react-native';
import { TMemo } from '@shared/components/TMemo';
import { useUserName } from '@redux/hooks/user';

interface Props {
  uuid: string;
}
export const UserName: React.FC<Props> = TMemo((props) => {
  const displayName = useUserName(props.uuid);

  return <Text>{displayName}</Text>;
});
UserName.displayName = 'UserName';
