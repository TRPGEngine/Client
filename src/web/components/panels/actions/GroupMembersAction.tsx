import { TMemo } from '@shared/components/TMemo';
import { useCallback } from 'react';
import { useRightPanelContext } from '../context/RightPanelContext';
import React from 'react';
import { GroupMembers } from './components/GroupMembers';
import { Iconfont } from '@web/components/Iconfont';

const ACTION_NAME = 'group-members';
/**
 * 用户列表
 */
export const GroupMembersAction: React.FC<{
  groupUUID: string;
}> = TMemo((props) => {
  const { groupUUID } = props;
  const { rightPanelName, setRightPanel } = useRightPanelContext();
  const handleClick = useCallback(() => {
    setRightPanel(ACTION_NAME, <GroupMembers groupUUID={groupUUID} />);
  }, [setRightPanel]);

  return (
    <Iconfont active={rightPanelName === ACTION_NAME} onClick={handleClick}>
      &#xe603;
    </Iconfont>
  );
});
GroupMembersAction.displayName = 'GroupMembersAction';
