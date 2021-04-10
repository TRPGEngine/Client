import React, { useCallback } from 'react';
import { Button } from 'antd';
import { showModal } from '@redux/actions/ui';
import GroupRuleEditor from './modal/GroupRuleEditor';
import { isGroupManager } from '@shared/helper/group';
import HTML from '@web/components/HTML';
import _isEmpty from 'lodash/isEmpty';
import { useTRPGDispatch, useTRPGSelector } from '@redux/hooks/useTRPGSelector';

const GroupRule = React.memo(() => {
  const dispatch = useTRPGDispatch();
  const groupInfo = useTRPGSelector((state) => {
    const selectedGroupUUID = state.group.selectedGroupUUID;
    return state.group.groups.find((group) => group.uuid === selectedGroupUUID);
  })!;
  const isManager = useTRPGSelector((state) => {
    const userUUID = state.user.info.uuid!;

    return isGroupManager(groupInfo, userUUID);
  });

  const handleEditRule = useCallback(() => {
    dispatch(showModal(<GroupRuleEditor />));
  }, [dispatch]);

  return (
    <div style={{ padding: 10 }}>
      {isManager && (
        <Button type="primary" onClick={handleEditRule}>
          编辑团规
        </Button>
      )}
      {!_isEmpty(groupInfo.rule) ? (
        <div>
          <HTML html={groupInfo.rule!} />
        </div>
      ) : (
        <p>主持人暂未写入规则</p>
      )}
    </div>
  );
});

export default GroupRule;
