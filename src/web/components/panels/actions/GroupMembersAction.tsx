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
interface Props {
  groupUUID: string;
}
export const GroupMembersAction: React.FC<Props> = TMemo((props) => {
  const { groupUUID } = props;
  const {
    rightPanelName,
    setRightPanel,
    resetRightPanel,
  } = useRightPanelContext();
  const handleClick = useCallback(() => {
    if (rightPanelName === ACTION_NAME) {
      resetRightPanel();
    } else {
      setRightPanel(ACTION_NAME, <GroupMembers groupUUID={groupUUID} />);
    }
  }, [rightPanelName, setRightPanel, resetRightPanel, groupUUID]);

  return (
    <Iconfont active={rightPanelName === ACTION_NAME} onClick={handleClick}>
      &#xe603;
    </Iconfont>
  );
});
GroupMembersAction.displayName = 'GroupMembersAction';
