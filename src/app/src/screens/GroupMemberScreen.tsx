import React from 'react';
import { TRPGDispatchProp } from '@redux/types/__all__';
import UserList from '@app/components/UserList';
import _isNil from 'lodash/isNil';
import { TRPGStackScreenProps } from '@app/router';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';

interface Props extends TRPGStackScreenProps<'GroupMember'>, TRPGDispatchProp {
  groupMembers: string[];
}

const GroupMemberScreen: React.FC<Props> = TMemo((props) => {
  const groupUUID = props.route.params?.uuid;
  const group = useTRPGSelector((state) =>
    state.group.groups.find((x) => x.uuid === groupUUID)
  );
  const groupMembers = (!_isNil(group) ? group.group_members : null) ?? [];

  return <UserList uuids={groupMembers} />;
});
GroupMemberScreen.displayName = 'GroupMemberScreen';

export default GroupMemberScreen;
