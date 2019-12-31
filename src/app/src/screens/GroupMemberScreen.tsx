import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { GroupMemberParams } from '@app/types/params';
import { connect } from 'react-redux';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';
import UserList from '@app/components/UserList';
import _isNil from 'lodash/isNil';

interface Props
  extends NavigationScreenProps<GroupMemberParams>,
    TRPGDispatchProp {
  groupMembers: string[];
}

class GroupMemberScreen extends React.Component<Props> {
  getUUIDs(): string[] {
    return this.props.groupMembers;
  }

  render() {
    return <UserList uuids={this.getUUIDs()} />;
  }
}

export default connect((state: TRPGState, ownProps: Props) => {
  const groupUUID = ownProps.navigation.getParam('uuid');

  const group = state.group.groups.find((x) => x.uuid === groupUUID);

  return {
    groupMembers: (!_isNil(group) ? group.group_members : null) ?? [],
  };
})(GroupMemberScreen);
