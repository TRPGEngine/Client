import React, { useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ChatContainer } from '@web/components/chatBox/ChatContainer';
import { Iconfont } from '@web/components/Iconfont';
import styled from 'styled-components';
import { useJoinedGroupInfo } from '@redux/hooks/group';
import _isNil from 'lodash/isNil';
import { UserListItem } from '@web/components/UserListItem';
import { GroupActorSelector } from './GroupActorSelector';
import { TPopover } from '@web/components/popover';
import PopoverUserInfo from '@web/components/popover/UserInfo';

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

  const members = (groupInfo.group_members ?? []).map((uuid) => (
    <TPopover
      key={uuid}
      placement="left"
      trigger="click"
      content={<PopoverUserInfo userUUID={uuid} />}
    >
      <div>
        <UserListItem userUUID={uuid} />
      </div>
    </TPopover>
  ));

  return (
    <Root>
      <ChatContainer
        style={{ flex: 1 }}
        converseUUID={groupUUID}
        headerActions={[
          <GroupActorSelector key="actor" groupUUID={groupUUID} />,
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
