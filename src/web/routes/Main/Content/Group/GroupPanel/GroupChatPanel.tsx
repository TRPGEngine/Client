import React, { useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ChatContainer } from '@web/components/chatBox/ChatContainer';
import { Iconfont } from '@web/components/Iconfont';
import styled from 'styled-components';
import { useJoinedGroupInfo } from '@redux/hooks/group';
import _isNil from 'lodash/isNil';
import { UserListItem } from '@web/components/UserListItem';

const Root = styled.div`
  display: flex;
  flex-direction: row;
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

  const members = (groupInfo.group_members ?? []).map((uuid) => (
    <UserListItem key={uuid} userUUID={uuid} />
  ));

  return (
    <Root>
      <ChatContainer
        style={{ flex: 1 }}
        converseUUID={groupUUID}
        headerActions={[
          <Iconfont
            key="members"
            active={showMembers}
            onClick={() => setShowMembers(!showMembers)}
          >
            &#xe603;
          </Iconfont>,
        ]}
        rightPanel={showMembers && <div>{members}</div>}
      />
    </Root>
  );
});
GroupChatPanel.displayName = 'GroupChatPanel';
