import React, { useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ChatContainer } from '@web/components/chatBox/ChatContainer';
import styled from 'styled-components';
import { useJoinedGroupInfo } from '@redux/hooks/group';
import _isNil from 'lodash/isNil';
import { GroupMembersAction } from '@web/components/panels/actions/GroupMembersAction';

const Root = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

interface GroupChatPanelProps {
  groupUUID: string;
}
export const GroupChatPanel: React.FC<GroupChatPanelProps> = TMemo((props) => {
  const { groupUUID } = props;
  const [showMembers, setShowMembers] = useState(false);
  const groupInfo = useJoinedGroupInfo(groupUUID);

  if (_isNil(groupInfo)) {
    return null;
  }

  return (
    <Root>
      <ChatContainer
        style={{ flex: 1 }}
        converseUUID={groupUUID}
        converseType="group"
        headerActions={[
          <GroupMembersAction key="members" groupUUID={groupUUID} />,
        ]}
      />
    </Root>
  );
});
GroupChatPanel.displayName = 'GroupChatPanel';
